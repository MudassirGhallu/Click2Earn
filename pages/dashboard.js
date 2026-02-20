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
    if (!user) return router.push('/');

    let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    if (!data) { // Create profile if it doesn't exist
      const { data: newProfile } = await supabase.from('profiles').insert([{ id: user.id, username: user.user_metadata.username, balance: 0, clicks: 0 }]).select().single();
      setProfile(newProfile);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  const handleClick = async () => {
    // 1. Open your AdFocus Link
    window.open('https://adfoc.us/x883472110629532', '_blank');

    // 2. Update Database
    const newBalance = parseFloat(profile.balance) + 0.0001;
    const newClicks = profile.clicks + 1;

    const { error } = await supabase.from('profiles').update({ balance: newBalance, clicks: newClicks }).eq('id', profile.id);
    
    if (!error) setProfile({ ...profile, balance: newBalance, clicks: newClicks });
  };

  const handleBonus = async () => {
    alert("Daily Bonus of $0.005 Added!");
    const newBalance = parseFloat(profile.balance) + 0.005;
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
    setProfile({ ...profile, balance: newBalance });
  };

  if (loading) return <div style={{background:'#f3bc00', height:'100vh'}}></div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; }
        .header { display: flex; justify-content: space-between; align-items: center; color: black; font-weight: bold; margin-bottom: 40px; }
        .main-layout { display: flex; gap: 40px; justify-content: center; align-items: flex-start; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
        .clicker-section { text-align: center; flex: 1; min-width: 300px; }
        .click-btn { width: 220px; height: 220px; background: #00a884; border-radius: 50%; border: 15px solid #25d366; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; overflow: hidden; }
        .click-btn img { width: 100%; height: 100%; object-fit: cover; }
        .card { background: #000; border-radius: 30px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .balance-text { font-size: 48px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .btn-green { background: #25d366; color: white; width: 100%; padding: 15px; border-radius: 15px; border: none; font-weight: bold; margin-top: 20px; cursor: pointer; }
        .action-card { background: #262109; padding: 20px; border-radius: 20px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; border: 1px solid #3d3511; flex: 1; }
      `}} />

      <div className="header">
        <span>⚡ Click2Earn</span>
        <div style={{display:'flex', gap:'20px'}}>
          <span>👤 {profile.username || 'User'}</span>
          <span onClick={() => supabase.auth.signOut().then(() => router.push('/'))} style={{cursor:'pointer'}}>Logout</span>
        </div>
      </div>

      <div className="main-layout">
        <div className="clicker-section">
          <div className="click-btn" onClick={handleClick}>
            <img src="/click.png" alt="Click" />
          </div>
          <h2 style={{color:'black'}}>Click to earn</h2>
        </div>

        <div className="stats-section" style={{flex: 1, display:'flex', flexDirection:'column', gap:'20px'}}>
          <div className="card">
            <div>💰 Your Balance</div>
            <div className="balance-text">${parseFloat(profile.balance).toFixed(4)}</div>
            <div style={{display:'flex', gap:'10px'}}>
              <div style={{background:'#1a1605', padding:'10px', borderRadius:'10px', flex:1}}>
                <small>Clicks</small><br/><b>{profile.clicks}</b>
              </div>
            </div>
            <button className="btn-green" onClick={() => window.open('YOUR_WHATSAPP_LINK_HERE', '_blank')}>
              Joined WhatsApp Group
            </button>
          </div>

          <div style={{display:'flex', gap:'10px'}}>
            <div className="action-card" onClick={() => alert("Min withdraw is $5.00")}>Withdraw</div>
            <div className="action-card" onClick={handleBonus}>Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
