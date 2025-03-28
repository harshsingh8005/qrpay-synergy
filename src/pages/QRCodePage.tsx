
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { toast } from 'sonner';

const QRCodePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleDownload = () => {
    // This would implement actual QR code download functionality
    // For the demo, we'll just show a toast
    toast.success('QR Code download functionality would be implemented here');
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Your QR Code</h1>
      </div>
      
      <div className="mb-6">
        <QRCodeGenerator showAmountInput={true} />
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleDownload} className="flex items-center">
          <Download size={16} className="mr-2" />
          Download QR Code
        </Button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">How to use</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>Share this QR code with people who need to pay you</li>
          <li>They can scan it using any UPI app</li>
          <li>Money will be transferred directly to your linked bank account</li>
          <li>Add an amount and description for a more specific payment request</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodePage;
