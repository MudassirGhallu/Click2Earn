import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [refCode, setRefCode] = useState('');
  const router = useRouter();

  // Capture referral code from URL automatically
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) setRefCode(ref);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!email.endsWith('@gmail.com')) {
      alert("Only @gmail.com addresses are allowed!");
      return;
    }
    
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      alert("Password must be 6+ chars with 1 letter and 1 number.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/dashboard');
    } else {
      // 1. Sign up the user
      const { data, error } = await supabase.auth.signUp({ 
        email, password, options: { data: { username } }
      });

      if (error) {
        alert(error.message);
      } else {
        // 2. Create the profile with $0 balance
        const userId = data.user.id;
        await supabase.from('profiles').insert([
          { id: userId, username: username, balance: 0, clicks: 0 }
        ]);

        // 3. Pay the referrer $0.001 if a code exists
        if (refCode) {
          const { data: refUser } = await supabase.from('profiles').select('balance').eq('id', refCode).single();
          if (refUser) {
            const newRefBalance = parseFloat(refUser.balance) + 0.001;
            await supabase.from('profiles').update({ balance: newRefBalance }).eq('id', refCode);
          }
        }
        alert("Account Created! You can now Login.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="auth-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { background: #0e0c02; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; color: white; }
        .auth-card { background: #1a1605; width: 100%; max-width: 400px; padding: 40px; border-radius: 40px; border: 1px solid #2d260a; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; }
        .logo-box { background: #f3bc00; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; }
        .tab-box { background: #0e0c02; padding: 5px; border-radius: 15px; display: flex; margin-bottom: 30px; border: 1px solid #2d260a; }
        .tab-btn { flex: 1; padding: 12px; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; color: #555; background: transparent; }
        .tab-btn.active { background: #f3bc00; color: black; }
        input { width: 100%; background: #0e0c02; border: 1px solid #2d260a; padding: 15px; border-radius: 15px; color: white; margin-bottom: 20px; box-sizing: border-box; outline: none; }
        .submit-btn { width: 100%; background: #f3bc00; color: black; padding: 18px; border-radius: 15px; font-weight: bold; border: none; cursor: pointer; font-size: 16px; margin-top: 10px; }
        label { display: block; text-align: left; font-size: 12px; color: #777; margin-bottom: 8px; font-weight: bold; text-transform: uppercase; }
      `}} />
      <div className="auth-card">
        <div className="logo-box">⚡</div>
        <h1 style={{marginBottom: '30px'}}>Click<span style={{color:'#f3bc00'}}>2Earn</span></h1>
        <div className="tab-box">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
        <form onSubmit={handleAuth}>
          {!isLogin && <><label>Username</label><input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} required /></>}
          <label>Gmail Address</label>
          <input type="email" placeholder="user@gmail.com" onChange={(e)=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="Min 6 chars (1 letter, 1 number)" onChange={(e)=>setPassword(e.target.value)} required />
          {!isLogin && <><label>Referral ID (Optional)</label><input type="text" value={refCode} placeholder="Enter Code" onChange={(e)=>setRefCode(e.target.value)} /></>}
          <button type="submit" className="submit-btn">{isLogin ? 'Login →' : 'Create Account →'}</button>
        </form>
      </div>
    </div>
  );
}
