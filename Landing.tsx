import { Link } from 'react-router-dom';
import {
  Heart, Brain, ClipboardList, History, ArrowRight, ArrowDown, AlertCircle,
  UserPlus, FileText, BarChart3, Cpu, Database, GitBranch,
} from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Sign up and set up your profile with basic details.' },
  { icon: FileText, title: 'Answer Questions', desc: 'Complete a 10-question assessment and share lifestyle information.' },
  { icon: Brain, title: 'AI Reasoning', desc: 'The Inference Engine evaluates IF-THEN rules using forward chaining.' },
  { icon: BarChart3, title: 'View Your Results', desc: 'Get your estimated stress level and personalized recommendations.' },
];

const features = [
  { icon: Brain, title: 'Rule-Based AI', desc: 'Uses IF-THEN rules and logical reasoning — a classical AI expert system, not machine learning.' },
  { icon: ClipboardList, title: 'Personalized Assessment', desc: 'Analyzes individual lifestyle and academic responses through a knowledge base of stress rules.' },
  { icon: History, title: 'Stress History', desc: 'Allows students to track previous assessments and view stress trends over time.' },
];

const pipeline = [
  { icon: FileText, label: 'Student Answers', desc: '10 questions + lifestyle info' },
  { icon: Database, label: 'Knowledge Base', desc: 'Facts and rules about stress' },
  { icon: Cpu, label: 'Inference Engine', desc: 'Evaluates rules against facts' },
  { icon: GitBranch, label: 'IF-THEN Rules', desc: 'Forward chaining reasoning' },
  { icon: Brain, label: 'Reasoning', desc: 'Activated rules produce stress points' },
  { icon: BarChart3, label: 'Estimated Stress Level', desc: 'Low, Moderate, or High' },
  { icon: Heart, label: 'Recommendations', desc: 'Rule-based wellness suggestions' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-sage-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sage-800">Stress Detection AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/about" className="hidden sm:block btn-ghost">How It Works</Link>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signup" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-50 border border-sage-100 text-sage-600 text-sm font-medium mb-6 animate-fade-in">
            <Brain className="w-4 h-4" />
            Rule-Based Expert System for Student Wellness
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sage-800 leading-tight mb-6 animate-slide-up">
            Understand Your Stress.<br />
            <span className="text-sage-600">Take Control of Your Well-Being.</span>
          </h1>
          <p className="text-lg text-sage-500 max-w-2xl mx-auto mb-10 animate-slide-up">
            An AI-powered rule-based wellness assessment designed to help college students
            understand their estimated stress level through logical reasoning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/signup" className="btn-primary flex items-center justify-center gap-2">
              Start Assessment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-secondary flex items-center justify-center gap-2">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-sage-800 mb-3">Features</h2>
            <p className="text-sage-500">Classical AI through a Rule-Based Expert System</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow hover:border-sage-200">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-800 mb-2">{f.title}</h3>
                <p className="text-sm text-sage-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Our AI Works — Pipeline */}
      <section className="py-20 px-6 bg-sage-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-sage-800 mb-3">How Our AI Works</h2>
            <p className="text-sage-500">From student answers to estimated stress level — through rule-based reasoning</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {pipeline.map((step, i) => (
              <div key={i} className="w-full max-w-md">
                <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sage-800 text-sm">{step.label}</h3>
                    <p className="text-xs text-sage-500">{step.desc}</p>
                  </div>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-sage-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Steps */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-sage-800 mb-3">Getting Started</h2>
            <p className="text-sage-500">Four simple steps to understand your stress level</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-sage-600" />
                </div>
                <div className="text-xs font-semibold text-sage-400 mb-1">STEP {i + 1}</div>
                <h3 className="font-semibold text-sage-800 mb-2">{step.title}</h3>
                <p className="text-sm text-sage-500">{step.desc}</p>
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
              <h3 className="font-semibold text-sage-800 mb-1">Important Disclaimer</h3>
              <p className="text-sm text-sage-600 leading-relaxed">
                This system is designed for educational and wellness awareness purposes.
                It does not diagnose mental illnesses or replace professional healthcare advice.
                If you are experiencing severe or persistent distress, consider speaking with a
                qualified mental-health professional or a trusted person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-sage-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-sage-700">Stress Detection AI</span>
          </div>
          <p className="text-xs text-sage-400">
            A Foundation of AI project — Rule-Based Expert System. Not a medical diagnostic tool.
          </p>
        </div>
      </footer>
    </div>
  );
}
