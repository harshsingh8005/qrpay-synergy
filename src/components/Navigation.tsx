
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, QrCode, CreditCard, History, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 p-2 z-10">
      <div className="flex justify-around items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-upi-blue font-medium' : 'text-gray-500'}`}
          end
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        
        <NavLink 
          to="/payment" 
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-upi-blue font-medium' : 'text-gray-500'}`}
        >
          <CreditCard size={24} />
          <span className="text-xs mt-1">Pay</span>
        </NavLink>
        
        <NavLink 
          to="/qr-code" 
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-upi-blue font-medium' : 'text-gray-500'}`}
        >
          <QrCode size={24} />
          <span className="text-xs mt-1">QR Code</span>
        </NavLink>
        
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-upi-blue font-medium' : 'text-gray-500'}`}
        >
          <History size={24} />
          <span className="text-xs mt-1">History</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-upi-blue font-medium' : 'text-gray-500'}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;
