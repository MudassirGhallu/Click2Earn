import { useState } from 'react';
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
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      alert("Password must be 6+ chars with 1 letter and 1 number.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/dashboard');
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, password, options: { data: { username } }
      });
      if (error) alert(error.message);
      else alert("Signup successful! You can now Login.");
    }
  };

  return (
    <div className="auth-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container {
          background-color: #0e0c02;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          color: white;
        }
        .auth-card {
          background-color: #1a1605;
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 40px;
          border: 1px solid #2d260a;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          text-align: center;
        }
        .logo-box {
          background: #f3bc00;
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 30px;
          color: black;
        }
        .tab-box {
          background: #0e0c02;
          padding: 5px;
          border-radius: 15px;
          display: flex;
          margin-bottom: 30px;
          border: 1px solid #2d260a;
        }
        .tab-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
          background: transparent;
          color: #555;
        }
        .tab-btn.active {
          background: #f3bc00;
          color: black;
        }
        input {
          width: 100%;
          background: #0e0c02;
          border: 1px solid #2d260a;
          padding: 15px;
          border-radius: 15px;
          color: white;
          margin-bottom: 20px;
          box-sizing: border-box;
          outline: none;
        }
        input:focus { border-color: #f3bc00; }
        .submit-btn {
          width: 100%;
          background: #f3bc00;
          color: black;
          padding: 18px;
          border-radius: 15px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        label {
          display: block;
          text-align: left;
          font-size: 12px;
          color: #777;
          margin-bottom: 8px;
          font-weight: bold;
          text-transform: uppercase;
        }
      `}} />

      <div className="auth-card">
        <div className="logo-box">⚡</div>
        <h1 style={{marginBottom: '30px'}}>Click2Earn</h1>

        <div className="tab-box">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <label>Username</label>
              <input type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required />
            </>
          )}
          <label>Email Address</label>
          <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required />
          
          <label>Password</label>
          <input type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  );
}
