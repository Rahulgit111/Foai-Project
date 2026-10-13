import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Trash2, Moon, BookOpen, Monitor, Users,
  AlertCircle, Check, Heart, ClipboardList, Brain,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Assessment, QuestionnaireResponse } from '@/lib/types';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { QUESTIONS, SCALE_OPTIONS } from '@/lib/questionnaireData';

const levelLabels: Record<string, string> = { low: 'Low', moderate: 'Moderate', high: 'High' };
const levelColors: Record<string, string> = { low: '#4d8c6b', moderate: '#e0a536', high: '#d96565' };
const statusColors: Record<string, string> = {
  good: 'text-sage-600 bg-sage-50', moderate: 'text-amber-600 bg-amber-50', 'needs-attention': 'text-red-600 bg-red-50',
};
const statusLabels: Record<string, string> = { good: 'Good', moderate: 'Moderate', 'needs-attention': 'Needs Attention' };
const iconMap: Record<string, typeof Moon> = {
  moon: Moon, 'book-open': BookOpen, activity: Monitor, monitor: Monitor,
  users: Users, heart: Heart, 'clipboard-list': ClipboardList, 'check-circle': Check,
};

export function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('assessments').select('*').eq('id', id).maybeSingle(),
      supabase.from('questionnaire_responses').select('*').eq('assessment_id', id).order('question_id', { ascending: true }),
    ]).then(([assessRes, respRes]) => {
      if (assessRes.data) setAssessment(assessRes.data as Assessment);
      if (respRes.data) setResponses((respRes.data as QuestionnaireResponse[]) || []);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const { error } = await supabase.from('assessments').delete().eq('id', id);
    if (error) {
      showToast('Could not delete record. Please try again.', 'error');
      return;
    }
    showToast('Record deleted successfully.', 'success');
    navigate('/records');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={32} /></div>;
  }

  if (!assessment) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <p className="text-sage-500">Record not found.</p>
        <button onClick={() => navigate('/records')} className="btn-secondary mt-4">Back to Records</button>
      </div>
    );
  }

  const date = new Date(assessment.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = new Date(assessment.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const lifestyle = assessment.lifestyle_data;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/records')} className="flex items-center gap-2 text-sage-600 hover:text-sage-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
        <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-sage-800 mb-1">Assessment Details</h1>
        <p className="text-sage-500 text-sm flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" /> {date} at {time}
        </p>
      </div>

      {/* Score */}
      <div className="card text-center mb-6 animate-scale-in">
        <ScoreCircle score={assessment.stress_score} level={levelLabels[assessment.stress_level]} />
        <div className="mt-4">
          <span className="inline-flex px-5 py-2 rounded-full text-lg font-bold"
            style={{ color: levelColors[assessment.stress_level], background: `${levelColors[assessment.stress_level]}15` }}>
            {levelLabels[assessment.stress_level].toUpperCase()}
          </span>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div><span className="text-sage-400">Questionnaire: </span><span className="font-semibold text-sage-700">{assessment.questionnaire_score}/50</span></div>
          <div><span className="text-sage-400">Stress Score: </span><span className="font-semibold text-sage-700">{assessment.stress_score}/100</span></div>
        </div>
        <Link to={`/reasoning/${assessment.id}`} className="btn-secondary text-sm inline-flex items-center gap-2 mt-4">
          <Brain className="w-4 h-4" /> View AI Reasoning
        </Link>
      </div>

      {/* Lifestyle Data */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4">Lifestyle Information</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ['Age', lifestyle?.age], ['Sleep Hours', lifestyle?.sleepHours],
            ['Study Hours', lifestyle?.studyHours], ['Screen Time', lifestyle?.screenTime],
            ['Exercise', lifestyle?.exerciseFrequency], ['Academic Pressure', lifestyle?.academicPressure],
          ].map(([label, val], i) => (
            <div key={i} className="flex justify-between p-2.5 bg-sage-50/50 rounded-lg">
              <span className="text-sage-500">{label}</span>
              <span className="font-medium text-sage-700">{val || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contributing Factors */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4">Contributing Factors</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {assessment.contributing_factors.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-sage-50/50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-sage-700">{f.label}</span>
                <p className="text-xs text-sage-400">{f.detail}</p>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[f.status]}`}>
                {statusLabels[f.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Questionnaire Responses */}
      {responses.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-sage-800 mb-4">Questionnaire Responses</h2>
          <div className="space-y-2">
            {responses.map((r, idx) => {
              const qid = r.question_id ?? r.questionId;
              const q = QUESTIONS.find((q) => q.id === qid);
              const label = SCALE_OPTIONS.find((o) => o.value === r.response)?.label || String(r.response);
              return (
                <div key={r.id || idx} className="flex items-start justify-between p-3 bg-sage-50/50 rounded-lg text-sm">
                  <div className="flex-1 pr-3">
                    <span className="text-sage-400 text-xs">Q{qid}:</span>{' '}
                    <span className="text-sage-700">{q?.text || 'Unknown'}</span>
                  </div>
                  <span className="font-medium text-sage-600 whitespace-nowrap">{label} ({r.response})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4">Recommendations</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {assessment.recommendations.map((rec, i) => {
            const Icon = iconMap[rec.icon] || Heart;
            return (
              <div key={i} className="flex items-start gap-3 p-3 bg-sage-50/50 rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sage-800 text-sm">{rec.title}</h3>
                  <p className="text-xs text-sage-500 mt-0.5">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sage-600">This result is an estimate based on rule-based reasoning, not a medical diagnosis.</p>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Record"
        actions={<>
          <button onClick={() => setShowDelete(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDelete} className="btn-primary text-sm !bg-red-500 hover:!bg-red-600">Delete</button>
        </>}>
        Are you sure you want to permanently delete this assessment record? This action cannot be undone.
      </Modal>
    </div>
  );
}
