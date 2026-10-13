import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <Loader2 className={`animate-spin text-sage-500 ${className}`} style={{ width: size, height: size }} />;
}

export function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sage-50/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-sage-200" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-sage-500 animate-spin" />
        </div>
        <p className="text-sage-700 font-medium animate-pulse-soft">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 w-24 bg-sage-100 rounded mb-3" />
      <div className="h-8 w-16 bg-sage-100 rounded mb-4" />
      <div className="h-3 w-full bg-sage-50 rounded" />
    </div>
  );
}
