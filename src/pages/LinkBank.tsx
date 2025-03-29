
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LinkBank = () => {
  const { user, linkBank, isLoading } = useAuth();
  const navigate = useNavigate();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isDefault, setIsDefault] = useState(user?.linkedBanks.length === 0);
  const [formStep, setFormStep] = useState(1);

  const usBanks = [
    { name: "Chase Bank", routingPrefix: "021" },
    { name: "Bank of America", routingPrefix: "026" },
    { name: "Wells Fargo", routingPrefix: "121" },
    { name: "Citibank", routingPrefix: "031" },
    { name: "Capital One", routingPrefix: "056" }
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accountNumber !== confirmAccountNumber) {
      toast.error('Account numbers do not match');
      return;
    }

    // Validate routing number
    if (routingNumber.length !== 9) {
      toast.error('Routing number must be 9 digits');
      return;
    }

    try {
      await linkBank({
        name: bankName,
        accountNumber,
        routingNumber,
        isDefault,
      });
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const goToNextStep = () => {
    if (!bankName || !routingNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    setFormStep(2);
  };

  const handleBankSelect = (name: string, routingPrefix: string) => {
    setBankName(name);
    setRoutingNumber(routingPrefix + "000000"); // Set a default routing number prefix
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Link Bank Account</h1>
      </div>
      
      <Card className="p-6">
        {formStep === 1 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Step 1: Select Bank</h2>
            
            <div className="space-y-3 my-4">
              {usBanks.map((bank, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    bankName === bank.name ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleBankSelect(bank.name, bank.routingPrefix)}
                >
                  <p className="font-medium">{bank.name}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="Enter 9-digit routing number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
                required
              />
              <p className="text-xs text-gray-500">Enter the 9-digit routing number for your bank</p>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full upi-gradient"
                onClick={goToNextStep}
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium">Step 2: Account Details</h2>
            
            <div className="border p-3 rounded-md bg-gray-50 mb-4">
              <p className="text-sm font-medium">{bankName}</p>
              <p className="text-xs text-gray-500">Routing Number: {routingNumber}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
              <Input
                id="confirmAccountNumber"
                placeholder="Re-enter account number"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="defaultAccount"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <Label htmlFor="defaultAccount" className="text-sm">
                Set as default account for receiving payments
              </Label>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full upi-gradient" 
                disabled={isLoading}
              >
                {isLoading ? 'Linking...' : 'Link Bank Account'}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                className="w-full mt-2" 
                onClick={() => setFormStep(1)}
              >
                Back
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-6">
          <p className="text-xs text-gray-500 text-center">
            Your bank account details are securely encrypted and stored according to industry standards.
          </p>
        </div>
      </Card>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-start">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm">Securely link your US bank account to receive payments directly</p>
        </div>
        
        <div className="flex items-start">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm">Your money will be transferred to your linked bank account instantly</p>
        </div>
        
        <div className="flex items-start">
          <CheckCircle2 size={20} className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm">You can add multiple bank accounts and set your preferred default account</p>
        </div>
      </div>
    </div>
  );
};

export default LinkBank;
