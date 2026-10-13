import { Link } from 'react-router-dom';
import {
  Heart, Brain, Database, Cpu, ArrowRight, ArrowDown,
  AlertCircle, GitBranch, ClipboardList, Check,
} from 'lucide-react';

const concepts = [
  {
    icon: Database,
    title: 'Knowledge Base',
    desc: 'Contains facts and rules about factors associated with perceived stress — sleep, study time, screen time, exercise, academic pressure, and questionnaire responses.',
  },
  {
    icon: ClipboardList,
    title: 'Rule-Based System',
    desc: 'Uses IF-THEN rules to reason about user responses. Each rule has a condition (IF) and a conclusion (THEN) that contributes stress points.',
  },
  {
    icon: Cpu,
    title: 'Inference Engine',
    desc: 'Evaluates the rules against user-provided facts and derives conclusions. Collects activated rules and aggregates stress points into a final score.',
  },
  {
    icon: GitBranch,
    title: 'Forward Chaining',
    desc: 'Starts with user-provided facts and applies rules to reach a conclusion. This is data-driven reasoning — from facts to conclusions.',
  },
  {
    icon: Brain,
    title: 'Decision Making',
    desc: 'Uses the inferred factors and total stress points to determine the estimated stress category: LOW (0-33), MODERATE (34-66), or HIGH (67-100).',
  },
];

const exampleLines = [
  { text: 'FACT:', type: 'label' },
  { text: 'Student sleeps 4 hours.', type: 'fact' },
  { text: '', type: 'spacer' },
  { text: 'RULE:', type: 'label' },
  { text: 'IF sleep < 5 hours', type: 'rule' },
  { text: 'THEN sleep-related stress = HIGH.', type: 'rule' },
  { text: '', type: 'spacer' },
  { text: 'INFERENCE:', type: 'label' },
  { text: 'Student has a high sleep-related stress factor.', type: 'inference' },
];

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sage-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sage-800">Stress Detection AI</span>
          </Link>
          <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
        </div>
      </nav>

      {/* What is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-sage-800 mb-6">About the AI System</h1>
          <p className="text-lg text-sage-500 leading-relaxed">
            Stress Detection AI is a rule-based expert system that uses classical Artificial Intelligence —
            specifically a Knowledge Base, IF-THEN rules, and an Inference Engine — to estimate
            perceived stress levels in college students. It does not use machine learning.
          </p>
        </div>
      </section>

      {/* AI Concepts */}
      <section className="py-16 px-6 bg-sage-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-sage-800 text-center mb-12">Artificial Intelligence Used</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {concepts.map((concept, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <concept.icon className="w-5 h-5 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-sage-800 pt-1.5">{concept.title}</h3>
                </div>
                <p className="text-sm text-sage-500 leading-relaxed">{concept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-sage-800 text-center mb-8">Example of Rule-Based Reasoning</h2>
          <div className="card">
            <div className="space-y-1">
              {exampleLines.map((line, i) => {
                if (line.type === 'spacer') return <div key={i} className="h-3" />;
                if (line.type === 'label')
                  return <p key={i} className="text-xs font-bold text-sage-400 tracking-wide">{line.text}</p>;
                if (line.type === 'fact')
                  return <p key={i} className="text-sm text-sage-700 pl-4">{line.text}</p>;
                if (line.type === 'rule')
                  return <p key={i} className="text-sm text-sage-600 pl-4 font-mono">{line.text}</p>;
                if (line.type === 'inference')
                  return (
                    <p key={i} className="text-sm text-sage-800 pl-4 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-sage-500" /> {line.text}
                    </p>
                  );
                return null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-16 px-6 bg-sage-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-sage-800 text-center mb-12">AI Process Pipeline</h2>
          <div className="flex flex-col items-center gap-2">
            {[
              { label: 'Student Answers', desc: '10 questions + lifestyle information' },
              { label: 'Knowledge Base', desc: 'Facts and rules about stress factors' },
              { label: 'Inference Engine', desc: 'Evaluates IF-THEN rules' },
              { label: 'Forward Chaining', desc: 'Applies rules to facts' },
              { label: 'Reasoning', desc: 'Collects activated rules and stress points' },
              { label: 'Estimated Stress Level', desc: 'Low, Moderate, or High' },
              { label: 'Recommendations', desc: 'Rule-based wellness suggestions' },
            ].map((step, i, arr) => (
              <div key={i} className="w-full max-w-md">
                <div className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-sage-600">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sage-800 text-sm">{step.label}</h3>
                    <p className="text-xs text-sage-500">{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-sage-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6 bg-sage-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-amber-100">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sage-800 mb-1">Important Note</h3>
              <p className="text-sm text-sage-600 leading-relaxed">
                This system uses classical AI (rule-based reasoning), not machine learning.
                The thresholds and rules are for educational purposes and are not medically validated.
                This tool does not diagnose mental illnesses or replace professional healthcare advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
          Start Your Assessment <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
