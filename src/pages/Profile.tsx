
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, User, CreditCard, Settings, Lock, HelpCircle, LogOut, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/qrUtils';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCopyUpiId = async () => {
    const success = await copyToClipboard(user.upiId);
    if (success) {
      setCopied(true);
      toast.success('UPI ID copied to clipboard');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Failed to copy UPI ID');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Your Profile</h1>
      </div>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-upi-blue to-upi-blue-light flex items-center justify-center text-white text-xl font-bold mr-4">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-600 mr-2">{user.upiId}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUpiId}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        <Card className="p-4 flex items-center" onClick={() => navigate('/profile/details')}>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <User size={20} className="text-upi-blue" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Personal Details</p>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
        
        <Card className="p-4 flex items-center" onClick={() => navigate('/link-bank')}>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <CreditCard size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Bank Accounts</p>
            <p className="text-sm text-gray-500">Manage your linked banks</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
        
        <Card className="p-4 flex items-center" onClick={() => navigate('/preferences')}>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <Settings size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Preferences</p>
            <p className="text-sm text-gray-500">App settings and notifications</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
        
        <Card className="p-4 flex items-center" onClick={() => navigate('/security')}>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <Lock size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Security</p>
            <p className="text-sm text-gray-500">Change password and security settings</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
        
        <Card className="p-4 flex items-center" onClick={() => navigate('/help')}>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
            <HelpCircle size={20} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Help & Support</p>
            <p className="text-sm text-gray-500">FAQs and contact support</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
