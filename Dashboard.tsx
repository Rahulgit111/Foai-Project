import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, Clock, CheckCircle, TrendingUp, ArrowRight, Moon, BookOpen,
  Activity, Monitor, Users, Calendar, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Assessment } from '@/lib/types';
import { LoadingSpinner, SkeletonCard } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

const tips = [
  { icon: Moon, text: 'Maintain a regular sleep schedule of 7-8 hours per night.' },
  { icon: BookOpen, text: 'Take regular short breaks during long study sessions to stay focused.' },
  { icon: Activity, text: 'Stay physically active — even a short daily walk helps reduce stress.' },
  { icon: Monitor, text: 'Limit excessive screen time, especially before bedtime.' },
  { icon: Users, text: 'Stay connected with friends and family for emotional support.' },
];

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setAssessments((data as Assessment[]) || []);
        setLoading(false);
      });
  }, [profile]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const firstName = profile?.name?.split(' ')[0] || 'there';

  const latest = assessments[0];
  const totalAssessments = assessments.length;

  const levelColors: Record<string, string> = {
    low: 'text-sage-600 bg-sage-50',
    moderate: 'text-amber-600 bg-amber-50',
    high: 'text-red-600 bg-red-50',
  };
  const levelLabels: Record<string, string> = {
    low: 'Low', moderate: 'Moderate', high: 'High',
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800">
          Welcome, {firstName}
        </h1>
        <p className="text-sage-500 mt-1">Check your current well-being and understand your stress patterns.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <div className="card animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-500">Current Stress Level</span>
              </div>
              {latest ? (
                <>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${levelColors[latest.stress_level]}`}>
                    {levelLabels[latest.stress_level]}
                  </div>
                  <p className="text-2xl font-bold text-sage-800 mt-2">{latest.stress_score}/100</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-sage-400">No assessment yet</p>
                  <p className="text-xs text-sage-400 mt-2">Take your first assessment</p>
                </>
              )}
            </div>

            <div className="card animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-500">Last Assessment</span>
              </div>
              {latest ? (
                <>
                  <p className="text-sm font-semibold text-sage-800">{formatDate(latest.created_at)}</p>
                  <p className="text-xs text-sage-400 mt-2">
                    {new Date(latest.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-sage-400">No data</p>
                  <p className="text-xs text-sage-400 mt-2">Complete an assessment</p>
                </>
              )}
            </div>

            <div className="card animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-500">Assessments Completed</span>
              </div>
              <p className="text-2xl font-bold text-sage-800">{totalAssessments}</p>
              <p className="text-xs text-sage-400 mt-2">{totalAssessments === 0 ? 'Start today' : 'Keep it up!'}</p>
            </div>

            <div className="card animate-slide-up">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-500">Wellness Progress</span>
              </div>
              {totalAssessments > 0 ? (
                <div className="mt-1">
                  <div className="flex items-end gap-1 h-12">
                    {assessments.slice(0, 5).reverse().map((a, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-sage-400"
                        style={{ height: `${a.stress_score}%`, opacity: 0.4 + (i / 5) * 0.6 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-sage-400 mt-1">Recent trend</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-sage-400">No data</p>
                  <p className="text-xs text-sage-400 mt-2">Track your progress</p>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Take Assessment CTA */}
      <div className="card-green mb-8 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-sage-800 mb-2">Feeling stressed or overwhelmed?</h2>
          <p className="text-sage-600 text-sm">Take a short assessment to understand your stress level and get personalized recommendations.</p>
        </div>
        <button onClick={() => navigate('/stress-detection')} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          Start Stress Detection <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Assessment */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sage-800">Recent Assessment</h3>
            <Link to="/records" className="text-sm text-sage-600 hover:text-sage-700 font-medium">View all</Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : latest ? (
            <div
              className="p-4 bg-sage-50 rounded-xl cursor-pointer hover:bg-sage-100 transition-colors"
              onClick={() => navigate(`/records/${latest.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-sage-700">{formatDate(latest.created_at)}</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelColors[latest.stress_level]}`}>
                  {levelLabels[latest.stress_level]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${latest.stress_score}%`,
                        background: latest.stress_level === 'low' ? '#4d8c6b' : latest.stress_level === 'moderate' ? '#e0a536' : '#d96565',
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-sage-700">{latest.stress_score}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-sage-400">
                <span>Score: {latest.stress_score}/100</span>
                <span>•</span>
                <span>View details</span>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No assessments yet"
              message="Complete your first stress assessment to see results here."
              action={<button onClick={() => navigate('/stress-detection')} className="btn-secondary text-sm">Start Assessment</button>}
            />
          )}
        </div>

        {/* Wellness Tips */}
        <div className="card">
          <h3 className="font-semibold text-sage-800 mb-4">Wellness Tips</h3>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-500 ${
                  i === tipIndex ? 'bg-sage-50 border border-sage-100' : 'opacity-50'
                }`}
              >
                <tip.icon className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sage-700">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sage-600">
          Remember: this tool provides wellness estimates for educational purposes, not medical diagnosis.
          Consider seeking professional support if stress is persistent or significantly affecting your daily life.
        </p>
      </div>
    </div>
  );
}
