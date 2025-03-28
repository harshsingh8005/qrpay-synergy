
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  balance: number;
  linkedBanks: Bank[];
}

export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  ifsc: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  from: string;
  to: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  transactions: Transaction[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  linkBank: (bank: Omit<Bank, 'id'>) => Promise<void>;
  sendMoney: (to: string, amount: number, description: string) => Promise<void>;
  requestMoney: (from: string, amount: number, description: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    upiId: 'john@upibank',
    balance: 5000,
    linkedBanks: [
      {
        id: '1',
        name: 'State Bank',
        accountNumber: 'XXXX1234',
        ifsc: 'SBIN0001234',
        isDefault: true,
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '9876543211',
    upiId: 'jane@upibank',
    balance: 3500,
    linkedBanks: [
      {
        id: '2',
        name: 'HDFC Bank',
        accountNumber: 'XXXX5678',
        ifsc: 'HDFC0001234',
        isDefault: true,
      }
    ]
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 100,
    type: 'credit',
    from: 'jane@upibank',
    to: 'john@upibank',
    timestamp: new Date(2023, 6, 15, 12, 30),
    status: 'completed',
    description: 'Lunch payment'
  },
  {
    id: '2',
    amount: 500,
    type: 'debit',
    from: 'john@upibank',
    to: 'jane@upibank',
    timestamp: new Date(2023, 6, 14, 15, 45),
    status: 'completed',
    description: 'Rent'
  },
  {
    id: '3',
    amount: 50,
    type: 'credit',
    from: 'jane@upibank',
    to: 'john@upibank',
    timestamp: new Date(2023, 6, 13, 10, 20),
    status: 'completed',
    description: 'Coffee'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('upi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Load transactions if user is logged in
        const userTransactions = mockTransactions.filter(
          t => t.from === JSON.parse(storedUser).upiId || t.to === JSON.parse(storedUser).upiId
        );
        setTransactions(userTransactions);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would verify the password here
      
      setUser(foundUser);
      localStorage.setItem('upi_user', JSON.stringify(foundUser));
      
      // Load transactions
      const userTransactions = mockTransactions.filter(
        t => t.from === foundUser.upiId || t.to === foundUser.upiId
      );
      setTransactions(userTransactions);
      
      toast.success('Login successful');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('upi_user');
    toast.success('Logged out successfully');
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        email,
        phone,
        upiId: `${name.toLowerCase().replace(/\s/g, '')}@upibank`,
        balance: 1000, // Give new users some starting balance
        linkedBanks: []
      };
      
      // In a real app, we would store the user in a database here
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('upi_user', JSON.stringify(newUser));
      
      toast.success('Registration successful');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to register';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const linkBank = async (bankData: Omit<Bank, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to link a bank');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBank: Bank = {
        ...bankData,
        id: String(user.linkedBanks.length + 1),
      };
      
      // If this is the first bank, set it as default
      if (user.linkedBanks.length === 0) {
        newBank.isDefault = true;
      }
      
      const updatedBanks = [...user.linkedBanks, newBank];
      const updatedUser = { ...user, linkedBanks: updatedBanks };
      
      setUser(updatedUser);
      localStorage.setItem('upi_user', JSON.stringify(updatedUser));
      
      toast.success('Bank account linked successfully');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to link bank';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMoney = async (to: string, amount: number, description: string) => {
    if (!user) {
      toast.error('You must be logged in to send money');
      return;
    }

    if (user.balance < amount) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create transaction
      const newTransaction: Transaction = {
        id: String(transactions.length + 1),
        amount,
        type: 'debit',
        from: user.upiId,
        to,
        timestamp: new Date(),
        status: 'completed',
        description
      };
      
      // Update user balance
      const updatedUser = { ...user, balance: user.balance - amount };
      
      setUser(updatedUser);
      setTransactions([newTransaction, ...transactions]);
      
      localStorage.setItem('upi_user', JSON.stringify(updatedUser));
      
      toast.success(`₹${amount} sent successfully`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to send money';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const requestMoney = async (from: string, amount: number, description: string) => {
    if (!user) {
      toast.error('You must be logged in to request money');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a pending request
      // For our demo, we'll simulate an instant payment
      
      const newTransaction: Transaction = {
        id: String(transactions.length + 1),
        amount,
        type: 'credit',
        from,
        to: user.upiId,
        timestamp: new Date(),
        status: 'completed',
        description: `Request: ${description}`
      };
      
      // Update user balance
      const updatedUser = { ...user, balance: user.balance + amount };
      
      setUser(updatedUser);
      setTransactions([newTransaction, ...transactions]);
      
      localStorage.setItem('upi_user', JSON.stringify(updatedUser));
      
      toast.success(`₹${amount} requested successfully`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to request money';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    transactions,
    login,
    logout,
    register,
    linkBank,
    sendMoney,
    requestMoney
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
