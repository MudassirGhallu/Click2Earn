import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Check your email for confirmation!");
    else alert("Signup successful!");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#f3bc00] p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Click2Earn</h1>
        <form className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full p-4 rounded-xl border-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 rounded-xl border-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-black text-white p-4 rounded-xl font-bold">Login</button>
          <button onClick={handleSignUp} className="w-full bg-gray-800 text-white p-4 rounded-xl font-bold opacity-80">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
