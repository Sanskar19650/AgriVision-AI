import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Mail,
  Lock,
  User,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loginWithDemo } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'farmer' | 'agronomist' | 'researcher'>('farmer');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) throw new Error('Please enter your full name.');
        await registerWithEmail(email, password, fullName, role);
        setSuccess('Account created successfully! Redirecting...');
      } else {
        await loginWithEmail(email, password);
        setSuccess('Signed in successfully! Redirecting...');
      }
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing.');
      } else {
        setError(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (selectedRole: 'farmer' | 'agronomist' = 'farmer') => {
    loginWithDemo(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 animate-fade-in">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 mb-2">
          <Sprout className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          {isRegister ? 'Create AgriVision Account' : 'Welcome to AgriVision AI'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Precision Agriculture, Deep Learning Diagnostics & Blockchain Notary
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
        
        {/* Quick Instant Demo Access Buttons (Evaluator Friendly) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              One-Click Evaluator Demo
            </span>
            <Badge variant="emerald" size="sm">Zero Setup</Badge>
          </div>
          <p className="text-[11px] text-emerald-800 leading-snug">
            Instantly explore preloaded farms, IoT readings, and CNN scans without filling forms:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Sprout className="w-3.5 h-3.5" />
              Demo Farmer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('agronomist')}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Agronomist
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-stone-400 uppercase tracking-wider font-semibold absolute">
            Or Sign In With
          </span>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-700 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google Firebase
        </button>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rameshwar Patil"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@agrivision.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-xs outline-none bg-white"
              >
                <option value="farmer">Farmer / Land Owner</option>
                <option value="agronomist">Agronomist / Agricultural Specialist</option>
                <option value="researcher">Agricultural Researcher / Inspector</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                Register Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Toggle between Register and Sign In */}
        <div className="text-center pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs text-stone-600 hover:text-emerald-700 font-semibold"
          >
            {isRegister
              ? 'Already have an account? Sign in here'
              : "Don't have an account? Create one now"}
          </button>
        </div>

      </div>
    </div>
  );
};
