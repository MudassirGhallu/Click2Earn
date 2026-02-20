import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) return alert("Only @gmail.com is allowed!");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/dashboard');
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, password, options: { data: { username } } 
      });
      if (error) {
        alert(error.message);
      } else {
        await supabase.from('profiles').insert([{ id: data.user.id, username, balance: 0, clicks: 0 }]);
        alert("Success! Now please Login.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { background: #0e0c02; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; color: white; }
        .auth-card { background: #1a1605; width: 100%; max-width: 400px; padding: 40px; border-radius: 40px; border: 1px solid #2d260a; text-align: center; }
        .submit-btn { width: 100%; background: #f3bc00; color: black; padding: 18px; border-radius: 15px; font-weight: bold; border: none; cursor: pointer; margin-top: 10px; }
        input { width: 100%; background: #0e0c02; border: 1px solid #2d260a; padding: 15px; border-radius: 15px; color: white; margin-bottom: 20px; box-sizing: border-box; }
        .tab-box { background: #0e0c02; padding: 5px; border-radius: 15px; display: flex; margin-bottom: 30px; border: 1px solid #2d260a; }
        .tab-btn { flex: 1; padding: 12px; border: none; border-radius: 12px; cursor: pointer; color: #555; background: transparent; }
        .tab-btn.active { background: #f3bc00; color: black; }
      `}} />
      <div className="auth-card">
        <h1 style={{color: '#f3bc00'}}>ClickCash</h1>
        <div className="tab-box">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
        <form onSubmit={handleAuth}>
          {!isLogin && <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} required />}
          <input type="email" placeholder="Email (@gmail.com)" onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" className="submit-btn">{isLogin ? 'Login →' : 'Create Account →'}</button>
        </form>
      </div>
    </div>
  );
}
