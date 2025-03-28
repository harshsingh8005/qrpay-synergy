
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddMoney = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update user balance would happen in real implementation
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success(`₹${numAmount} added successfully`);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Add Money</h1>
      </div>
      
      {isSuccess ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Money Added Successfully!</h2>
          <p className="text-gray-600 mb-6">₹{amount} has been added to your wallet</p>
          <Button onClick={() => navigate('/')} className="upi-gradient">
            Back to Home
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full upi-gradient" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Add Money'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium mb-4">Choose payment method</h3>
            
            <div className="space-y-3">
              {user.linkedBanks.length > 0 ? (
                user.linkedBanks.map((bank) => (
                  <Card key={bank.id} className="p-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CreditCard size={20} className="text-upi-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{bank.name}</p>
                      <p className="text-sm text-gray-500">{bank.accountNumber}</p>
                    </div>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      defaultChecked={bank.isDefault}
                      className="h-4 w-4 text-upi-blue focus:ring-upi-blue" 
                    />
                  </Card>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-2">No bank accounts linked</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/link-bank')}
                  >
                    Add Bank Account
                  </Button>
                </div>
              )}
              
              <Card className="p-3 flex items-center opacity-50">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <CreditCard size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Credit / Debit Card</p>
                  <p className="text-sm text-gray-500">Add new card</p>
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  disabled
                  className="h-4 w-4 text-gray-400" 
                />
              </Card>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AddMoney;
