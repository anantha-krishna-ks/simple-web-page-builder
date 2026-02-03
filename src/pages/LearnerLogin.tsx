import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const LearnerLogin = () => {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginName || !password) {
      toast.error('Please enter both login name and password');
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Check for student credentials (from existing Login.tsx)
      if (loginName === 'student' && password === 'student123') {
        localStorage.setItem('userRole', 'student');
        toast.success('Login successful!');
        navigate('/learner-dashboard');
      } else {
        toast.error('Invalid credentials. Try: student / student123');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast.info('Password recovery coming soon!');
  };

  const handleOTPLogin = () => {
    toast.info('OTP login coming soon!');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 via-transparent to-purple-100/40 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-100/30 via-transparent to-blue-100/30 animate-gradient-slow"></div>
      
      {/* WhatsApp-style doodle pattern background */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="doodle-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Book */}
              <path d="M20,30 L35,30 L35,45 L20,45 Z" fill="none" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3"/>
              <line x1="20" y1="35" x2="35" y2="35" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Star */}
              <path d="M150,20 L153,28 L162,28 L155,33 L158,42 L150,36 L142,42 L145,33 L138,28 L147,28 Z" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Pencil */}
              <path d="M70,80 L75,75 L78,78 L73,83 Z M75,75 L80,70" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3"/>
              <rect x="73" y="83" width="3" height="8" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Light bulb */}
              <circle cx="170" cy="100" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3"/>
              <path d="M165,108 L175,108" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Trophy */}
              <path d="M40,150 L40,145 L35,145 L35,140 L45,140 L45,145 L50,145 L50,150 Z M38,150 L42,150 L42,155 L38,155 Z" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Graduation cap */}
              <path d="M100,160 L90,155 L100,150 L110,155 Z M100,155 L100,165" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Apple */}
              <circle cx="180" cy="170" r="8" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.3"/>
              <path d="M180,162 L180,158" stroke="#10B981" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Music note */}
              <path d="M25,100 L25,115 M25,100 L32,98 L32,113" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.3"/>
              <circle cx="25" cy="115" r="3" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Calculator */}
              <rect x="140" y="140" width="20" height="25" rx="2" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.3"/>
              <line x1="143" y1="145" x2="157" y2="145" stroke="#06B6D4" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#doodle-pattern)"/>
        </svg>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Oxford Advantage Logo */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 px-6 py-4 rounded-xl shadow-sm border border-blue-200/50">
            {/* Colorful Book Icon */}
            <div className="relative">
              <div className="w-12 h-12 relative">
                {/* Book pages with gradient colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-l-md transform -rotate-12 shadow-md"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-md transform rotate-0 translate-x-1 shadow-md"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-green-500 rounded-r-md transform rotate-12 translate-x-2 shadow-md"></div>
              </div>
            </div>
            
            {/* Text Logo */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800 leading-tight">Oxford</span>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent leading-tight">Advantage</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Integrated Learning Solutions</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-3xl shadow-lg p-8 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          {/* Ribbon */}
          <div className="absolute top-6 -right-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-1.5 rotate-45 shadow-lg">
            <span className="text-xs font-semibold tracking-wide">SECURE LOGIN</span>
          </div>
          
          {/* Header */}
          <div className="mb-6 pr-16">
            <h1 className="text-2xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">Sign in to your Account</h1>
            <p className="text-sm text-gray-500">Enter your email and password to log in</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Loisbecket@gmail.com"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Log In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">Or</span>
              </div>
            </div>

            {/* OTP Login Button */}
            <button
              type="button"
              onClick={handleOTPLogin}
              className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Login via OTP
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button className="text-blue-500 hover:text-blue-600 font-semibold transition-colors">
              Sign Up
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">
                Demo
              </div>
              <span className="text-gray-500">student / student123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerLogin;
