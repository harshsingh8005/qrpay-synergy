
import React, { useEffect, useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { generateUpiPaymentUri, copyToClipboard } from '../utils/qrUtils';
import { toast } from 'sonner';

// Import QRCode from react-qr-code
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  showAmountInput?: boolean;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ showAmountInput = true }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [upiUri, setUpiUri] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const uri = generateUpiPaymentUri(
        user.upiId,
        user.name,
        amount ? parseFloat(amount) : undefined,
        description || undefined
      );
      setUpiUri(uri);
    }
  }, [user, amount, description]);

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

  if (!user) return null;

  return (
    <Card className="p-6 shadow-lg border-none bg-white">
      <div className="flex flex-col items-center space-y-6">
        {showAmountInput && (
          <div className="w-full space-y-4 mb-4">
            <div>
              <Label htmlFor="amount">Amount (Optional)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 shadow-sm"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 shadow-sm"
              />
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100" ref={qrRef}>
          <QRCode
            value={upiUri}
            size={200}
            level="H"
            fgColor="#1e40af"
            bgColor="#ffffff"
          />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-700">Your Payment ID: <span className="font-medium">{user.upiId}</span></p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyUpiId} 
            className="flex items-center"
          >
            {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
            {copied ? 'Copied' : 'Copy ID'}
          </Button>
          <p className="text-xs text-gray-500 mt-2">Scan this QR code to receive payment via any UPI app</p>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
