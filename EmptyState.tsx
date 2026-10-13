import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-sage-400" />}
      </div>
      <h3 className="text-lg font-semibold text-sage-800 mb-1">{title}</h3>
      <p className="text-sm text-sage-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
}
