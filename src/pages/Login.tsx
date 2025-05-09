
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled by the auth context
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">PaySync</h1>
        <p className="text-gray-600 mt-2">Fast and secure payments in USD</p>
      </div>

      <Card className="max-w-md w-full mx-auto p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white" 
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Demo credentials:</p>
          <p>Email: john@example.com / Password: any text</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
