import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  AlertCircle,
  CheckCircle,
  Car,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import vehicleService from '../../services/vehicleService';
import api from '../../services/api';

const AddVehicle = () => {
  const navigate = useNavigate();
  
  // Multi-step state
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(3);
  
  // Step 1: Vehicle Info
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vehicle_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'petrol',
    seats: 5,
    color: '',
    registration_number: '',
    description: '',
    daily_rate: '',
    deposit_amount: '',
    branch_id: '',
  });
  
  // Step 2: Images
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Step 3: Documents
  const [documents, setDocuments] = useState([
    { type: 'vehicle_rc', label: 'Vehicle Registration Certificate', file: null, required: true },
    { type: 'insurance', label: 'Insurance Document', file: null, required: true },
    { type: 'vehicle_photo', label: 'Vehicle Photo (Front)', file: null, required: true },
  ]);
  
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchBranches();
  }, []);
  
  const fetchBranches = async () => {
    try {
      const response = await api.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter((f) => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      alert('Only JPG, PNG, WebP images allowed');
      return;
    }
    
    if (files.length + images.length > 5) {
      alert('Maximum 5 images');
      return;
    }
    
    setImages([...images, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews([...imagePreviews, ...previews]);
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };
  
  const handleDocumentChange = (index, file) => {
    const newDocuments = [...documents];
    newDocuments[index].file = file;
    setDocuments(newDocuments);
  };
  
  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.brand || !formData.model || !formData.daily_rate || !formData.deposit_amount || !formData.branch_id) {
        alert('Please fill all required fields');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (images.length === 0) {
        alert('Please upload at least 1 vehicle image');
        return false;
      }
    }
    
    if (currentStep === 3) {
      const missingDocs = documents.filter((d) => d.required && !d.file);
      if (missingDocs.length > 0) {
        alert(`Please upload: ${missingDocs.map((d) => d.label).join(', ')}`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Step 1: Create vehicle
      const payload = {
        ...formData,
        year: Number(formData.year),
        seats: Number(formData.seats),
        daily_rate: Number(formData.daily_rate),
        deposit_amount: Number(formData.deposit_amount),
      };
      
      const vehicleResponse = await vehicleService.createVehicle(payload);
      const vehicleId = vehicleResponse.data?.id;
      
      console.log('✅ Vehicle created:', vehicleId);
      
      // Step 2: Upload images
      if (vehicleId && images.length > 0) {
        const formDataObj = new FormData();
        images.forEach((image) => formDataObj.append('images', image));
        await vehicleService.uploadImages(vehicleId, formDataObj);
        console.log('✅ Images uploaded');
      }
      
      // Step 3: Upload documents (linked to vehicle)
      for (const doc of documents) {
        if (doc.file) {
          const docFormData = new FormData();
          docFormData.append('document_type', doc.type);
          docFormData.append('file', doc.file);
          docFormData.append('vehicle_id', vehicleId);  // ✅ Link to vehicle
          
          await api.post('/documents/upload', docFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log(`✅ ${doc.label} uploaded`);
        }
      }
      
      setSuccess('Vehicle added successfully! Pending admin approval.');
      setTimeout(() => navigate('/owner/vehicles'), 2000);
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };
  
  const steps = ['Vehicle Info', 'Images', 'Documents'];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Add New Vehicle</h1>
      <p className="text-slate-500 mb-6">List your vehicle with complete documentation</p>
      
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              step === index + 1
                ? 'bg-blue-600 text-white'
                : step > index + 1
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                step > index + 1 ? 'bg-green-600 text-white' : step === index + 1 ? 'bg-white text-blue-600' : 'bg-slate-200'
              }`}>
                {step > index + 1 ? '✓' : index + 1}
              </span>
              {label}
            </div>
            {index < steps.length - 1 && <div className="w-8 h-0.5 bg-slate-200 mx-2" />}
          </div>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2 text-red-700 mb-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700 mb-4">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {/* STEP 1: Vehicle Info */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Brand *" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g., Toyota" required />
              <Input label="Model *" name="model" value={formData.model} onChange={handleChange} placeholder="e.g., Corolla" required />
              <Input label="Year *" name="year" type="number" value={formData.year} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Type *</label>
                <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2.5 text-sm">
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="microbus">Microbus</option>
                  <option value="pickup">Pickup</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Daily Rate (৳) *" name="daily_rate" type="number" min="500" value={formData.daily_rate} onChange={handleChange} required />
              <Input label="Deposit (৳) *" name="deposit_amount" type="number" min="1000" value={formData.deposit_amount} onChange={handleChange} required />
            </div>
          </Card>
          
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4">Location</h2>
            <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full border rounded-lg px-3 py-2.5 text-sm" required>
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>
              ))}
            </select>
          </Card>
        </div>
      )}
      
      {/* STEP 2: Images */}
      {step === 2 && (
        <Card>
          <h2 className="font-semibold text-slate-900 mb-4">Vehicle Images (Max 5)</h2>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs">✕</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      
      {/* STEP 3: Documents */}
      {step === 3 && (
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <Card key={doc.type} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{doc.label} {doc.required && <span className="text-red-600">*</span>}</p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG • Max 5MB</p>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleDocumentChange(index, e.target.files[0])}
                className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
              />
              {doc.file && <Badge variant="success" size="sm">Uploaded</Badge>}
            </Card>
          ))}
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        
        {step < totalSteps ? (
          <Button fullWidth onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button fullWidth onClick={handleSubmit} isLoading={loading}>
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddVehicle;