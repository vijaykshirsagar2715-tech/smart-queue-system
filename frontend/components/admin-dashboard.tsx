"use client"

import { io } from "socket.io-client"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
// NEW: Imported Select components for the department dropdown
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, BarChart3, LayoutDashboard, UserCog, Settings, 
  Bell, LogOut, Search, ChevronRight, Clock, 
  CheckCircle2, Activity, Zap, ShieldCheck, Trash2,
  TrendingUp, Monitor
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [queue, setQueue] = useState<any[]>([])
  const [currentToken, setCurrentToken] = useState("---")
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  
  // NEW: State to track which department this specific admin is managing
  const [adminDepartment, setAdminDepartment] = useState("general")
   
useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on("queueUpdated", () => {
      fetchLiveQueue(); // Admin uses fetchLiveQueue
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Queue Management", icon: Users },
    { title: "Analytics", icon: BarChart3 },
    { title: "Staff", icon: UserCog },
    { title: "Notifications", icon: Bell },
    { title: "Settings", icon: Settings },
  ]

  const fetchLiveQueue = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queue/status')
      setQueue(res.data)
      
      // LOGIC FIX: Only show the "Currently Serving" token for the active department
      const beingServed = res.data.find((t: any) => t.status === 'called' && String(t.department) === adminDepartment)
      setCurrentToken(beingServed ? beingServed.token_number : "---")
    } catch (err) {
      console.error("Backend offline")
    }
  }

  // Refetch the queue whenever the admin switches their active department
  useEffect(() => {
    fetchLiveQueue()
  }, [adminDepartment])

  useEffect(() => {
    fetchLiveQueue()
    const interval = setInterval(fetchLiveQueue, 5000)
    return () => clearInterval(interval)
  }, [])

  const analytics = useMemo(() => {
    const waiting = queue.filter(t => t.status === 'waiting').length
    const completed = queue.filter(t => t.status === 'completed' || t.status === 'called').length
    
    // Calculates wait time based on the longest departmental line
    const deptCounts: Record<string, number> = {}
    queue.forEach(t => {
      if (t.status === 'waiting') {
        deptCounts[t.department] = (deptCounts[t.department] || 0) + 1
      }
    })
    
    const maxLine = Object.values(deptCounts).length > 0 ? Math.max(...Object.values(deptCounts)) : 0
    return { waiting, completed, avgWait: maxLine * 5 }
  }, [queue])

  const handleCallNext = async () => {
    setLoading(true)
    try {
      // LOGIC FIX: Send the currently selected department to the backend
      await axios.post('http://localhost:5000/api/admin/next', {
        department: adminDepartment
      })
      if (notifications) { new Audio('/ding.mp3').play().catch(() => {}); }
      await fetchLiveQueue() 
    } catch (err) {
      alert("Queue for this department is empty or backend error")
    } finally {
      setLoading(false)
    }
  }

  const filteredQueue = queue.filter(
    (item) =>
      String(item.token_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.department || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="dark min-h-screen flex w-full bg-[#09090b] text-slate-200 selection:bg-indigo-500/30">
        
        <Sidebar className="border-r border-white/5 bg-[#09090b]/50 backdrop-blur-xl">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">SmartQ</span>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Admin Control</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 text-[10px] font-bold uppercase px-4 mb-2">Main Terminal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="mb-1">
                      <SidebarMenuButton 
                        isActive={activeTab === item.title}
                        onClick={() => setActiveTab(item.title)}
                        className={`h-11 rounded-lg px-4 transition-all duration-200 ${
                          activeTab === item.title 
                          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                          : "hover:bg-white/5 text-slate-400"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${activeTab === item.title ? "text-indigo-400" : ""}`} />
                        <span className="font-semibold text-sm">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-6">
            <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl group transition-all">
              <LogOut className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              <span className="font-bold text-sm">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 bg-transparent">
          <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-400 hover:text-white" />
              <Separator orientation="vertical" className="h-6 bg-white/10" />
              <h1 className="text-lg font-bold tracking-tight text-white">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Connection: Optimal</span>
            </div>
          </header>

          <main className="p-8 max-w-[1600px] mx-auto w-full">
            
            {activeTab === "Dashboard" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Waiting", val: analytics.waiting, icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                    { label: "Completed", val: analytics.completed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Est. Wait Time", val: `${analytics.avgWait}m`, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10" }
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
                        </div>
                        <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`h-7 w-7 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent rounded-[2.5rem] overflow-hidden shadow-2xl">
                  {/* LOGIC FIX: Added the Department Selector directly into the Header of the controller */}
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <Activity className="h-4 w-4" /> Real-Time Controller
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline-block">Active Counter:</span>
                      <Select value={adminDepartment} onValueChange={setAdminDepartment}>
                        <SelectTrigger className="w-[180px] h-9 bg-white/5 border-white/10 text-xs font-bold rounded-lg text-slate-200">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121212] border-white/10 text-slate-200 rounded-xl">
                           <SelectItem value="general" className="rounded-xl py-3 px-4">General Consultation</SelectItem>
                    <SelectItem value="billing" className="rounded-xl py-3 px-4">Billing & Payments</SelectItem>
                    <SelectItem value="emergency" className="rounded-xl py-3 px-4 text-red-600">Emergency Services</SelectItem>
                    <SelectItem value="lab" className="rounded-xl py-3 px-4">Laboratory / Testing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="text-center lg:text-left">
                      <p className="text-sm font-bold text-slate-500 uppercase mb-2">Currently Serving</p>
                      <div className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        {currentToken}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <Button 
                            onClick={handleCallNext} 
                            disabled={loading} 
                            className="bg-indigo-600 hover:bg-indigo-500 h-24 px-12 rounded-3xl text-2xl font-black shadow-2xl shadow-indigo-500/20 group transition-all active:scale-95"
                        >
                            {loading ? "PROCESSING..." : "CALL NEXT"} 
                            <ChevronRight className="ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "Queue Management" && (
              <Card className="bg-white/[0.02] border-white/5 rounded-3xl animate-in fade-in duration-500">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8">
                  <div>
                    <CardTitle className="text-2xl font-black text-white">Queue Registry</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Live logs of every generated token.</CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search ID or Dept..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="pl-11 h-12 bg-white/5 border-white/5 rounded-xl" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="rounded-2xl border border-white/5 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-black uppercase text-slate-500">Token ID</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-500">Department</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQueue.map((item) => (
                          <TableRow key={item.token_number} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                            <TableCell className="font-mono font-black text-indigo-400 py-5">{item.token_number}</TableCell>
                            <TableCell className="capitalize font-bold text-slate-300">{item.department}</TableCell>
                            <TableCell className="text-right">
                              <Badge className={`rounded-lg px-3 py-1 border-0 font-bold ${
                                item.status === 'called' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {item.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "Analytics" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/[0.02] border-white/5 p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-xl">Peak Hours</h3>
                      <TrendingUp className="text-emerald-500" />
                    </div>
                    <div className="h-48 flex items-end gap-2 px-2">
                       {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
                         <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span>
                    </div>
                  </Card>
                  <Card className="bg-white/[0.02] border-white/5 p-8 rounded-3xl">
                    <h3 className="font-bold text-xl mb-6">Department Distribution</h3>
                    <div className="space-y-4">
                      {['Billing', 'Support', 'Pharmacy'].map((dept, i) => (
                        <div key={dept} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span>{dept}</span>
                            <span>{85 - (i * 20)}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${85 - (i * 20)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "Staff" && (
              <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden animate-in fade-in duration-500">
                <CardHeader className="p-8 border-b border-white/5">
                  <CardTitle className="text-2xl font-black">Staff Directory</CardTitle>
                  <CardDescription>Manage active terminal operators.</CardDescription>
                </CardHeader>
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5"><TableHead>Operator</TableHead><TableHead>Terminal</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Vijay Kshirsagar", term: "Counter 01", status: "Online" },
                      { name: "Siddharth Gawari", term: "Counter 02", status: "Break" },
                      { name: "Hemant Patil", term: "Front Desk", status: "Offline" }
                    ].map((staff) => (
                      <TableRow key={staff.name} className="border-white/5">
                        <TableCell className="font-bold py-4">{staff.name}</TableCell>
                        <TableCell className="text-slate-400 font-medium">{staff.term}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={staff.status === "Online" ? "bg-emerald-500/20 text-emerald-500 border-0" : "bg-white/5 text-slate-500 border-0"}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {activeTab === "Notifications" && (
              <div className="max-w-2xl space-y-4 animate-in fade-in duration-500">
                {[
                  { title: "Audio Chime", desc: "Play 'ding.mp3' when calling next token", state: notifications, set: setNotifications },
                  { title: "Push Alerts", desc: "Notify staff when waiting queue > 10", state: true },
                  { title: "Customer SMS", desc: "Send SMS when customer's turn is near", state: false }
                ].map((item, i) => (
                  <Card key={i} className="bg-white/[0.02] border-white/5 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <Switch checked={item.state} onCheckedChange={item.set} />
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-500">
                <Card className="bg-white/[0.02] border-white/5 p-8 rounded-3xl">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Monitor className="h-5 w-5 text-indigo-500" /> Terminal Config</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Terminal Name</label>
                      <Input className="bg-white/5 border-white/5" defaultValue="Main-Terminal-Alpha" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Auto-Refresh (sec)</label>
                      <Input className="bg-white/5 border-white/5" defaultValue="5" />
                    </div>
                  </div>
                  <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 w-full rounded-xl font-bold">Update System</Button>
                </Card>

                <Card className="bg-red-500/5 border-red-500/10 p-8 rounded-3xl">
                  <h3 className="font-bold text-xl text-red-500 mb-2 flex items-center gap-2"><Trash2 className="h-5 w-5" /> Danger Zone</h3>
                  <p className="text-sm text-slate-500 mb-4">Resetting the daily queue will clear all history for today.</p>
                  <Button variant="destructive" className="rounded-xl font-bold px-8">Reset Daily Queue</Button>
                </Card>
              </div>
            )}

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}