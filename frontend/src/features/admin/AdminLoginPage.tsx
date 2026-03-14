/**
 * Admin Login Page
 * Authentication page for admin panel
 */
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

/**
 * Admin Login Page Component
 */
export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginError, isLoggingIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white font-mono tracking-tight mb-2">
            ARORMS<span className="text-[#0047FF]">_</span>ADMIN
          </h1>
          <p className="text-gray-500 text-sm font-mono uppercase tracking-wider">
            Authentication Required
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white px-12 py-3 text-sm font-mono focus:outline-none focus:border-[#0047FF] transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white px-12 py-3 text-sm font-mono focus:outline-none focus:border-[#0047FF] transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 text-sm font-mono">
              Invalid credentials. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[#0047FF] text-white py-3 text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        {/* ASCII Art Decoration */}
        <div className="mt-12 text-center">
          <pre className="text-gray-800 text-xs font-mono leading-tight">
{`    ╔═══════════════════╗
    ║  ACCESS RESTRICTED ║
    ╚═══════════════════╝`}
          </pre>
        </div>
      </div>
    </div>
  );
}