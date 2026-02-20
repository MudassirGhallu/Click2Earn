import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/'); return; }

    // Try to get profile
    let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    // If profile doesn't exist, create it immediately
    if (!data) {
      const { data: newProfile, error: insError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username: user.email.split('@')[0], balance: 0, clicks: 0 }])
        .select().single();
      setProfile(newProfile);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  const handleClick = async () => {
    window.open('https://adfoc.us/x883472110629532', '_blank'); // AdFocus Link
    if (!profile) return;

    const newBalance = parseFloat(profile.balance) + 0.0001;
    const newClicks = parseInt(profile.clicks) + 1;

    const { error } = await supabase.from('profiles')
      .update({ balance: newBalance, clicks: newClicks })
      .eq('id', profile.id);
    
    if (!error) setProfile({ ...profile, balance: newBalance, clicks: newClicks });
  };

  const handleBonus = async () => {
    const newBalance = parseFloat(profile.balance) + 0.005;
    const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
    if (!error) {
        setProfile({ ...profile, balance: newBalance });
        alert("Daily Bonus of $0.005 Added!");
    }
  };

  if (loading || !profile) return <div style={{background:'#f3bc00', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'black', fontWeight:'bold'}}>Loading Click2Earn...</div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; color: black; font-weight: bold; margin-bottom: 30px; }
        .main-layout { display: flex; gap: 30px; justify-content: center; align-items: flex-start; max-width: 1000px; margin: 0 auto; flex-wrap: wrap; }
        .clicker-section { text-align: center; flex: 1; min-width: 280px; }
        .click-btn { width: 200px; height: 200px; background: #00a884; border-radius: 50%; border: 10px solid #25d366; cursor: pointer; margin: 0 auto 15px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2); transition: 0.1s; }
        .click-btn:active { transform: scale(0.92); }
        .click-btn img { width: 100%; height: 100%; object-fit: cover; }
        .card { background: #000; border-radius: 30px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); width: 100%; box-sizing: border-box; }
        .balance-text { font-size: 42px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .btn-green { background: #25d366; color: white; width: 100%; padding: 15px; border-radius: 15px; border: none; font-weight: bold; margin-top: 15px; cursor: pointer; font-size: 16px; }
        .btn-green:hover { background: #1eb956; }
        .action-row { display: flex; gap: 10px; margin-top: 15px; }
        .action-card { background: #262109; padding: 18px; border-radius: 18px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; border: 1px solid #3d3511; flex: 1; }
        .ref-box { background: #262109; padding: 20px; border-radius: 20px; margin-top: 20px; border: 1px dashed #f3bc00; text-align: center; }
      `}} />

      <div className="header">
        <span style={{fontSize:'22px'}}>⚡ Click2Earn</span>
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
          <span>👤 {profile.username}</span>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} style={{background:'none', border:'1px solid black', padding:'5px 10px', borderRadius:'8px', cursor:'pointer'}}>Logout</button>
        </div>
      </div>

      <div className="main-layout">
        <div className="clicker-section">
          <div className="click-btn" onClick={handleClick}>
            <img src="/click.png" alt="Click Here" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/5968/5968322.png"} />
          </div>
          <h3 style={{color:'black'}}>Tap to Earn $0.0001</h3>
        </div>

        <div style={{flex: 1.2, minWidth: '320px'}}>
          <div className="card">
            <div style={{opacity:0.6, fontSize:'14px'}}>💰 Total Balance</div>
            <div className="balance-text">${parseFloat(profile.balance).toFixed(4)}</div>
            <div style={{background:'#1a1605', padding:'12px', borderRadius:'12px', display:'inline-block', minWidth:'100px'}}>
               <small style={{color:'#f3bc00'}}>Total Clicks</small><br/>
               <b style={{fontSize:'18px'}}>{profile.clicks}</b>
            </div>
            <button className="btn-green" onClick={() => window.open('https://chat.whatsapp.com/YOUR_INVITE_LINK', '_blank')}>
              Joined WhatsApp Group
            </button>
          </div>

          <div className="action-row">
            <div className="action-card" onClick={() => alert("Minimum Withdrawal is $5.00")}>Withdraw</div>
            <div className="action-card" onClick={handleBonus}>Daily Bonus</div>
          </div>

          <div className="ref-box">
             <div style={{fontSize:'13px', color:'#f3bc00', marginBottom:'10px'}}>Invite friends to earn $0.001 per sign-up!</div>
             <button style={{background:'#f3bc00', color:'black', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}} 
               onClick={() => {
                 navigator.clipboard.writeText(`https://clicknearn.netlify.app?ref=${profile.id}`);
                 alert("Referral Link Copied!");
               }}>
               Copy Link
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
