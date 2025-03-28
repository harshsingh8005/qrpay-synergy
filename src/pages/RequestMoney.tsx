
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RequestMoney = () => {
  const { user, requestMoney } = useAuth();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRequestMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId.trim()) {
      toast.error('Please enter a UPI ID');
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    try {
      await requestMoney(upiId, numAmount, description || 'Payment Request');
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Request Money</h1>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleRequestMoney} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">Request From (UPI ID / Phone Number)</Label>
            <Input
              id="upiId"
              placeholder="name@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Request for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full upi-gradient" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Request Money'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            In the real world, the recipient would receive a notification to approve the payment. 
            For this demo, requests are automatically simulated as approved.
          </p>
        </div>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Recent Contacts</h2>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          {["Jane", "Mike", "Sara", "Alex"].map((name, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
              onClick={() => setUpiId(`${name.toLowerCase()}@upibank`)}
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <User size={24} className="text-gray-600" />
              </div>
              <span className="text-xs">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestMoney;
