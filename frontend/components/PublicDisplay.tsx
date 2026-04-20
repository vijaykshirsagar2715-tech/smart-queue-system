"use client"
import { useState, useEffect } from "react"
import axios from "axios"

// 🛠️ FIX 1: Define the structure so TypeScript doesn't say "never"
interface Token {
  id: number;
  token_number: string;
  department: string;
  status: string;
}

export default function PublicDisplay() {
  // 🛠️ FIX 2: Tell the state to expect an array of Tokens
  const [tokens, setTokens] = useState<Token[]>([])

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queue/status')
      // 🛠️ FIX 3: Filter for 'called' tokens so we show who is being served
      const called = res.data.filter((t: Token) => t.status === 'called').slice(0, 5)
      setTokens(called)
    } catch (err) { 
      console.error("Display Fetch Error:", err) 
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000) 
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-10 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-indigo-500">LIVE QUEUE</h1>
          <p className="text-zinc-500 font-bold tracking-[0.3em] uppercase mt-2">SmartQ Hospital Systems</p>
        </div>
        <div className="text-right bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Current Time</p>
          <p className="text-2xl font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: BIG MAIN TOKEN */}
        <div className="bg-zinc-900 rounded-[2rem] p-12 flex flex-col items-center justify-center border-2 border-indigo-600 shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)]">
          <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6 animate-bounce">
            Now Serving
          </div>
          <p className="text-[14rem] leading-none font-black text-white tracking-tighter">
            {tokens[0]?.token_number || "---"}
          </p>
          <div className="mt-8 flex items-center gap-4">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-3xl text-zinc-400 font-medium uppercase tracking-widest">
               Proceed to Counter {(tokens[0]?.id ? (tokens[0].id % 5) + 1 : "1")}
             </p>
          </div>
        </div>

        {/* Right Side: HISTORY LIST */}
        <div className="flex flex-col gap-6">
          <p className="text-zinc-500 text-sm font-black uppercase tracking-widest ml-2">Recent Calls</p>
          
          {tokens.slice(1, 4).map((t) => (
            <div key={t.id} className="flex justify-between items-center bg-zinc-900/40 p-8 rounded-[1.5rem] border border-zinc-800/50 backdrop-blur-sm">
              <span className="text-6xl font-bold text-zinc-200">{t.token_number}</span>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase">Counter</p>
                <p className="text-3xl font-bold text-indigo-400">{(t.id % 5) + 1}</p>
              </div>
            </div>
          ))}

          {tokens.length <= 1 && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-[1.5rem]">
              <p className="text-zinc-700 text-xl font-medium">No other tokens called yet...</p>
            </div>
          )}
        </div>
      </div>

      {/* Scrolling Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-indigo-600 py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-20 items-center">
          <p className="text-white font-bold text-lg">📢 PLEASE MAINTAIN SILENCE IN THE WAITING AREA</p>
          <p className="text-white font-bold text-lg">📢 CHECK YOUR MOBILE APP FOR REAL-TIME UPDATES</p>
          <p className="text-white font-bold text-lg">📢 PLEASE MAINTAIN SILENCE IN THE WAITING AREA</p>
        </div>
      </div>
    </div>
  )
}