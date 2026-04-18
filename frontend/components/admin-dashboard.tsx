"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  TrendingUp
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

const queueData = [
  { id: "A-102", name: "John Doe", arrival: "10:32 AM", predictedWait: "12 mins", status: "waiting" },
  { id: "A-103", name: "Jane Smith", arrival: "10:35 AM", predictedWait: "18 mins", status: "waiting" },
  { id: "B-045", name: "Mike Johnson", arrival: "10:38 AM", predictedWait: "24 mins", status: "waiting" },
  { id: "A-104", name: "Sarah Williams", arrival: "10:42 AM", predictedWait: "30 mins", status: "waiting" },
  { id: "E-008", name: "Tom Brown", arrival: "10:45 AM", predictedWait: "8 mins", status: "priority" },
  { id: "A-105", name: "Emily Davis", arrival: "10:48 AM", predictedWait: "36 mins", status: "waiting" },
]

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Queue Management", icon: Users },
  { title: "Analytics", icon: BarChart3 },
  { title: "Staff", icon: UserCog },
  { title: "Notifications", icon: Bell },
  { title: "Settings", icon: Settings },
]

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentToken, setCurrentToken] = useState("A-101")
  
  const filteredQueue = queueData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCallNext = () => {
    // Simulate calling next token
    const nextToken = queueData[0]?.id
    if (nextToken) {
      setCurrentToken(nextToken)
    }
  }

  return (
    <SidebarProvider>
      <div className="dark min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
                <span className="text-sidebar-primary font-bold text-lg">Q</span>
              </div>
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">SmartQ</span>
                <p className="text-xs text-sidebar-foreground/60">Admin Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <Separator className="bg-sidebar-border" />
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/60">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={item.active}
                        className={`${item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'}`}
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
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-sm">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">admin@smartq.com</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="w-full justify-start text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 px-6 h-16">
              <SidebarTrigger className="text-foreground" />
              <Separator orientation="vertical" className="h-6 bg-border" />
              <h1 className="text-lg font-semibold text-foreground">Control Hub</h1>
              <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Live Queue Size</p>
                      <p className="text-3xl font-bold text-foreground">24</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald">
                    <TrendingUp className="h-3 w-3" />
                    <span>+3 in last hour</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{"Today's Total"}</p>
                      <p className="text-3xl font-bold text-foreground">156</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-chart-3" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>132 completed</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Service Time</p>
                      <p className="text-3xl font-bold text-foreground">8.5<span className="text-lg text-muted-foreground">m</span></p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-chart-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald">
                    <span>-1.2m from yesterday</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Staff Active</p>
                      <p className="text-3xl font-bold text-foreground">6<span className="text-lg text-muted-foreground">/8</span></p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-emerald" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>2 on break</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Management Center */}
            <Card className="bg-card border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-transparent to-primary/5 pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <PhoneForwarded className="h-5 w-5 text-emerald" />
                  Current Turn
                </CardTitle>
                <CardDescription>Manage the active service queue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-muted-foreground mb-1">Now Serving</p>
                    <div className="text-5xl sm:text-6xl font-bold text-emerald tracking-tight">
                      {currentToken}
                    </div>
                    <p className="text-muted-foreground mt-2">Counter 3 • General Department</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      size="lg"
                      onClick={handleCallNext}
                      className="bg-emerald hover:bg-emerald/90 text-emerald-foreground shadow-lg hover:shadow-xl hover:shadow-emerald/20 transition-all duration-300 gap-2 min-w-[180px]"
                    >
                      Call Next Token
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 gap-2"
                    >
                      <UserX className="h-5 w-5" />
                      No Show
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Queue Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-foreground">Live Queue</CardTitle>
                    <CardDescription>Real-time queue status and predictions</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or token..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Token ID</TableHead>
                        <TableHead className="text-muted-foreground">User Name</TableHead>
                        <TableHead className="text-muted-foreground">Arrival Time</TableHead>
                        <TableHead className="text-muted-foreground">Predicted Wait</TableHead>
                        <TableHead className="text-muted-foreground text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQueue.map((item, index) => (
                        <TableRow 
                          key={item.id} 
                          className={`border-border hover:bg-muted/30 transition-colors ${index === 0 ? 'bg-primary/5' : ''}`}
                        >
                          <TableCell className="font-mono font-medium text-foreground">
                            {item.id}
                          </TableCell>
                          <TableCell className="text-foreground">{item.name}</TableCell>
                          <TableCell className="text-muted-foreground">{item.arrival}</TableCell>
                          <TableCell className="text-foreground">{item.predictedWait}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="secondary"
                              className={
                                item.status === "priority"
                                  ? "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20"
                                  : index === 0
                                  ? "bg-emerald/10 text-emerald hover:bg-emerald/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }
                            >
                              {item.status === "priority" ? "Priority" : index === 0 ? "Next Up" : "Waiting"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
