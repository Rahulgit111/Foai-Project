interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-sage-700">{label}</span>
          <span className="text-sm font-semibold text-sage-600">{percentage}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-sage-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
