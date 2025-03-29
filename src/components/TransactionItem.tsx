
import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  userUpiId: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, userUpiId }) => {
  const isIncoming = transaction.to === userUpiId;
  const formattedAmount = `$${transaction.amount.toFixed(2)}`;
  const formattedTime = formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true });
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isIncoming ? 'bg-green-100' : 'bg-red-100'}`}>
          {isIncoming ? (
            <ArrowDownLeft className="text-green-600" size={20} />
          ) : (
            <ArrowUpRight className="text-red-600" size={20} />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {isIncoming ? `From: ${transaction.from}` : `To: ${transaction.to}`}
          </p>
          <p className="text-xs text-gray-400">{formattedTime}</p>
        </div>
      </div>
      <div className={`font-semibold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
        {isIncoming ? '+' : '-'}{formattedAmount}
      </div>
    </div>
  );
};

export default TransactionItem;
