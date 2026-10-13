import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-sage-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sage-800">{title}</h3>
          <button onClick={onClose} className="text-sage-400 hover:text-sage-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sage-700 text-sm leading-relaxed">{children}</div>
        {actions && (
          <div className="flex gap-3 mt-6 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
