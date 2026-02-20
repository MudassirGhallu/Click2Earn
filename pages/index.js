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
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(pass);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters, including 1 letter and 1 number.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/dashboard');
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { username: username } }
      });
      if (error) alert(error.message);
      else alert("Account created! You can now login.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1605] flex items-center justify-center p-6 font-sans">
      <div className="bg-[#262109] w-full max-w-md rounded-3xl p-8 border border-[#3d3511] shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#f3bc00] p-3 rounded-xl mb-3 shadow-lg shadow-yellow-900/20">
            <span className="text-black text-2xl font-bold">⚡</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Click2Earn</h1>
        </div>

        <div className="flex bg-[#1a1605] rounded-xl p-1 mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-bold transition ${isLogin ? 'bg-[#f3bc00] text-black' : 'text-gray-400'}`}
          >Login</button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-bold transition ${!isLogin ? 'bg-[#f3bc00] text-black' : 'text-gray-400'}`}
          >Sign Up</button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-gray-400 text-sm block mb-2">Username</label>
              <input 
                type="text" placeholder="Enter your username" 
                className="w-full bg-[#1a1605] border border-[#3d3511] p-4 rounded-xl text-white outline-none focus:border-[#f3bc00]"
                onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
          )}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email</label>
            <input 
              type="email" placeholder="Enter your email" 
              className="w-full bg-[#1a1605] border border-[#3d3511] p-4 rounded-xl text-white outline-none focus:border-[#f3bc00]"
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Password</label>
            <input 
              type="password" placeholder="Enter your password" 
              className="w-full bg-[#1a1605] border border-[#3d3511] p-4 rounded-xl text-white outline-none focus:border-[#f3bc00]"
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit" className="w-full bg-[#f3bc00] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#d4a400] transition-colors mt-4">
            {isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <span onClick={() => setIsLogin(!isLogin)} className="text-[#f3bc00] ml-1 cursor-pointer hover:underline">
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
