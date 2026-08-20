import { Download, Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ownerStats } from '../../mocks/ownerData';

const Earnings = () => {
  const transactions = [
    {
      id: 't1',
      description: 'Booking payment - Toyota Corolla',
      date: '2026-08-20',
      type: 'credit',
      amount: 12750,
      booking_ref: 'BK_ABC123',
    },
    {
      id: 't2',
      description: 'Booking payment - Honda Civic',
      date: '2026-08-18',
      type: 'credit',
      amount: 13600,
      booking_ref: 'BK_DEF456',
    },
    {
      id: 't3',
      description: 'Withdrawal to bKash',
      date: '2026-08-15',
      type: 'debit',
      amount: 20000,
      booking_ref: 'WD_GHI789',
    },
  ];
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Earnings</h1>
          <p className="text-slate-500">Track your income and withdrawals</p>
        </div>
        
        <Button variant="outline" className="mt-4 sm:mt-0">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
      
      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white border-green-700">
          <Wallet className="w-8 h-8 mb-3" />
          <p className="text-sm text-green-100 mb-1">Available Balance</p>
          <p className="text-3xl font-bold">৳25,000</p>
        </Card>
        
        <Card>
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-slate-900">
            ৳{ownerStats.totalRevenue.toLocaleString()}
          </p>
        </Card>
        
        <Card>
          <TrendingDown className="w-8 h-8 text-red-600 mb-3" />
          <p className="text-sm text-slate-500 mb-1">Total Withdrawn</p>
          <p className="text-3xl font-bold text-slate-900">৳100,000</p>
        </Card>
      </div>
      
      {/* Transactions */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h2>
      
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
                {tx.date}
                <span className="ml-2">Ref: {tx.booking_ref}</span>
              </p>
            </div>
            
            <p className={`font-semibold ${
              tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}>
              {tx.type === 'credit' ? '+' : '-'}৳{tx.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Earnings;