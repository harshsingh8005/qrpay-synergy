
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Copy, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/qrUtils';

const QRCodePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleDownload = () => {
    // This would implement actual QR code download functionality
    // For the demo, we'll just show a toast
    toast.success('QR Code downloaded successfully');
  };

  const handleShare = () => {
    // This would implement share functionality
    // For the demo, we'll just show a toast
    toast.success('Sharing options would appear here');
  };

  const handleCopyUpiId = async () => {
    if (user) {
      const success = await copyToClipboard(user.upiId);
      if (success) {
        setCopied(true);
        toast.success('UPI ID copied to clipboard');
        setTimeout(() => setCopied(false), 3000);
      } else {
        toast.error('Failed to copy UPI ID');
      }
    }
  };

  return (
    <div className="p-4 pb-20 bg-gray-50">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Your QR Code</h1>
      </div>
      
      <div className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <div className="flex items-center justify-center mt-1">
            <p className="text-sm text-gray-600 mr-2">{user.upiId}</p>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUpiId}>
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            </Button>
          </div>
        </div>
        <QRCodeGenerator showAmountInput={true} />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} className="flex items-center bg-blue-600 hover:bg-blue-700">
          <Download size={16} className="mr-2" />
          Download
        </Button>
        
        <Button onClick={handleShare} variant="outline" className="flex items-center">
          <Share2 size={16} className="mr-2" />
          Share
        </Button>
      </div>
      
      <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
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
