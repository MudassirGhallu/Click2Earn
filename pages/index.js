import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const validatePassword = (pass) => {
    // 6 chars, 1 letter, 1 number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pass);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      alert("Password must be 6+ digits with at least 1 letter and 1 number.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/dashboard');
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, password,
        options: { data: { display_name: username } }
      });
      if (error) alert(error.message);
      else alert("Signup successful! You can now Login.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c02] flex items-center justify-center p-4">
      <div className="bg-[#1a1605] w-full max-w-md rounded-[2.5rem] p-10 border border-[#2d260a] shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#f3bc00] w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(243,188,0,0.3)]">
            <span className="text-black text-3xl">⚡</span>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">Click2Earn</h1>
        </div>

        <div className="flex bg-[#0e0c02] rounded-2xl p-1.5 mb-10 border border-[#2d260a]">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${isLogin ? 'bg-[#f3bc00] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${!isLogin ? 'bg-[#f3bc00] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2.5 block ml-1">Username</label>
              <div className="relative">
                <input type="text" placeholder="Enter your username" required className="w-full bg-[#0e0c02] border border-[#2d260a] p-4 rounded-2xl text-white placeholder:text-gray-700 outline-none focus:border-[#f3bc00] transition-colors" onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-2.5 block ml-1">Email</label>
            <input type="email" placeholder="Enter your email" required className="w-full bg-[#0e0c02] border border-[#2d260a] p-4 rounded-2xl text-white placeholder:text-gray-700 outline-none focus:border-[#f3bc00] transition-colors" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-gray-400 text-sm font-medium mb-2.5 block ml-1">Password</label>
            <input type="password" placeholder="Enter your password" required className="w-full bg-[#0e0c02] border border-[#2d260a] p-4 rounded-2xl text-white placeholder:text-gray-700 outline-none focus:border-[#f3bc00] transition-colors" onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-[#f3bc00] text-black py-4.5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 shadow-[0_10px_20px_rgba(243,188,0,0.15)]">
            {isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#f3bc00] ml-2 hover:underline decoration-2 underline-offset-4">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
