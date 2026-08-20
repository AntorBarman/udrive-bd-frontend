import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Banknote,
  ArrowDownToLine,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import walletService from '../../services/walletService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OwnerEarnings = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bkash');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  
  useEffect(() => {
    if (accessToken) {
      fetchWalletData();
    }
  }, [accessToken]);
  
  const fetchWalletData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [balanceRes, txRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions({ page: 1, limit: 20 }),
      ]);
      
      setBalance(balanceRes.data || balanceRes);
      setTransactions(txRes.data || []);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      setError(error.response?.data?.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };
  
  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (Number(withdrawAmount) > (balance?.currentBalance || 0)) {
      alert('Insufficient balance');
      return;
    }
    
    setWithdrawLoading(true);
    
    // Simulate withdrawal
    setTimeout(() => {
      alert(`Withdrawal request submitted: ৳${Number(withdrawAmount).toLocaleString()} via ${withdrawMethod}`);
      setWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawLoading(false);
      fetchWalletData();
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        title="Failed to Load Wallet"
        message={error}
        onRetry={fetchWalletData}
      />
    );
  }
  
  const currentBalance = balance?.currentBalance || balance?.balance || 0;
  const totalCredit = balance?.totalCredit || 0;
  const totalDebit = balance?.totalDebit || 0;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Wallet & Payouts</h1>
      <p className="text-slate-500 mb-8">Track your earnings and withdraw funds</p>
      
      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Available Balance */}
        <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white border-green-700">
          <Wallet className="w-8 h-8 mb-3" />
          <p className="text-sm text-green-100 mb-1">Available Balance</p>
          <p className="text-3xl font-bold">{formatCurrency(currentBalance)}</p>
          <button
            onClick={() => setWithdrawModal(true)}
            className="mt-4 bg-white text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 flex items-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Withdraw Funds
          </button>
        </Card>
        
        {/* Total Earnings */}
        <Card>
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalCredit)}</p>
        </Card>
        
        {/* Total Withdrawn */}
        <Card>
          <TrendingDown className="w-8 h-8 text-red-600 mb-3" />
          <p className="text-sm text-slate-500 mb-1">Total Withdrawn</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalDebit)}</p>
        </Card>
      </div>
      
      {/* Transactions */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Transaction History</h2>
      
      {transactions.length > 0 ? (
        <Card className="divide-y divide-slate-100 p-0">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {tx.type === 'credit' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-slate-900">{tx.description}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(tx.created_at)}
                </p>
              </div>
              
              <p className={`font-semibold ${
                tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState
          title="No Transactions Yet"
          description="Your earnings will appear here once you receive bookings."
        />
      )}
      
      {/* Withdraw Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setWithdrawModal(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-600" />
              Withdraw Funds
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Available: {formatCurrency(currentBalance)}</p>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Withdraw Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => setWithdrawModal(false)}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleWithdraw} isLoading={withdrawLoading}>
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerEarnings;