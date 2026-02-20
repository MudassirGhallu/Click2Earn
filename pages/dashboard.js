import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('Easypaisa');
  const [accountNum, setAccountNum] = useState('');
  const router = useRouter();

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/');
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
    setLoading(false);
  }

  const handleClick = async () => {
    window.open('https://adfoc.us/x883472110629532', '_blank');
    const newBalance = parseFloat(profile.balance) + 0.0001;
    const { error } = await supabase.from('profiles').update({ balance: newBalance, clicks: profile.clicks + 1 }).eq('id', profile.id);
    if (!error) setProfile({ ...profile, balance: newBalance, clicks: profile.clicks + 1 });
  };

  const handleWithdrawRequest = async (e) => {
    e.preventDefault();
    if (parseFloat(profile.balance) < 5) return alert("Minimum Withdrawal is $5.00");

    const { error } = await supabase.from('withdrawals').insert([{
      user_id: profile.id, amount: profile.balance, method: withdrawMethod, account_num: accountNum
    }]);

    if (!error) {
      await supabase.from('profiles').update({ balance: 0 }).eq('id', profile.id);
      setProfile({ ...profile, balance: 0 });
      setShowWithdraw(false);
      alert("Request Submitted!");
    } else { alert(error.message); }
  };

  if (loading || !profile) return <div style={{background:'#f3bc00', height:'100vh'}}></div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; }
        .header { display: flex; justify-content: space-between; align-items: center; color: black; font-weight: bold; margin-bottom: 30px; }
        .click-btn { width: 220px; height: 220px; background: #00a884; border-radius: 50%; border: 12px solid #25d366; cursor: pointer; margin: 0 auto 15px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .click-btn img { width: 100%; height: 100%; object-fit: cover; }
        .card { background: #000; border-radius: 35px; padding: 30px; box-shadow: 0 15px 40px rgba(0,0,0,0.4); text-align: center; }
        .balance-text { font-size: 48px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .action-card { background: #262109; padding: 20px; border-radius: 20px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; flex: 1; border: 1px solid #3d3511; }
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #1a1605; padding: 30px; border-radius: 30px; border: 1px solid #f3bc00; width: 90%; max-width: 400px; }
        input, select { width: 100%; background: #0e0c02; border: 1px solid #2d260a; padding: 15px; border-radius: 15px; color: white; margin: 10px 0; outline: none; box-sizing: border-box; }
      `}} />

      <div className="header">
        <span>⚡ ClickCash</span>
        <span>👤 {profile.username}</span>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="click-btn" onClick={handleClick}>
          <img src="/click.png" alt="Click" />
        </div>

        <div className="card">
          <div style={{opacity: 0.7}}>Current Balance</div>
          <div className="balance-text">${parseFloat(profile.balance).toFixed(4)}</div>
          <button style={{background: '#25d366', color: 'white', width: '100%', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold'}} onClick={() => window.open('YOUR_LINK')}>Joined WhatsApp Group</button>
        </div>

        <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
          <div className="action-card" onClick={() => setShowWithdraw(true)}>Withdraw</div>
          <div className="action-card" onClick={() => alert("Bonus Added!")}>Daily Bonus</div>
        </div>
      </div>

      {showWithdraw && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{color: '#f3bc00', marginTop: 0}}>Withdraw</h2>
            <form onSubmit={handleWithdrawRequest}>
              <select onChange={(e) => setWithdrawMethod(e.target.value)}>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
              </select>
              <input type="text" placeholder="Account Number" required onChange={(e) => setAccountNum(e.target.value)} />
              <button type="submit" style={{background: '#f3bc00', color: 'black', width: '100%', padding: '15px', borderRadius: '15px', fontWeight: 'bold', border: 'none'}}>Request Payout</button>
              <button type="button" onClick={() => setShowWithdraw(false)} style={{background: 'none', color: '#777', width: '100%', border: 'none', marginTop: '10px'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
