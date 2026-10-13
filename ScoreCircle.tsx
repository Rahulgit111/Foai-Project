interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  level?: string;
}

export function ScoreCircle({ score, maxScore = 100, size = 180, strokeWidth = 14, level }: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / maxScore;
  const offset = circumference - percentage * circumference;

  const color = score <= 33 ? '#4d8c6b' : score <= 66 ? '#e0a536' : '#d96565';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#dcebe0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-sage-800">{score}</span>
        <span className="text-sm text-sage-500">/ {maxScore}</span>
        {level && (
          <span className="text-xs font-semibold mt-1" style={{ color }}>{level}</span>
        )}
      </div>
    </div>
  );
}
