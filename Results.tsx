import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Moon, BookOpen, Activity, Monitor, Users, Heart, ClipboardList,
  AlertCircle, History, RotateCw, ArrowLeft, Check, Brain,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Assessment } from '@/lib/types';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { LoadingSpinner } from '@/components/ui/Loading';

const iconMap: Record<string, typeof Moon> = {
  moon: Moon, 'book-open': BookOpen, activity: Activity, monitor: Monitor,
  users: Users, heart: Heart, 'clipboard-list': ClipboardList, 'check-circle': Check,
};

const levelLabels: Record<string, string> = { low: 'Low', moderate: 'Moderate', high: 'High' };
const levelColors: Record<string, string> = { low: '#4d8c6b', moderate: '#e0a536', high: '#d96565' };
const statusColors: Record<string, string> = {
  good: 'text-sage-600 bg-sage-50',
  moderate: 'text-amber-600 bg-amber-50',
  'needs-attention': 'text-red-600 bg-red-50',
};
const statusLabels: Record<string, string> = { good: 'Good', moderate: 'Moderate', 'needs-attention': 'Needs Attention' };

export function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('assessments').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) setAssessment(data as Assessment);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <p className="text-sage-500">Assessment not found.</p>
        <Link to="/dashboard" className="btn-secondary mt-4 inline-flex">Back to Dashboard</Link>
      </div>
    );
  }

  const date = new Date(assessment.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const reasoningSummary = assessment.reasoning_summary || '';
  const mainFactors = assessment.contributing_factors
    .filter((f) => f.status !== 'good')
    .map((f) => f.label)
    .slice(0, 3);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800 mb-2">Your Estimated Stress Level</h1>
        <p className="text-sage-500 text-sm">{date}</p>
      </div>

      {/* Score */}
      <div className="card text-center mb-8 animate-scale-in">
        <p className="text-sm font-medium text-sage-500 mb-4">Estimated Stress Level</p>
        <ScoreCircle score={assessment.stress_score} level={levelLabels[assessment.stress_level]} />
        <div className="mt-4">
          <span
            className="inline-flex px-5 py-2 rounded-full text-lg font-bold"
            style={{ color: levelColors[assessment.stress_level], background: `${levelColors[assessment.stress_level]}15` }}
          >
            {levelLabels[assessment.stress_level].toUpperCase()} STRESS
          </span>
        </div>
        <p className="text-sm text-sage-500 mt-4 max-w-lg mx-auto leading-relaxed">
          {assessment.stress_level === 'low' && 'Your responses indicate a low level of perceived stress. Continue maintaining your healthy habits and check in regularly.'}
          {assessment.stress_level === 'moderate' && 'Your responses indicate a moderate level of perceived stress. Consider reviewing your sleep, workload, study schedule, and daily recovery habits.'}
          {assessment.stress_level === 'high' && 'Your responses indicate a high level of perceived stress. Consider speaking with a campus counselor or a trusted person, and review the recommendations below.'}
        </p>
      </div>

      {/* AI Reasoning Summary */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-sage-500" />
          <h2 className="font-semibold text-sage-800">AI Reasoning Summary</h2>
        </div>
        <p className="text-sm text-sage-600 leading-relaxed mb-4">
          {mainFactors.length > 0
            ? `Your result was influenced mainly by ${mainFactors.join(', ').toLowerCase()}, and questionnaire responses.`
            : 'Your responses indicate balanced lifestyle patterns across all measured factors.'}
        </p>
        <Link to={`/reasoning/${assessment.id}`} className="btn-secondary text-sm inline-flex items-center gap-2">
          <Brain className="w-4 h-4" /> View Full AI Reasoning
        </Link>
      </div>

      {/* Contributing Factors */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-sage-800 mb-4">Contributing Factors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessment.contributing_factors.map((factor, i) => (
            <div key={i} className="card p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-sage-700">{factor.label}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[factor.status]}`}>
                  {statusLabels[factor.status]}
                </span>
              </div>
              <p className="text-xs text-sage-400">{factor.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-sage-800 mb-4">Personalized Recommendations</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {assessment.recommendations.map((rec, i) => {
            const Icon = iconMap[rec.icon] || Heart;
            return (
              <div key={i} className="card p-4 flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sage-800 text-sm mb-1">{rec.title}</h3>
                  <p className="text-xs text-sage-500 leading-relaxed">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 mb-8">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sage-600 leading-relaxed">
          Stress Detection AI provides an estimated stress level based on rule-based reasoning and user responses.
          It is not a medical diagnosis and should not replace professional healthcare advice.
          If you are experiencing severe or persistent distress, consider seeking appropriate professional support.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/records" className="btn-secondary flex items-center justify-center gap-2 flex-1">
          <History className="w-4 h-4" /> View History
        </Link>
        <Link to={`/reasoning/${assessment.id}`} className="btn-secondary flex items-center justify-center gap-2 flex-1">
          <Brain className="w-4 h-4" /> AI Reasoning
        </Link>
        <Link to="/stress-detection" className="btn-primary flex items-center justify-center gap-2 flex-1">
          <RotateCw className="w-4 h-4" /> Take Again
        </Link>
      </div>
    </div>
  );
}
