
import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { generateUpiPaymentUri, copyToClipboard } from '../utils/qrUtils';
import { toast } from 'sonner';

// Import QRCode from react-qr-code
// We'll add this dependency
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
    <Card className="p-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Your Payment QR Code</h3>
          <div className="flex items-center justify-center mb-2">
            <span className="text-sm font-medium mr-2">{user.upiId}</span>
            <Button variant="ghost" size="icon" onClick={handleCopyUpiId} className="h-6 w-6">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </Button>
          </div>
        </div>

        {showAmountInput && (
          <div className="w-full space-y-4 mb-4">
            <div>
              <Label htmlFor="amount">Amount (Optional)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCode
            value={upiUri}
            size={200}
            level="H"
          />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Scan this QR code to pay using any UPI app</p>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
