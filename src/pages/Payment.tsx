
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, QrCode, Send, User, Clock, ArrowUpRight, ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Payment = () => {
  const { user, sendMoney } = useAuth();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const frequentContacts = [
    { name: "Sara", upiId: "sara@payapp" },
    { name: "Mike", upiId: "mike@payapp" },
    { name: "Jane", upiId: "jane@payapp" },
    { name: "Alex", upiId: "alex@payapp" }
  ];

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
    
    if (!securityCode) {
      toast.error('Please enter your security code');
      return;
    }
    
    setIsProcessing(true);
    try {
      await sendMoney(upiId, numAmount, description || 'Payment', securityCode);
      toast.success(`$${numAmount} sent to ${upiId} successfully!`);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactClick = (contactUpiId: string) => {
    setUpiId(contactUpiId);
    // Auto-scroll to amount field
    document.getElementById('amount')?.focus();
  };

  return (
    <div className="p-4 pb-20 bg-gray-50">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Send Money</h1>
      </div>
      
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 text-center mb-6">
          {frequentContacts.map((contact, index) => (
            <div 
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleContactClick(contact.upiId)}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-bold mb-1">
                {contact.name.charAt(0)}
              </div>
              <span className="text-xs">{contact.name}</span>
            </div>
          ))}
        </div>
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
          <Card className="p-6 shadow-sm border-none">
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID / Phone Number</Label>
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
                  placeholder="Payment for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="securityCode" className="flex items-center">
                  <Lock size={16} className="mr-2 text-gray-500" />
                  Security Code
                </Label>
                <Input
                  id="securityCode"
                  type="password"
                  placeholder="Enter your 4-digit code"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  required
                  className="shadow-sm"
                  maxLength={4}
                />
                <p className="text-xs text-gray-500">Required for security verification</p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600" 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Send Money'}
                </Button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Current Balance: ${user.balance.toFixed(2)}</p>
              </div>
            </form>
          </Card>

          <div className="mt-6">
            <h3 className="font-medium mb-4 text-gray-700">Recent Transactions</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="p-3 flex items-center shadow-sm border-none">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Clock size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Recent Contact {index}</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    <ArrowUpRight size={16} />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="qr">
          <Card className="p-6 text-center shadow-sm border-none">
            <div className="mb-4">
              <QrCode size={40} className="mx-auto text-blue-500" />
            </div>
            <h3 className="font-medium mb-2">Scan QR Code</h3>
            <p className="text-gray-500 text-sm mb-4">
              This feature would use your camera to scan QR codes
            </p>
            <Button variant="outline" className="mx-auto shadow-sm">
              Scan QR Code
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Demo version: Camera access simulated
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card className="p-6 shadow-sm border-none">
            <div className="mb-4">
              <Input
                placeholder="Search contacts..."
                className="shadow-sm"
              />
            </div>
            
            <div className="space-y-3">
              {frequentContacts.map((contact, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 border-b last:border-b-0 cursor-pointer"
                  onClick={() => handleContactClick(contact.upiId)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-md font-bold mr-3">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.upiId}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center justify-center">
        <ShieldCheck size={16} className="text-green-600 mr-2" />
        <p className="text-xs text-gray-500">All transactions are secure and encrypted</p>
      </div>
    </div>
  );
};

export default Payment;
