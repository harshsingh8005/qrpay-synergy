
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TransactionItem from '../components/TransactionItem';

const Transactions = () => {
  const { user, transactions } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const filteredTransactions = searchTerm
    ? transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.to.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transactions;

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Transaction History</h1>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search transactions..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredTransactions.length > 0 ? (
        <Card className="overflow-hidden">
          {filteredTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
              userUpiId={user.upiId}
            />
          ))}
        </Card>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? 'No matching transactions found' : 'No transaction history yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
