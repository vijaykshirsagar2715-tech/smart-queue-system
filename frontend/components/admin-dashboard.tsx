"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QueueTable } from "./QueueTable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  Clock, 
  Activity, 
  BarChart3, 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  Bell, 
  LogOut, 
  Search,
  PhoneForwarded,
  UserX,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ToggleLeft
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("Dashboard") // Controls which page is shown
  const [searchTerm, setSearchTerm] = useState("")
  const [queue, setQueue] = useState<any[]>([])
  const [currentToken, setCurrentToken] = useState("---")
  const [loading, setLoading] = useState(false)

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
      const beingServed = res.data.find((t: any) => t.status === 'called')
      setCurrentToken(beingServed ? beingServed.token_number : "---")
    } catch (err) {
      console.error("Error connecting to backend:", err)
    }
  }

  useEffect(() => {
    fetchLiveQueue()
    const interval = setInterval(fetchLiveQueue, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredQueue = queue.filter(
    (item) =>
      item.token_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCallNext = async () => {
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/admin/next')
      await fetchLiveQueue() 
    } catch (err) {
      alert("No users waiting in the queue!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="dark min-h-screen flex w-full bg-background">
        {/* --- SIDEBAR --- */}
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">Q</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">SmartQ</span>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
          </SidebarHeader>
          <Separator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={activeTab === item.title}
                        onClick={() => setActiveTab(item.title)}
                        className={activeTab === item.title ? "bg-primary/10 text-primary" : ""}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-400 hover:bg-red-400/10">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* --- MAIN CONTENT AREA --- */}
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-6 h-16 flex items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">{activeTab} Hub</h1>
          </header>

          <main className="p-6">
            
            {/* VIEW: DASHBOARD & QUEUE MGMT */}
            {(activeTab === "Dashboard" || activeTab === "Queue Management") && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Waiting</p>
                        <p className="text-3xl font-bold">{queue.filter(t => t.status === 'waiting').length}</p>
                      </div>
                      <Users className="h-6 w-6 text-primary" />
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-emerald/20 bg-emerald/5">
                  <CardHeader><CardTitle className="text-emerald-400 flex items-center gap-2"><PhoneForwarded className="h-5 w-5" /> Current Turn</CardTitle></CardHeader>
                  <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-emerald-400/70">Now Serving</p>
                      <div className="text-6xl font-bold text-emerald-400 tracking-tighter">{currentToken}</div>
                    </div>
                    <Button size="lg" onClick={handleCallNext} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 min-w-[200px]">
                      {loading ? "Calling..." : "Call Next Token"} <ChevronRight className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Live Queue List</CardTitle>
                    <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Token</TableHead><TableHead>Dept</TableHead><TableHead>Time</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {filteredQueue.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono font-bold text-primary">{item.token_number}</TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleTimeString()}</TableCell>
                            <TableCell className="text-right"><Badge variant={item.status === 'called' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* VIEW: ANALYTICS (Demo Data) */}
            {activeTab === "Analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">Avg. Wait Time</p> <p className="text-3xl font-bold">14m</p> </CardContent></Card>
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">Total Today</p> <p className="text-3xl font-bold">128</p> </CardContent></Card>
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">Peak Hour</p> <p className="text-3xl font-bold">11:00 AM</p> </CardContent></Card>
                </div>
                <Card className="h-64 flex items-center justify-center border-dashed"><p className="text-muted-foreground italic">Traffic Graph Visualization Loaded...</p></Card>
              </div>
            )}

            {/* VIEW: STAFF (Demo Data) */}
            {activeTab === "Staff" && (
              <Card>
                <Table>
                  <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    <TableRow><TableCell>Admin User</TableCell><TableCell>Super Admin</TableCell><TableCell><Badge className="bg-green-500">Active</Badge></TableCell></TableRow>
                    <TableRow><TableCell>Hostel Manager</TableCell><TableCell>Operator</TableCell><TableCell><Badge variant="outline">Offline</Badge></TableCell></TableRow>
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* VIEW: SETTINGS (Demo Data) */}
            {activeTab === "Settings" && (
              <div className="max-w-2xl space-y-4">
                <Card className="p-4 flex items-center justify-between"><div><p className="font-bold">Sound Notifications</p><p className="text-sm text-muted-foreground">Play a 'ding' when next token is called</p></div><ToggleLeft className="h-8 w-8 text-muted-foreground" /></Card>
                <Card className="p-4 flex items-center justify-between"><div><p className="font-bold">Auto-Complete</p><p className="text-sm text-muted-foreground">Mark tokens as done after 15 minutes</p></div><ToggleLeft className="h-8 w-8 text-primary" /></Card>
              </div>
            )}

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}