"use client"

import { io } from "socket.io-client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Ticket, Clock, Users, Plus, LogOut, ChevronDown, Bell, CheckCircle2 } from "lucide-react"

interface UserDashboardProps {
  onLogout: () => void
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [userName, setUserName] = useState("User")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeToken, setActiveToken] = useState<string | null>(null)
  const [peopleAhead, setPeopleAhead] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [progress, setProgress] = useState(0)

useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on("queueUpdated", () => {
      updateQueueInfo(); // User uses updateQueueInfo
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const userSession = localStorage.getItem("user") || localStorage.getItem("token");
    if (!userSession) {
      alert("Unauthorized! Please login first.");
      onLogout();
    } else {
      const namePart = userSession.split('@')[0];
      setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, [onLogout]);

  useEffect(() => {
    const savedToken = localStorage.getItem("activeToken")
    const savedDept = localStorage.getItem("activeDept")
    if (savedToken && savedToken !== "undefined") {
      setActiveToken(savedToken)
    }
    if (savedDept) setSelectedDepartment(savedDept)
  }, [])

  const updateQueueInfo = async () => {
    const currentToken = activeToken || localStorage.getItem("activeToken")
    if (!currentToken || currentToken === "undefined") return

    try {
      const res = await axios.get(`http://localhost:5000/api/queue/status`)
      const fullQueue = res.data
      
      // 1. Find the user's exact token object
      const myTokenObj = fullQueue.find((t: any) => String(t.token_number) === String(currentToken))

      if (myTokenObj) {
        // 2. Only count people who are waiting in THIS specific department
        const myDeptWaitingList = fullQueue.filter(
          (t: any) => t.status === 'waiting' && String(t.department) === String(myTokenObj.department)
        )

        // 3. Find their position within their specific line
        const myIndex = myDeptWaitingList.findIndex((t: any) => String(t.token_number) === String(currentToken))

        if (myIndex !== -1) {
          setPeopleAhead(myIndex)
          setEstimatedTime(myIndex * 5)
          setProgress(Math.max(15, 100 - (myIndex * 10))) 
        } else if (myTokenObj.status === 'called') {
          setPeopleAhead(0)
          setEstimatedTime(0)
          setProgress(100)
        } else if (myTokenObj.status === 'completed' || myTokenObj.status === 'skipped') {
          setActiveToken(null)
          localStorage.removeItem("activeToken")
          localStorage.removeItem("activeDept")
          setPeopleAhead(0)
          setProgress(0)
        }
      } else {
        setActiveToken(null)
        localStorage.removeItem("activeToken")
        localStorage.removeItem("activeDept")
      }
    } catch (err) {
      console.error("Connection to backend failed during sync.")
    }
  }

  useEffect(() => {
    updateQueueInfo()
    const interval = setInterval(updateQueueInfo, 5000)
    return () => clearInterval(interval)
  }, [activeToken])

  const handleJoinQueue = async () => {
    if (!selectedDepartment) return alert("Please select a department")
    
    // Pass user ID
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User session lost. Please log out and back in.");

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/queue/book', {
        department: selectedDepartment,
        user_id: userId
      })
      
      const data = res.data.tokenData || res.data; 
      const newToken = data.token_number || data.tokenNumber || data.token || data.t_number || data.id?.toString();
      
      if (newToken) {
        const tokenStr = String(newToken); 
        setActiveToken(tokenStr);
        localStorage.setItem("activeToken", tokenStr);
        localStorage.setItem("activeDept", selectedDepartment);
        setDialogOpen(false);
        updateQueueInfo();
      }
    } catch (err: any) {
      alert("Backend Error: " + (err.response?.data?.message || "Server offline"));
    } finally {
      setLoading(false);
    }
  }

  const displayToken = (activeToken && activeToken !== "undefined") ? activeToken : "---"
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">SmartQ</span>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 rounded-full">
                <Bell className="h-5 w-5" />
             </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-1 pr-3 gap-2 hover:bg-slate-100 rounded-full h-10 border border-transparent hover:border-slate-200 transition-all">
                  <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px]">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-semibold text-sm">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-2xl border-slate-200">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl cursor-pointer py-2.5 px-3">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        
        <section className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Hello, {userName}! 👋</h2>
            <p className="text-slate-500 font-medium">Your time is valuable. Track your place in line in real-time.</p>
        </section>

        <Card className="border-0 shadow-[0_20px_50px_rgba(79,70,229,0.1)] bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
             <Badge className={`px-4 py-1.5 rounded-full border-none font-bold tracking-wide ${activeToken ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
               {activeToken ? '● LIVE STATUS' : 'NO ACTIVE TICKET'}
             </Badge>
          </div>
          
          <CardContent className="p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                        <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-2">Current Position Number</p>
                        <h1 className="text-8xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
                            {displayToken}
                        </h1>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="px-3 py-1 bg-indigo-50 rounded-lg">
                                <span className="text-xs font-bold text-indigo-700 uppercase">{selectedDepartment || "N/A"}</span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">Department</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activeToken ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Joined</span>
                    </div>
                    <div className={`h-[2px] flex-1 mx-2 ${peopleAhead > 1 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                    <div className="flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${peopleAhead > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                            <Users className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Waiting</span>
                    </div>
                    <div className={`h-[2px] flex-1 mx-2 ${peopleAhead === 0 && activeToken ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                    <div className="flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${peopleAhead === 0 && activeToken ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                            <Bell className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Next Up</span>
                    </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="relative h-56 w-56">
                  <svg className="h-full w-full -rotate-90 filter drop-shadow-md" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="44" fill="none" stroke="url(#gradient)" strokeWidth="8" 
                      strokeLinecap="round" strokeDasharray={`${progress * 2.76} 276`} 
                      className="transition-all duration-1000 ease-in-out" 
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#9333ea" />
                        </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{activeToken ? progress : 0}%</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready Status</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{activeToken ? peopleAhead : "0"}</p>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">Ahead of You</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                      <Clock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{activeToken ? estimatedTime : "0"}</p>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">Minutes Left</p>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={!!activeToken && activeToken !== "undefined"} 
                className="group h-16 px-12 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-500/40 border-0 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
              >
                <div className="mr-3 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                    <Plus className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">
                    {activeToken ? "You're Already in Line" : "Book New Token"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-0 p-8 shadow-2xl">
              <DialogHeader className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Plus className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                    <DialogTitle className="text-3xl font-black tracking-tight">Select Department</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">Choose where you need assistance today.</DialogDescription>
                </div>
              </DialogHeader>
              <div className="space-y-6 pt-6">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-indigo-500 font-semibold px-6">
                    <SelectValue placeholder="Where to go?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                    <SelectItem value="general" className="rounded-xl py-3 px-4">General Consultation</SelectItem>
                    <SelectItem value="billing" className="rounded-xl py-3 px-4">Billing & Payments</SelectItem>
                    <SelectItem value="emergency" className="rounded-xl py-3 px-4 text-red-600">Emergency Services</SelectItem>
                    <SelectItem value="lab" className="rounded-xl py-3 px-4">Laboratory / Testing</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all" 
                  disabled={!selectedDepartment || loading} 
                  onClick={handleJoinQueue}
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Powered by SmartQ Real-Time Engine</p>
        </div>
      </main>
    </div>
  )
}