import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, User, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'];

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', college: '', course: '', year: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.email.trim()) { setError('Please enter your email address.'); return; }
    if (!form.password) { setError('Please enter a password.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!form.age || parseInt(form.age) < 10 || parseInt(form.age) > 120) { setError('Please enter a valid age.'); return; }
    if (!form.college.trim()) { setError('Please enter your college or institution.'); return; }
    if (!form.course.trim()) { setError('Please enter your course.'); return; }
    if (!form.year) { setError('Please select your year of study.'); return; }
    if (!agreed) { setError('Please agree to the privacy policy to continue.'); return; }

    setLoading(true);
    const { error: signUpError } = await signUp(
      form.email.trim(), form.password, form.name.trim(),
      form.age, form.college.trim(), form.course.trim(), form.year,
    );
    setLoading(false);

    if (signUpError) {
      setError(signUpError.includes('already') ? 'An account with this email already exists.' : signUpError);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-sage-600 hover:text-sage-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-sage-700">Stress Detection AI</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-sage-800 mb-2">Create Your Account</h1>
            <p className="text-sage-500 text-sm">Start your wellness journey today</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input id="name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                      className="input-field pl-11" placeholder="Jane Doe" />
                  </div>
                </div>
                <div>
                  <label className="label-text" htmlFor="age">Age</label>
                  <input id="age" type="number" value={form.age} onChange={(e) => update('age', e.target.value)}
                    className="input-field" placeholder="20" min="10" max="120" />
                </div>
              </div>

              <div>
                <label className="label-text" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                    className="input-field pl-11" placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text" htmlFor="password">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input id="password" type={showPassword ? 'text' : 'password'} value={form.password}
                      onChange={(e) => update('password', e.target.value)} className="input-field pl-11 pr-11" placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label-text" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)} className="input-field pl-11" placeholder="Repeat password" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text" htmlFor="college">College / Institution</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input id="college" type="text" value={form.college} onChange={(e) => update('college', e.target.value)}
                      className="input-field pl-11" placeholder="Your university" />
                  </div>
                </div>
                <div>
                  <label className="label-text" htmlFor="course">Course</label>
                  <input id="course" type="text" value={form.course} onChange={(e) => update('course', e.target.value)}
                    className="input-field" placeholder="e.g. Computer Science" />
                </div>
              </div>

              <div>
                <label className="label-text" htmlFor="year">Year of Study</label>
                <select id="year" value={form.year} onChange={(e) => update('year', e.target.value)} className="input-field">
                  <option value="">Select year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 bg-sage-50 rounded-xl">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-sage-300 text-sage-600 focus:ring-sage-400 flex-shrink-0" />
                <span className="text-sm text-sage-600 leading-relaxed">
                  I agree to the privacy policy and understand that this tool provides wellness estimates
                  and is not a medical diagnostic system.
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-sage-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-600 font-semibold hover:text-sage-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
