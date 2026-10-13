import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Assessment } from '@/lib/types';
import { LoadingSpinner, SkeletonCard } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

type Filter = '7' | '30' | '90' | 'all';

const filters: { label: string; value: Filter }[] = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 3 months', value: '90' },
  { label: 'All records', value: 'all' },
];

const levelLabels: Record<string, string> = { low: 'Low', moderate: 'Moderate', high: 'High' };
const levelColors: Record<string, string> = {
  low: 'text-sage-600 bg-sage-50',
  moderate: 'text-amber-600 bg-amber-50',
  high: 'text-red-600 bg-red-50',
};

export function Records() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    supabase.from('assessments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setAssessments((data as Assessment[]) || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return assessments;
    const days = parseInt(filter);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return assessments.filter((a) => new Date(a.created_at) >= cutoff);
  }, [assessments, filter]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Chart data
  const chartData = useMemo(() => {
    return [...filtered].reverse().map((a) => ({
      date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: a.stress_score,
      level: a.stress_level,
    }));
  }, [filtered]);

  const chartWidth = Math.max(chartData.length * 60, 300);
  const chartHeight = 200;
  const padding = 30;
  const maxScore = 100;

  const getX = (i: number) => {
    if (chartData.length <= 1) return padding + 20;
    return padding + (i / (chartData.length - 1)) * (chartWidth - padding * 2);
  };
  const getY = (score: number) => chartHeight - padding - (score / maxScore) * (chartHeight - padding * 2);

  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.score)}`).join(' ');

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800 mb-1">My Records</h1>
        <p className="text-sage-500 text-sm">Track your stress levels over time</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.value ? 'bg-sage-600 text-white' : 'bg-white text-sage-600 hover:bg-sage-50 border border-sage-100'
            }`}>{f.label}</button>
        ))}
      </div>

      {/* Chart */}
      {!loading && filtered.length > 0 && (
        <div className="card mb-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-sage-500" />
            <h2 className="font-semibold text-sage-800">Stress Trend</h2>
          </div>
          <svg width={chartWidth} height={chartHeight} className="w-full" style={{ minWidth: chartWidth }}>
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={padding} y1={getY(v)} x2={chartWidth - padding} y2={getY(v)} stroke="#dcebe0" strokeWidth="1" strokeDasharray="3,3" />
                <text x={padding - 5} y={getY(v) + 4} textAnchor="end" className="text-xs fill-sage-400">{v}</text>
              </g>
            ))}
            {/* Line */}
            {chartData.length > 1 && <path d={linePath} fill="none" stroke="#4d8c6b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
            {/* Points */}
            {chartData.map((d, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getY(d.score)} r="5" fill={d.level === 'low' ? '#4d8c6b' : d.level === 'moderate' ? '#e0a536' : '#d96565'} />
                {chartData.length <= 10 && (
                  <text x={getX(i)} y={chartHeight - 8} textAnchor="middle" className="text-[10px] fill-sage-400">{d.date}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assessments found"
          message="Complete a stress assessment to start building your history."
          action={<button onClick={() => navigate('/stress-detection')} className="btn-primary text-sm">Start Assessment</button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id}
              onClick={() => navigate(`/records/${a.id}`)}
              className="card p-4 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-sage-200 transition-all animate-fade-in">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-sage-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-sage-800">{formatDate(a.created_at)}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${levelColors[a.stress_level]}`}>
                      {levelLabels[a.stress_level]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-sage-400">
                    <span>Score: {a.stress_score}/100</span>
                    <span>Questionnaire: {Math.round(a.questionnaire_score)}/50</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="w-20 h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${a.stress_score}%`,
                      background: a.stress_level === 'low' ? '#4d8c6b' : a.stress_level === 'moderate' ? '#e0a536' : '#d96565',
                    }} />
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-sage-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
