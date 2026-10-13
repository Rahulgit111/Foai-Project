import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, ArrowDown, Cpu, Database, GitBranch, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Assessment, ActivatedRule } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/Loading';

const categoryColors: Record<string, string> = {
  sleep: 'bg-blue-50 text-blue-600',
  study: 'bg-purple-50 text-purple-600',
  screen: 'bg-orange-50 text-orange-600',
  exercise: 'bg-green-50 text-green-600',
  academic: 'bg-red-50 text-red-600',
  questionnaire: 'bg-sage-100 text-sage-700',
};

export function AIReasoning() {
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

  const rules = (assessment.activated_rules || []) as ActivatedRule[];
  const reasoningLines = (assessment.reasoning_summary || '').split('\n');

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sage-600 hover:text-sage-700 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-sage-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-800">How the AI Reached Your Result</h1>
        </div>
        <p className="text-sage-500 text-sm ml-13">
          This page demonstrates the rule-based reasoning process used by the Inference Engine.
        </p>
      </div>

      {/* Pipeline Visualization */}
      <div className="card mb-8">
        <h2 className="font-semibold text-sage-800 mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-sage-500" /> Forward Chaining Process
        </h2>

        <div className="flex flex-col gap-2">
          {/* Step 1: Facts */}
          <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sage-700">Step 1: Facts from User</p>
              <p className="text-xs text-sage-500 mt-0.5">
                Questionnaire Score: {assessment.questionnaire_score}/50
                {' • '}Sleep: {assessment.lifestyle_data?.sleepHours}
                {' • '}Study: {assessment.lifestyle_data?.studyHours}
                {' • '}Screen: {assessment.lifestyle_data?.screenTime}
                {' • '}Exercise: {assessment.lifestyle_data?.exerciseFrequency}
                {' • '}Pressure: {assessment.lifestyle_data?.academicPressure}
              </p>
            </div>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-sage-300" /></div>

          {/* Step 2: Knowledge Base */}
          <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sage-700">Step 2: Knowledge Base</p>
              <p className="text-xs text-sage-500 mt-0.5">19 IF-THEN rules covering sleep, study, screen time, exercise, academic pressure, and questionnaire score.</p>
            </div>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-sage-300" /></div>

          {/* Step 3: Inference Engine */}
          <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sage-700">Step 3: Inference Engine (Forward Chaining)</p>
              <p className="text-xs text-sage-500 mt-0.5">Evaluates each rule against the facts. {rules.length} rules activated.</p>
            </div>
          </div>

          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-sage-300" /></div>

          {/* Step 4: Conclusion */}
          <div className="flex items-center gap-4 p-4 bg-sage-100 rounded-xl border border-sage-200">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sage-700">Step 4: Conclusion</p>
              <p className="text-xs text-sage-500 mt-0.5">
                Estimated Stress Level: <span className="font-bold uppercase">{assessment.stress_level}</span>
                {' • '}Score: {assessment.stress_score}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activated Rules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-sage-800 mb-4">Activated Rules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {rules.map((rule, i) => (
            <div key={i} className="card p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-sage-700">{rule.id}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[rule.category] || 'bg-sage-50 text-sage-600'}`}>
                  {rule.category}
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-sage-50/50 rounded-lg">
                  <p className="text-xs font-semibold text-sage-400 mb-0.5">CONDITION</p>
                  <p className="text-sm text-sage-700">{rule.condition}</p>
                </div>
                <div className="p-2 bg-sage-50/50 rounded-lg">
                  <p className="text-xs font-semibold text-sage-400 mb-0.5">CONCLUSION</p>
                  <p className="text-sm text-sage-700">{rule.conclusion}</p>
                </div>
                <p className="text-xs text-sage-400">Stress points: +{rule.stressPoints}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning Trace */}
      <div className="card mb-8">
        <h2 className="font-semibold text-sage-800 mb-4">Reasoning Trace</h2>
        <pre className="text-xs text-sage-600 bg-sage-50/50 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
          {reasoningLines.map((line, i) => {
            if (line.includes('Activated')) {
              return <span key={i} className="text-sage-700 font-semibold">{line}{'\n'}</span>;
            }
            if (line.includes('Estimated Stress Level')) {
              return <span key={i} className="text-sage-800 font-bold">{line}{'\n'}</span>;
            }
            if (line.includes('↓')) {
              return <span key={i} className="text-sage-300">{line}{'\n'}</span>;
            }
            return <span key={i}>{line}{'\n'}</span>;
          })}
        </pre>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sage-600 leading-relaxed">
          This reasoning is based on rule-based logic (IF-THEN rules), not machine learning.
          The thresholds are for educational purposes and are not medically validated.
        </p>
      </div>
    </div>
  );
}
