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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(profile.balance) < 5) {
      alert("Minimum Withdrawal is $5.00");
      return;
    }

    const { error } = await supabase.from('withdrawals').insert([{
      user_id: profile.id,
      amount: profile.balance,
      method: withdrawMethod,
      account_number: accountNum
    }]);

    if (!error) {
      // Deduct balance after request
      await supabase.from('profiles').update({ balance: 0 }).eq('id', profile.id);
      setProfile({ ...profile, balance: 0 });
      setShowWithdraw(false);
      alert("Withdrawal Request Submitted Successfully!");
    } else {
      alert("Error: " + error.message);
    }
  };

  if (loading || !profile) return <div style={{background:'#f3bc00', height:'100vh'}}></div>;

  return (
    <div className="dash-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .dash-container { background: #f3bc00; min-height: 100vh; font-family: sans-serif; padding: 20px; color: white; }
        .card { background: #000; border-radius: 30px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .balance-text { font-size: 48px; font-weight: bold; color: #f3bc00; margin: 10px 0; }
        .action-card { background: #262109; padding: 20px; border-radius: 20px; text-align: center; cursor: pointer; color: #f3bc00; font-weight: bold; border: 1px solid #3d3511; flex: 1; }
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { background: #1a1605; padding: 30px; border-radius: 30px; border: 1px solid #f3bc00; width: 90%; max-width: 400px; color: white; }
        input, select { width: 100%; background: #0e0c02; border: 1px solid #2d260a; padding: 12px; border-radius: 12px; color: white; margin: 10px 0; outline: none; }
        .confirm-btn { background: #f3bc00; color: black; border: none; width: 100%; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
      `}} />

      {/* Main UI */}
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="card">
          <div style={{opacity: 0.6}}>💰 Current Balance</div>
          <div className="balance-text">${parseFloat(profile.balance).toFixed(4)}</div>
          <button className="confirm-btn" style={{background: '#25d366', color: 'white'}} onClick={() => window.open('https://chat.whatsapp.com/YOUR_LINK')}>Joined WhatsApp Group</button>
        </div>

        <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
          <div className="action-card" onClick={() => setShowWithdraw(true)}>Withdraw</div>
          <div className="action-card">Daily Bonus</div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdraw && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{marginTop: 0, color: '#f3bc00'}}>Withdraw Funds</h2>
            <p style={{fontSize: '14px', opacity: 0.7}}>Minimum withdrawal: $5.00</p>
            
            <form onSubmit={handleWithdraw}>
              <label style={{fontSize: '12px', fontWeight: 'bold'}}>SELECT METHOD</label>
              <select onChange={(e) => setWithdrawMethod(e.target.value)}>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
              </select>

              <label style={{fontSize: '12px', fontWeight: 'bold'}}>ACCOUNT NUMBER</label>
              <input type="text" placeholder="03XXXXXXXXX" required onChange={(e) => setAccountNum(e.target.value)} />

              <button type="submit" className="confirm-btn">Request Payout</button>
              <button type="button" onClick={() => setShowWithdraw(false)} style={{background: 'transparent', color: '#777', width: '100%', border: 'none', marginTop: '10px', cursor: 'pointer'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
