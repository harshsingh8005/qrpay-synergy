import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Building, CreditCard, QrCode, Repeat, Send, UserPlus } from 'lucide-react';
import TransactionItem from '../components/TransactionItem';

const Dashboard = () => {
  const { user, transactions, logout } = useAuth();
  const navigate = useNavigate();
  const [showFullBalance, setShowFullBalance] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const recentTransactions = transactions.slice(0, 5);
  
  const maskedBalance = `₹${'•'.repeat(5)}`;
  const actualBalance = `₹${user.balance.toFixed(2)}`;

  return (
    <div className="pb-20">
      {/* Header with Balance */}
      <div className="upi-gradient text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-bold text-xl">Hello, {user.name.split(' ')[0]}</h1>
            <p className="text-white/80 text-sm">{user.upiId}</p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => logout()}>
            Logout
          </Button>
        </div>
        
        <Card className="mt-6 p-4 bg-white/10 backdrop-blur-sm border-none">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm">Available Balance</p>
              <h2 className="text-2xl font-bold" onClick={() => setShowFullBalance(!showFullBalance)}>
                {showFullBalance ? actualBalance : maskedBalance}
              </h2>
            </div>
            <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/30" onClick={() => navigate('/add-money')}>
              Add Money
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          <div 
            className="flex flex-col items-center" 
            onClick={() => navigate('/payment')}
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-1">
              <Send size={24} className="text-upi-blue" />
            </div>
            <span className="text-xs text-center">Send</span>
          </div>
          
          <div 
            className="flex flex-col items-center"
            onClick={() => navigate('/request')}
          >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-1">
              <Repeat size={24} className="text-green-600" />
            </div>
            <span className="text-xs text-center">Request</span>
          </div>
          
          <div 
            className="flex flex-col items-center"
            onClick={() => navigate('/qr-code')}
          >
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-1">
              <QrCode size={24} className="text-purple-600" />
            </div>
            <span className="text-xs text-center">QR Code</span>
          </div>
          
          <div 
            className="flex flex-col items-center"
            onClick={() => navigate('/link-bank')}
          >
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-1">
              <Building size={24} className="text-orange-600" />
            </div>
            <span className="text-xs text-center">Add Bank</span>
          </div>
        </div>
      </div>
      
      {/* Linked Banks */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Your Banks</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-upi-blue"
            onClick={() => navigate('/link-bank')}
          >
            Add New
          </Button>
        </div>
        
        {user.linkedBanks.length > 0 ? (
          <div className="space-y-3">
            {user.linkedBanks.map((bank) => (
              <Card key={bank.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{bank.name}</p>
                    <p className="text-sm text-gray-500">{bank.accountNumber}</p>
                  </div>
                </div>
                {bank.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-gray-500 mb-3">No bank accounts linked yet</p>
            <Button 
              variant="outline" 
              className="mx-auto"
              onClick={() => navigate('/link-bank')}
            >
              <Building size={16} className="mr-2" />
              Link Bank Account
            </Button>
          </Card>
        )}
      </div>
      
      {/* Recent Transactions */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-upi-blue"
            onClick={() => navigate('/transactions')}
          >
            View All
          </Button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <Card className="overflow-hidden">
            {recentTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                userUpiId={user.upiId}
              />
            ))}
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-3">No transactions yet</p>
            <Button 
              variant="outline" 
              className="mx-auto"
              onClick={() => navigate('/payment')}
            >
              <Send size={16} className="mr-2" />
              Make Your First Payment
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
