import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0.0035); // Example initial value
  const [clicks, setClicks] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/');
      else setUser(user);
    };
    fetchUser();
  }, []);

  const handleClick = () => {
    setBalance(prev => prev + 0.0001);
    setClicks(prev => prev + 1);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) return <div style={{background:'#f3bc00', height:'100vh'}}></div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; }
        .header { display: flex; justify-content: space-between; align-items: center; color: black; font-weight: bold; margin-bottom: 40px; }
        .main-layout { display: flex; gap: 40px; justify-content: center; align-items: flex-start; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
        .clicker-section { text-align: center; flex: 1; min-width: 300px; }
        .click-btn { width: 220px; height: 220px; background: #00a884; border-radius: 50%; border: 15px solid #25d366; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: 0.1s; }
        .click-btn:active { transform: scale(0.95); }
        .click-btn span { font-size: 100px; color: white; font-weight: bold; }
        .stats-section { flex: 1; min-width: 350px; display: flex; flex-direction: column; gap: 20px; }
        .card { background: #000; border-radius: 30px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .balance-text { font-size: 48px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .mini-stats { display: flex; gap: 15px; margin-top: 20px; }
        .mini-card { background: #1a1605; flex: 1; padding: 15px; border-radius: 20px; text-align: center; }
        .btn-green { background: #25d366; color: white; width: 100%; padding: 15px; border-radius: 15px; border: none; font-weight: bold; margin-top: 20px; cursor: pointer; }
        .grid-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .action-card { background: #262109; padding: 20px; border-radius: 20px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; border: 1px solid #3d3511; }
        .referral-card { background: #6b5c1d; padding: 20px; border-radius: 20px; border: 1px solid #8e7b2a; }
        .copy-btn { background: #1a1605; color: white; border: none; width: 100%; padding: 12px; border-radius: 12px; margin-top: 10px; cursor: pointer; font-weight: bold; }
      `}} />

      <div className="header">
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{background:'#000', padding:'5px', borderRadius:'8px', color:'#f3bc00'}}>⚡</div>
          <span style={{fontSize:'24px'}}>Click<span style={{opacity:0.7}}>2Earn</span></span>
        </div>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
          <span>👤 {user.email.split('@')[0]}</span>
          <span onClick={logout} style={{cursor:'pointer'}}>Logout  logout</span>
        </div>
      </div>

      <div className="main-layout">
        <div className="clicker-section">
          <div className="click-btn" onClick={handleClick}><span>T</span></div>
          <h2 style={{color:'black', fontWeight:'bold'}}>Click to earn</h2>
        </div>

        <div className="stats-section">
          <div className="card">
            <div style={{display:'flex', alignItems:'center', gap:'10px', opacity:0.7}}>💰 Your Balance</div>
            <div className="balance-text">${balance.toFixed(4)}</div>
            <div style={{opacity:0.5, fontSize:'14px'}}>Available to withdraw</div>
            <div className="mini-stats">
              <div className="mini-card">
                <div style={{fontSize:'12px', color:'#f3bc00'}}>Total Clicks</div>
                <div style={{fontSize:'20px', fontWeight:'bold'}}>{clicks.toLocaleString()}</div>
              </div>
              <div className="mini-card">
                <div style={{fontSize:'12px', color:'#f3bc00'}}>Per Click</div>
                <div style={{fontSize:'20px', fontWeight:'bold'}}>$0.0001</div>
              </div>
            </div>
            <button className="btn-green">Join WhatsApp Channel</button>
          </div>

          <div className="grid-buttons">
            <div className="action-card">Withdraw</div>
            <div className="action-card">Bonus</div>
            <div className="action-card">Leaderboard</div>
          </div>

          <div className="referral-card">
            <div style={{fontSize:'14px', marginBottom:'10px'}}>Invite Friends & Earn $0.001</div>
            <button className="copy-btn" onClick={() => {
              navigator.clipboard.writeText(`https://clicknearn.netlify.app?ref=${user.id}`);
              alert("Link Copied!");
            }}>Copy Referral Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
