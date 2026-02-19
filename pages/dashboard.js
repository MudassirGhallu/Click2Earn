import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. Fetch User Data
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser(data);
      checkBonusTimer(data.last_bonus_claim);
    }
    setLoading(false);
  }

  // 2. Ad-Loop Logic (The "Click to Earn" Button)
  const handleAdClick = () => {
    // In production, replace this with your random 100 links logic
    const adLink = "http://adfoc.us/868155112924180"; 
    window.location.href = adLink; 
    // Logic to add $0.0001 happens when they return to the site
  };

  // 3. Bonus Timer Logic (1 Hour)
  const checkBonusTimer = (lastClaim) => {
    if (!lastClaim) return;
    const nextClaim = new Date(lastClaim).getTime() + 3600000;
    const now = new Date().getTime();
    if (nextClaim > now) setTimeLeft(Math.floor((nextClaim - now) / 1000));
  };

  if (loading) return <div className="bg-black text-yellow-500 h-screen flex items-center justify-center">Loading Click2Earn...</div>;

  return (
    <div className="min-h-screen bg-[#f3bc00] font-sans p-4">
      {/* Header */}
      <nav className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl text-white mb-6">
        <h1 className="font-bold text-xl text-yellow-500">Click2Earn</h1>
        <div className="flex gap-4 items-center">
          <span>{user?.username}</span>
          <button onClick={() => supabase.auth.signOut()} className="text-sm opacity-70">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: The Main Button */}
        <div className="flex flex-col items-center justify-center p-10 bg-transparent">
          <button 
            onClick={handleAdClick}
            className="w-48 h-48 bg-[#00a884] rounded-full border-8 border-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          >
            <span className="text-6xl text-white font-bold">T</span>
          </button>
          <p className="mt-4 font-bold text-gray-800 text-lg">Click to earn $0.0001</p>
        </div>

        {/* Right Side: Stats & Actions */}
        <div className="space-y-4">
          {/* Balance Card */}
          <div className="bg-[#0e0e0e] p-6 rounded-3xl text-white shadow-xl border border-gray-800">
            <p className="text-gray-400 flex items-center gap-2">💰 Your Balance</p>
            <h2 className="text-4xl font-bold text-yellow-500 my-2">${user?.balance.toFixed(4)}</h2>
            <p className="text-xs text-gray-500">Available to withdraw (Min $2.00)</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400">Total Clicks</p>
                <p className="font-bold">{user?.total_clicks}</p>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400">Per Click</p>
                <p className="font-bold">$0.0001</p>
              </div>
            </div>

            <a href="https://chat.whatsapp.com/F5Zw37pwBPXIJMED3N4KVn" className="mt-4 block w-full bg-[#25d366] text-center py-3 rounded-xl font-bold hover:bg-[#1ebd5b]">
              Join WhatsApp Group
            </a>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-[#1a1a1a] text-white p-4 rounded-2xl text-sm font-semibold hover:bg-black">Withdraw</button>
            <button 
              disabled={timeLeft > 0}
              className="bg-[#1a1a1a] text-white p-4 rounded-2xl text-sm font-semibold hover:bg-black disabled:opacity-50"
            >
              {timeLeft > 0 ? `${Math.floor(timeLeft/60)}m` : "Bonus"}
            </button>
            <button className="bg-[#1a1a1a] text-white p-4 rounded-2xl text-sm font-semibold hover:bg-black">Leaders</button>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <footer className="mt-10 text-center text-sm font-medium text-gray-700">
        <p>1 USD = 280 PKR | Withdraw via Easypaisa / JazzCash / USDT</p>
      </footer>
    </div>
  );
}
