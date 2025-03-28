
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, QrCode, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Payment = () => {
  const { user, sendMoney } = useAuth();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSendMoney = async (e: React.FormEvent) => {
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
    
    if (numAmount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    setIsProcessing(true);
    try {
      await sendMoney(upiId, numAmount, description || 'Payment');
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
        <h1 className="text-xl font-semibold ml-2">Send Money</h1>
      </div>
      
      <Tabs defaultValue="upi" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upi" className="flex items-center">
            <Send size={16} className="mr-2" />
            UPI ID
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center">
            <QrCode size={16} className="mr-2" />
            Scan QR
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center">
            <User size={16} className="mr-2" />
            Contacts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upi">
          <Card className="p-6">
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID / Phone Number</Label>
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
                  placeholder="Payment for..."
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
                  {isProcessing ? 'Processing...' : 'Send Money'}
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Current Balance: ₹{user.balance.toFixed(2)}</p>
              </div>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="qr">
          <Card className="p-6 text-center">
            <div className="mb-4">
              <QrCode size={40} className="mx-auto text-gray-400" />
            </div>
            <h3 className="font-medium mb-2">Scan QR Code</h3>
            <p className="text-gray-500 text-sm mb-4">
              This feature would use your camera to scan QR codes
            </p>
            <Button variant="outline" className="mx-auto" disabled>
              Scan QR Code
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Demo version: This feature is not available in the demo
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card className="p-6 text-center">
            <div className="mb-4">
              <User size={40} className="mx-auto text-gray-400" />
            </div>
            <h3 className="font-medium mb-2">Select from Contacts</h3>
            <p className="text-gray-500 text-sm mb-4">
              This feature would display your contacts with UPI IDs
            </p>
            <Button variant="outline" className="mx-auto" disabled>
              Access Contacts
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Demo version: This feature is not available in the demo
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
