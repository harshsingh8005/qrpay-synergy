
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RequestMoney = () => {
  const { user, requestMoney } = useAuth();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
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
      setIsSuccess(true);
      toast.success(`Request for ₹${numAmount} sent successfully`);
      
      // Reset form after success
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsProcessing(false);
    }
  };

  const frequentContacts = [
    { name: "Jane", upiId: "jane@upibank" },
    { name: "Mike", upiId: "mike@upibank" },
    { name: "Sara", upiId: "sara@upibank" },
    { name: "Alex", upiId: "alex@upibank" }
  ];

  return (
    <div className="p-4 pb-20 bg-gray-50">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Request Money</h1>
      </div>
      
      {isSuccess ? (
        <Card className="p-8 text-center shadow-sm border-none">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Request Sent!</h2>
          <p className="text-gray-600 mb-6">Your payment request has been sent successfully</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
            Back to Home
          </Button>
        </Card>
      ) : (
        <>
          <Card className="p-6 shadow-sm border-none">
            <form onSubmit={handleRequestMoney} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">Request From (UID / Phone Number)</Label>
                <Input
                  id="upiId"
                  placeholder="name@payapp"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  className="shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 shadow-sm"
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
                  className="shadow-sm"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Request Money'}
                </Button>
              </div>
            </form>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Recent Contacts</h2>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              {frequentContacts.map((contact, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setUpiId(contact.upiId)}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-bold mb-1">
                    {contact.name.charAt(0)}
                  </div>
                  <span className="text-xs">{contact.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Request History</h2>
            
            <Card className="p-3 shadow-sm border-none">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Clock size={24} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">No recent requests</p>
                  <p className="text-sm text-gray-500">Your recent requests will appear here</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestMoney;
