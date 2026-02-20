import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('Easypaisa');
  const [accountNum, setAccountNum] = useState('');
  const router = useRouter();

  useEffect(() => { fetchProfile(); fetchHistory(); }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/');
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
    setLoading(false);
  }

  async function fetchHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let { data } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setHistory(data);
  }

  const handleClick = async () => {
    window.open('https://adfoc.us/x883472110629532', '_blank');
    const newBalance = parseFloat(profile.balance) + 0.0001;
    const { error } = await supabase.from('profiles').update({ balance: newBalance, clicks: profile.clicks + 1 }).eq('id', profile.id);
    if (!error) setProfile({ ...profile, balance: newBalance, clicks: profile.clicks + 1 });
  };

  const handleBonus = async () => {
    const bonusAmt = 0.005;
    const { error } = await supabase.from('profiles').update({ balance: parseFloat(profile.balance) + bonusAmt }).eq('id', profile.id);
    if (!error) {
      setProfile({ ...profile, balance: parseFloat(profile.balance) + bonusAmt });
      alert("Bonus Added: $0.005!");
    }
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
      fetchHistory();
      alert("Request Submitted!");
    }
  };

  if (loading || !profile) return <div style={{background:'#f3bc00', height:'100vh'}}></div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; }
        .header { display: flex; justify-content: space-between; align-items: center; color: black; font-weight: bold; margin-bottom: 30px; }
        .click-btn { width: 200px; height: 200px; background: #00a884; border-radius: 50%; border: 10px solid #25d366; cursor: pointer; margin: 0 auto 20px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .click-btn img { width: 100%; height: 100%; object-fit: cover; }
        .card { background: #000; border-radius: 30px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); text-align: center; margin-bottom: 20px; }
        .balance-text { font-size: 42px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .action-row { display: flex; gap: 15px; margin-bottom: 25px; }
        .action-card { background: #262109; padding: 20px; border-radius: 20px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; flex: 1; border: 1px solid #3d3511; }
        .history-table { width: 100%; border-collapse: collapse; background: #000; border-radius: 20px; overflow: hidden; font-size: 14px; }
        .history-table td, .history-table th { padding: 15px; text-align: left; border-bottom: 1px solid #222; }
        .status-pill { padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .pending { background: #443a05; color: #f3bc00; }
        .paid { background: #05441a; color: #25d366; }
      `}} />

      <div className="header">
        <span style={{fontSize:'22px'}}>⚡ ClickCash</span>
        <span>👤 {profile.username}</span>
      </div>

      <div style={{maxWidth: '600px', margin: '0 auto'}}>
        <div className="click-btn" onClick={handleClick}>
          <img src="/click.png" alt="Click" />
        </div>

        <div className="card">
          <div style={{opacity: 0.7}}>Total Balance</div>
          <div className="balance-text">${parseFloat(profile.balance).toFixed(4)}</div>
          <div style={{fontSize:'12px', color:'#f3bc00', marginBottom:'10px'}}>Ref ID: {profile.id}</div>
          <button style={{background:'#25d366', color:'white', width:'100%', padding:'12px', borderRadius:'12px', border:'none', fontWeight:'bold'}} 
            onClick={() => { navigator.clipboard.writeText(`https://clicknearn.netlify.app?ref=${profile.id}`); alert("Referral Link Copied!"); }}>
            Copy Referral Link ($0.001/Ref)
          </button>
        </div>

        <div className="action-row">
          <div className="action-card" onClick={() => setShowWithdraw(true)}>Withdraw</div>
          <div className="action-card" onClick={handleBonus}>Bonus</div>
        </div>

        <h3 style={{color:'black', marginBottom:'10px'}}>Withdrawal History</h3>
        <table className="history-table">
          <thead style={{background: '#111'}}>
            <tr><th>Method</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {history.length > 0 ? history.map(item => (
              <tr key={item.id}>
                <td>{item.method}</td>
                <td>${parseFloat(item.amount).toFixed(2)}</td>
                <td><span className={`status-pill ${item.status}`}>{item.status}</span></td>
              </tr>
            )) : <tr><td colSpan="3" style={{textAlign:'center', opacity:0.5}}>No history yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showWithdraw && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', z-index:100}}>
          <div style={{background:'#1a1605', padding:'30px', borderRadius:'30px', border:'1px solid #f3bc00', width:'90%', maxWidth:'400px'}}>
            <h2 style={{color:'#f3bc00', marginTop:0}}>Withdraw</h2>
            <form onSubmit={handleWithdrawRequest}>
              <select style={{width:'100%', background:'#0e0c02', color:'white', padding:'15px', borderRadius:'12px', marginBottom:'10px'}} onChange={(e) => setWithdrawMethod(e.target.value)}>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
              </select>
              <input style={{width:'100%', background:'#0e0c02', color:'white', padding:'15px', borderRadius:'12px', marginBottom:'15px'}} type="text" placeholder="Account Number" required onChange={(e) => setAccountNum(e.target.value)} />
              <button type="submit" style={{background:'#f3bc00', color:'black', width:'100%', padding:'15px', borderRadius:'12px', fontWeight:'bold', border:'none'}}>Request Payout</button>
              <button type="button" onClick={() => setShowWithdraw(false)} style={{background:'none', color:'#777', width:'100%', border:'none', marginTop:'10px'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
