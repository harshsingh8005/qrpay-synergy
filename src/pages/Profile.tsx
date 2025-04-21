
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, User, CreditCard, Settings, Lock, HelpCircle, LogOut, Smartphone, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/qrUtils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Preferences state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Security
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  // Collapsible panes
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleCopyUid = async () => {
    const success = await copyToClipboard(user.upiId);
    if (success) {
      setCopied(true);
      toast.success('UID copied to clipboard');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Failed to copy UID');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePreferencesSave = () => {
    toast.success('Preferences saved!');
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error('Please fill all fields');
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed!');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  // Customizable FAQ entries
  const faqs = [
    {
      q: "How do I link a new US bank account?",
      a: "Go to 'Bank Accounts', click 'Link Bank', and enter your account details.",
    },
    {
      q: "How do I change my security code?",
      a: "Under 'Security', update your password and security settings.",
    },
    {
      q: "Is my UID visible to others?",
      a: "Yes, your UID is used to receive payments and can be safely shared.",
    },
    {
      q: "How do I enable two-way authentication?",
      a: "Go to 'Security' and turn on Two-Way Authentication.",
    },
    {
      q: "Need more help?",
      a: "Contact our support at support@payapp.com.",
    },
  ];

  return (
    <div className="p-4 pb-20 bg-gray-50">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Your Profile</h1>
      </div>
      
      {/* User Info Card */}
      <Card className="p-6 mb-6 shadow-sm border-none">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-bold mr-4">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-600 mr-2">{user.upiId}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUid}>
                {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <div className="mt-2">
              <span className="font-semibold text-lg text-blue-700">Available Balance: </span>
              <span className="text-lg font-semibold text-gray-800">${user.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-3">
        {/* PERSONAL DETAILS */}
        <Collapsible open={openPanel === 'details'} onOpenChange={() => setOpenPanel(openPanel === 'details' ? null : 'details')}>
          <Card className="p-4 shadow-sm border-none">
            <CollapsibleTrigger asChild>
              <div className="flex items-center cursor-pointer" onClick={() => setOpenPanel(openPanel === 'details' ? null : 'details')}>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Personal Details</p>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={16} className="rotate-180" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={user.name} readOnly className="mb-2" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} readOnly className="mb-2" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={user.phone} readOnly className="mb-2" />
                </div>
                <div>
                  <Label>UID</Label>
                  <Input value={user.upiId} readOnly className="mb-2" />
                </div>
                <div className="md:col-span-2">
                  <Label>Linked Banks</Label>
                  <ul className="text-sm bg-gray-100 rounded p-2">
                    {user.linkedBanks.length === 0 && <li>No linked banks</li>}
                    {user.linkedBanks.map(b => (
                      <li key={b.id} className="py-1">{b.name} - {b.accountNumber} ({b.isDefault ? 'Default' : 'Secondary'})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* BANK ACCOUNTS */}
        <Card className="p-4 flex items-center hover:bg-gray-50 transition-colors shadow-sm border-none" onClick={() => navigate('/link-bank')}>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <CreditCard size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Bank Accounts</p>
            <p className="text-sm text-gray-500">Manage your linked US banks</p>
          </div>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={16} className="rotate-180" />
          </Button>
        </Card>
        
        {/* PREFERENCES */}
        <Collapsible open={openPanel === 'preferences'} onOpenChange={() => setOpenPanel(openPanel === 'preferences' ? null : 'preferences')}>
          <Card className="p-4 shadow-sm border-none">
            <CollapsibleTrigger asChild>
              <div className="flex items-center cursor-pointer" onClick={() => setOpenPanel(openPanel === 'preferences' ? null : 'preferences')}>
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
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  <Label htmlFor="notifications">Enable Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="darkmode" checked={darkMode} onCheckedChange={setDarkMode} />
                  <Label htmlFor="darkmode">Enable Dark Mode</Label>
                </div>
                <Button className="mt-4" onClick={handlePreferencesSave}>Save Preferences</Button>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* SECURITY SETTINGS */}
        <Collapsible open={openPanel === 'security'} onOpenChange={() => setOpenPanel(openPanel === 'security' ? null : 'security')}>
          <Card className="p-4 shadow-sm border-none">
            <CollapsibleTrigger asChild>
              <div className="flex items-center cursor-pointer" onClick={() => setOpenPanel(openPanel === 'security' ? null : 'security')}>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <Lock size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Security</p>
                  <p className="text-sm text-gray-500">Change password, enable two-way authentication, and manage security settings</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={16} className="rotate-180" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator className="my-4" />
              {/* Change Password */}
              <div className="mb-4">
                <Label className="mb-1 block">Change Password</Label>
                <Input
                  type="password"
                  placeholder="Current password"
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  className="mb-2"
                />
                <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
              </div>
              {/* Two-way authentication */}
              <div className="flex items-center mb-3">
                <Checkbox id="2fa" checked={twoFA} onCheckedChange={setTwoFA} />
                <Label htmlFor="2fa" className="ml-2">Enable Two-Way Authentication</Label>
              </div>
              <div className="mb-2">
                <Label className="block mb-1">Other Security Settings</Label>
                <p className="text-xs text-gray-500">You can manage security code and other options here soon.</p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* HELP & SUPPORT */}
        <Collapsible open={openPanel === 'help'} onOpenChange={() => setOpenPanel(openPanel === 'help' ? null : 'help')}>
          <Card className="p-4 shadow-sm border-none">
            <CollapsibleTrigger asChild>
              <div className="flex items-center cursor-pointer" onClick={() => setOpenPanel(openPanel === 'help' ? null : 'help')}>
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
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator className="my-4" />
              <div className="mb-4">
                <h3 className="font-semibold mb-2">FAQs</h3>
                <div className="space-y-2">
                  {faqs.map((f, idx) => (
                    <div key={idx} className="p-2 bg-gray-100 rounded">
                      <span className="font-medium">{f.q}</span>
                      <br />
                      <span className="text-sm">{f.a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-3" />
              <div>
                <h3 className="font-semibold mb-1">Contact Support</h3>
                <p className="text-sm text-gray-600">For urgent help, email <a href="mailto:support@payapp.com" className="text-blue-700 underline">support@payapp.com</a></p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
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

