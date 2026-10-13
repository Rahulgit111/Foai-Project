import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Brain, GraduationCap } from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { LoadingOverlay } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { runInference } from '@/ai/inferenceEngine';
import {
  QUESTIONS, SCALE_OPTIONS,
  SLEEP_OPTIONS, STUDY_OPTIONS, SCREEN_OPTIONS, EXERCISE_OPTIONS, PRESSURE_OPTIONS,
} from '@/lib/questionnaireData';
import type { LifestyleData, QuestionnaireResponse } from '@/lib/types';

const steps = ['Student Details', '10 Questions', 'Lifestyle', 'AI Reasoning', 'Result'];

export function StressDetection() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  const [personal, setPersonal] = useState({
    age: profile?.age?.toString() || '',
    college: profile?.college || '',
    course: profile?.course || '',
    year: profile?.year || '',
  });

  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [lifestyle, setLifestyle] = useState({
    sleepHours: '',
    studyHours: '',
    screenTime: '',
    exerciseFrequency: '',
    academicPressure: '',
  });

  const canProceed = () => {
    if (step === 0) return personal.age && personal.college && personal.course && personal.year;
    if (step === 1) return Object.keys(responses).length === QUESTIONS.length;
    if (step === 2) return lifestyle.sleepHours && lifestyle.studyHours && lifestyle.screenTime &&
      lifestyle.exerciseFrequency && lifestyle.academicPressure;
    return true;
  };

  const handleNext = () => {
    if (step < 4 && canProceed()) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = async () => {
    setAnalyzing(true);

    const lifestyleData: LifestyleData = {
      ...personal,
      ...lifestyle,
    };

    const questionnaireResponses: QuestionnaireResponse[] = QUESTIONS.map((q) => ({
      questionId: q.id,
      response: responses[q.id],
      score: responses[q.id],
    }));

    const result = runInference(lifestyleData, questionnaireResponses);

    try {
      const { data: assessment, error } = await supabase.from('assessments').insert({
        user_id: undefined,
        stress_score: result.stressScore,
        stress_level: result.stressLevel,
        questionnaire_score: result.questionnaireScore,
        contributing_factors: result.contributingFactors,
        recommendations: result.recommendations,
        activated_rules: result.activatedRules,
        reasoning_summary: result.reasoningSummary,
        lifestyle_data: lifestyleData,
      }).select().single();

      if (error) throw error;

      if (assessment) {
        const responseInserts = questionnaireResponses.map((r) => ({
          assessment_id: assessment.id,
          question_id: r.questionId,
          response: r.response,
          score: r.score,
        }));
        await supabase.from('questionnaire_responses').insert(responseInserts);
      }

      setAnalyzing(false);
      showToast('Assessment completed successfully.', 'success');
      navigate(`/results/${assessment.id}`);
    } catch {
      setAnalyzing(false);
      showToast('Could not save assessment. Please try again.', 'error');
    }
  };

  if (analyzing) {
    return <LoadingOverlay message="Inference Engine is evaluating rules..." />;
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800 mb-2">Stress Detection</h1>
        <p className="text-sage-500">Complete each step. The AI will use IF-THEN rules to estimate your stress level.</p>
      </div>

      <div className="mb-8">
        <StepIndicator steps={steps} currentStep={step} />
      </div>

      {/* Step 0: Student Details */}
      {step === 0 && (
        <div className="card animate-fade-in space-y-5">
          <h2 className="text-lg font-semibold text-sage-800">Student Details</h2>
          <p className="text-sm text-sage-500 -mt-3">Basic non-sensitive information. These fields are not used as medical indicators.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Age</label>
              <input type="number" value={personal.age}
                onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                className="input-field" placeholder="20" min="10" max="120" />
            </div>
            <div>
              <label className="label-text">Year / Semester</label>
              <select value={personal.year}
                onChange={(e) => setPersonal({ ...personal, year: e.target.value })}
                className="input-field">
                <option value="">Select year</option>
                {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">College / Institution</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input type="text" value={personal.college}
                onChange={(e) => setPersonal({ ...personal, college: e.target.value })}
                className="input-field pl-11" placeholder="Your university" />
            </div>
          </div>

          <div>
            <label className="label-text">Course</label>
            <input type="text" value={personal.course}
              onChange={(e) => setPersonal({ ...personal, course: e.target.value })}
              className="input-field" placeholder="e.g. Computer Science" />
          </div>
        </div>
      )}

      {/* Step 1: 10 Questions */}
      {step === 1 && (
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-sage-800">Stress Questionnaire</h2>
            <span className="text-sm font-semibold text-sage-600">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
          </div>

          <div className="w-full h-2 bg-sage-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }} />
          </div>

          <div key={currentQuestion} className="animate-fade-in">
            <p className="text-lg text-sage-800 font-medium mb-6 leading-relaxed">
              {QUESTIONS[currentQuestion].text}
            </p>
            <div className="space-y-2">
              {SCALE_OPTIONS.map((opt) => (
                <button key={opt.value}
                  onClick={() => setResponses({ ...responses, [QUESTIONS[currentQuestion].id]: opt.value })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                    responses[QUESTIONS[currentQuestion].id] === opt.value
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-sage-100 hover:border-sage-200 hover:bg-sage-50/50'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center text-sm font-bold text-sage-600">
                      {opt.value}
                    </span>
                    <span className="font-medium text-sage-700">{opt.label}</span>
                  </div>
                  {responses[QUESTIONS[currentQuestion].id] === opt.value && (
                    <Check className="w-5 h-5 text-sage-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn-secondary !py-2.5 text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            {currentQuestion < QUESTIONS.length - 1 ? (
              <button onClick={() => responses[QUESTIONS[currentQuestion].id] && setCurrentQuestion(currentQuestion + 1)}
                disabled={!responses[QUESTIONS[currentQuestion].id]}
                className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <p className="text-sm text-sage-500">
                {Object.keys(responses).length === QUESTIONS.length ? 'All answered!' : `${QUESTIONS.length - Object.keys(responses).length} remaining`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Lifestyle Information */}
      {step === 2 && (
        <div className="card animate-fade-in space-y-6">
          <h2 className="text-lg font-semibold text-sage-800">Lifestyle Information</h2>
          <p className="text-sm text-sage-500 -mt-3">These are not stress questions — they help the AI rules reason about your daily habits.</p>

          <div>
            <label className="label-text">Average sleep per day</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SLEEP_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLifestyle({ ...lifestyle, sleepHours: opt })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    lifestyle.sleepHours === opt ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                  }`}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Average study time per day</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STUDY_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLifestyle({ ...lifestyle, studyHours: opt })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    lifestyle.studyHours === opt ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                  }`}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Daily recreational screen time</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCREEN_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLifestyle({ ...lifestyle, screenTime: opt })}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    lifestyle.screenTime === opt ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                  }`}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Exercise frequency</label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {EXERCISE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLifestyle({ ...lifestyle, exerciseFrequency: opt })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    lifestyle.exerciseFrequency === opt ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                  }`}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Current academic pressure</label>
            <div className="flex gap-3">
              {PRESSURE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLifestyle({ ...lifestyle, academicPressure: opt })}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    lifestyle.academicPressure === opt ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                  }`}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: AI Reasoning Preview */}
      {step === 3 && (
        <div className="card animate-fade-in text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-sage-600" />
          </div>
          <h2 className="text-lg font-semibold text-sage-800 mb-2">Ready for AI Reasoning</h2>
          <p className="text-sage-500 text-sm mb-6 max-w-md mx-auto">
            The Inference Engine will evaluate IF-THEN rules using forward chaining
            to determine your estimated stress level.
          </p>
          <div className="flex flex-col gap-2 max-w-xs mx-auto text-left mb-8">
            <div className="flex items-center gap-2 text-sm text-sage-600"><Check className="w-4 h-4 text-sage-500" /> Student details completed</div>
            <div className="flex items-center gap-2 text-sm text-sage-600"><Check className="w-4 h-4 text-sage-500" /> {QUESTIONS.length} questions answered</div>
            <div className="flex items-center gap-2 text-sm text-sage-600"><Check className="w-4 h-4 text-sage-500" /> Lifestyle information recorded</div>
          </div>
          <button onClick={handleFinish} className="btn-primary inline-flex items-center gap-2">
            Run Inference Engine
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex items-center justify-between mt-6">
          <button onClick={handlePrev} disabled={step === 0}
            className="btn-secondary !py-2.5 text-sm flex items-center gap-2 disabled:opacity-0">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step !== 1 && (
            <button onClick={handleNext} disabled={!canProceed()}
              className="btn-primary !py-2.5 text-sm flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 1 && currentQuestion === QUESTIONS.length - 1 && Object.keys(responses).length === QUESTIONS.length && (
            <button onClick={handleNext} className="btn-primary !py-2.5 text-sm flex items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
