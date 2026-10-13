import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isComplete
                      ? 'bg-sage-600 text-white'
                      : isCurrent
                        ? 'bg-sage-100 text-sage-700 ring-2 ring-sage-400 ring-offset-2'
                        : 'bg-sage-50 text-sage-400 border border-sage-100'
                  }`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-sage-700' : 'text-sage-400'}`}>
                  {step}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-3 -mt-6 rounded-full">
                  <div className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-sage-500' : 'bg-sage-100'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-sage-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-sage-500">{steps[currentStep]}</span>
        </div>
        <div className="w-full h-2 bg-sage-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
