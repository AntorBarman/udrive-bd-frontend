import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Car, CheckCircle 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { isValidEmail, isValidBangladeshPhone, getPasswordStrength } from '../../utils/validators';
import { register } from './authSlice';

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: apiError } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidBangladeshPhone(formData.phone)) {
      newErrors.phone = 'Invalid Bangladesh phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 4) {
      newErrors.password = 'Password too weak';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const result = await dispatch(register(formData));
    
    if (register.fulfilled.match(result)) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {apiError}
        </div>
      )}
      
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        error={errors.name}
        required
      />
      
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        error={errors.email}
        required
      />
      
      <Input
        label="Phone Number"
        type="tel"
        placeholder="01XXXXXXXXX"
        icon={Phone}
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        error={errors.phone}
        required
      />
      
      <div>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            error={errors.password}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Strength: <span className="font-medium">{passwordStrength.label}</span>
            </p>
          </div>
        )}
      </div>
      
      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          I want to join as
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({...formData, role: 'customer'})}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              formData.role === 'customer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-medium text-slate-900">Customer</p>
            <p className="text-xs text-slate-500">Rent cars</p>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({...formData, role: 'owner'})}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              formData.role === 'owner'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-slate-900">Owner</p>
            <p className="text-xs text-slate-500">List cars</p>
          </button>
        </div>
      </div>
      
      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        Create Account
      </Button>
      
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;