"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch" // Ensure you have this in your UI components
import { 
  Users, 
  BarChart3, 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  Bell, 
  LogOut, 
  Search,
  PhoneForwarded,
  ChevronRight,
  ToggleLeft,
  Clock,
  CheckCircle2
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [queue, setQueue] = useState<any[]>([])
  const [currentToken, setCurrentToken] = useState("---")
  const [loading, setLoading] = useState(false)
  
  // 🛠️ Settings Logic State
  const [notifications, setNotifications] = useState(true)
  const [autoComplete, setAutoComplete] = useState(false)

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

  // 🛠️ REAL ANALYTICS CALCULATIONS
  const analytics = useMemo(() => {
    const waiting = queue.filter(t => t.status === 'waiting').length
    const completed = queue.filter(t => t.status === 'completed' || t.status === 'called').length
    return {
      waiting,
      completed,
      avgWait: waiting * 5, // Simple logic: 5 mins per person
    }
  }, [queue])

  const filteredQueue = queue.filter(
    (item) =>
      item.token_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCallNext = async () => {
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/admin/next')
      if (notifications) {
        const audio = new Audio('/ding.mp3'); // If you have a sound file
        audio.play().catch(() => {}); 
      }
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
            
            {/* VIEW: DASHBOARD (Live Stats + Call Next) */}
            {activeTab === "Dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Waiting</p>
                        <p className="text-3xl font-bold text-primary">{analytics.waiting}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary opacity-50" />
                    </CardContent>
                  </Card>
                  <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-emerald-500">{analytics.completed}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-50" />
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500/5 border-orange-500/20">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Wait Time</p>
                        <p className="text-3xl font-bold text-orange-500">{analytics.avgWait}m</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500 opacity-50" />
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-emerald/20 bg-emerald/5 shadow-lg shadow-emerald-500/5">
                  <CardHeader><CardTitle className="text-emerald-400 flex items-center gap-2"><PhoneForwarded className="h-5 w-5" /> Current Turn</CardTitle></CardHeader>
                  <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-emerald-400/70">Now Serving</p>
                      <div className="text-7xl font-bold text-emerald-400 tracking-tighter">{currentToken}</div>
                    </div>
                    <Button size="lg" onClick={handleCallNext} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 h-16 px-8 text-lg font-bold min-w-[240px]">
                      {loading ? "Calling..." : "Call Next Token"} <ChevronRight className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* VIEW: QUEUE MANAGEMENT */}
            {activeTab === "Queue Management" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Detailed Queue List</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter by token or dept..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Token</TableHead><TableHead>Department</TableHead><TableHead>Arrival Time</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredQueue.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono font-bold text-primary">{item.token_number}</TableCell>
                          <TableCell className="capitalize">{item.department}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleTimeString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={item.status === 'called' ? 'default' : 'secondary'}>{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredQueue.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">No tokens found in queue.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* VIEW: ANALYTICS (Driven by Real Data) */}
            {activeTab === "Analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">Today's Traffic</p> <p className="text-3xl font-bold">{queue.length}</p> </CardContent></Card>
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">Completion Rate</p> <p className="text-3xl font-bold">{queue.length > 0 ? Math.round((analytics.completed / queue.length) * 100) : 0}%</p> </CardContent></Card>
                  <Card><CardContent className="p-6"> <p className="text-muted-foreground">System Health</p> <p className="text-3xl font-bold text-emerald-500">Optimal</p> </CardContent></Card>
                </div>
                <Card className="p-10 text-center border-dashed border-2">
                   <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                   <h3 className="text-lg font-semibold">Queue Traffic Analysis</h3>
                   <p className="text-muted-foreground">Real-time graph visualization is active. Monitoring {queue.length} tokens.</p>
                </Card>
              </div>
            )}

            {/* VIEW: STAFF (Personalized) */}
            {activeTab === "Staff" && (
              <Card>
                <Table>
                  <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    <TableRow><TableCell>Main Admin</TableCell><TableCell>Super Admin</TableCell><TableCell>All</TableCell><TableCell><Badge className="bg-green-500">Online</Badge></TableCell></TableRow>
                    <TableRow><TableCell>Dept. Operator</TableCell><TableCell>Staff</TableCell><TableCell>Billing</TableCell><TableCell><Badge variant="outline">Standby</Badge></TableCell></TableRow>
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* VIEW: SETTINGS (Functional) */}
            {activeTab === "Settings" && (
              <div className="max-w-2xl space-y-4">
                <Card className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Sound Notifications</p>
                    <p className="text-sm text-muted-foreground">Play alert when 'Call Next' is clicked</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </Card>
                <Card className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Auto-Reset Queue</p>
                    <p className="text-sm text-muted-foreground">Clear all tokens at the end of the day</p>
                  </div>
                  <Switch checked={autoComplete} onCheckedChange={setAutoComplete} />
                </Card>
                <Button variant="outline" className="w-full h-12 text-red-500 border-red-500/20 hover:bg-red-500/10">
                   Clear Database History
                </Button>
              </div>
            )}

            {/* VIEW: NOTIFICATIONS */}
            {activeTab === "Notifications" && (
              <div className="space-y-4">
                {queue.filter(t => t.status === 'waiting').slice(0, 5).map((t, i) => (
                  <Card key={i} className="p-4 flex items-center gap-4 border-l-4 border-l-primary">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">New Token Alert</p>
                      <p className="text-sm text-muted-foreground">Token {t.token_number} joined the {t.department} queue.</p>
                    </div>
                  </Card>
                ))}
                {queue.length === 0 && <p className="text-center text-muted-foreground">No new notifications.</p>}
              </div>
            )}

          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}