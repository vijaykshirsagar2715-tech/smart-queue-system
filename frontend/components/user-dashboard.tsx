"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ticket, Clock, Users, Plus, LogOut, User, Settings, History, ChevronDown } from "lucide-react"

interface UserDashboardProps {
  onLogout: () => void
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  // 🟢 1. STATE MANAGEMENT
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // These states handle the live UI updates
  const [activeToken, setActiveToken] = useState<string | null>(null)
  const [peopleAhead, setPeopleAhead] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [progress, setProgress] = useState(0)

  // 🔵 2. SYNC LOGIC (Runs on Load & Every 5 Seconds)
  const updateQueueInfo = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queue/status')
      const fullQueue = res.data
      
      // If we have a token stored, find its position in the queue
      const currentStoredToken = activeToken || localStorage.getItem("activeToken")
      
      if (currentStoredToken) {
        const waitingList = fullQueue.filter((t: any) => t.status === 'waiting')
        const myIndex = waitingList.findIndex((t: any) => t.token_number === currentStoredToken)
        
        if (myIndex !== -1) {
          setPeopleAhead(myIndex)
          setEstimatedTime(myIndex * 5)
          setProgress(Math.max(15, 100 - (myIndex * 10))) 
        } else {
          // Check if token is being served (status 'called')
          const isCalled = fullQueue.find((t: any) => t.token_number === currentStoredToken && t.status === 'called')
          if (isCalled) {
            setPeopleAhead(0)
            setEstimatedTime(0)
            setProgress(100)
          }
        }
      }
    } catch (err) {
      console.error("Sync Error:", err)
    }
  }

  useEffect(() => {
    // Restore session from localStorage if user refreshes
    const savedToken = localStorage.getItem("activeToken")
    const savedDept = localStorage.getItem("activeDept")
    if (savedToken) setActiveToken(savedToken)
    if (savedDept) setSelectedDepartment(savedDept)
    
    updateQueueInfo()
    const interval = setInterval(updateQueueInfo, 5000)
    return () => clearInterval(interval)
  }, [activeToken])

  // 🔴 3. BOOKING LOGIC
  const handleJoinQueue = async () => {
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/queue/book', {
        department: selectedDepartment
      })

      // 🛠️ DATA-FIX: Check multiple possible key names from backend
      const newToken = res.data?.token_number || res.data?.tokenNumber || res.data?.data?.token_number

      if (newToken) {
        setActiveToken(newToken)
        localStorage.setItem("activeToken", newToken)
        localStorage.setItem("activeDept", selectedDepartment)
        setDialogOpen(false)
      } else {
        alert("Success, but could not read Token ID. Check Backend JSON keys!")
      }
    } catch (err) {
      alert("Backend Error! Ensure your server and database are running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">Q</div>
            <span className="text-xl font-bold text-zinc-900">SmartQ</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-zinc-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">JD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">John Doe</span>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Active Token Card */}
        <Card className="border-none shadow-xl shadow-indigo-500/5 bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider font-semibold text-xs">
              <Ticket className="h-4 w-4 text-indigo-600" /> 
              Current Queue Status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              {/* Token Number - 🛠️ FIXED: Never shows "undefined" */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-7xl sm:text-8xl font-black text-indigo-600 tracking-tighter">
                  {activeToken ? activeToken : "---"}
                </h1>
                <Badge variant="secondary" className="mt-4 px-4 py-1 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none capitalize">
                   {selectedDepartment ? `Dept: ${selectedDepartment}` : "No Active Request"}
                </Badge>
              </div>
              
              {/* Animated Progress Circle */}
              <div className="relative h-44 w-44">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="#4f46e5" strokeWidth="8" 
                    strokeLinecap="round" strokeDasharray={`${progress * 2.64} 264`} 
                    className="transition-all duration-1000 ease-in-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-zinc-900">{activeToken ? progress : 0}%</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Wait Progress</span>
                </div>
              </div>

              {/* Real-time Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 w-full lg:w-48">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-zinc-900">{activeToken ? peopleAhead : "0"}</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">People Ahead</p>
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-zinc-900">{activeToken ? estimatedTime : "0"}</p>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Est. Mins</p>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={!!activeToken} 
                size="lg" 
                className="h-14 px-10 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 transition-all active:scale-95"
              >
                <Plus className="mr-2 h-6 w-6" /> 
                {activeToken ? "You are in the queue" : "Generate New Token"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Booking</DialogTitle>
                <DialogDescription>Select the department you wish to visit.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-12 border-zinc-200">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Consultation</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="emergency">Emergency Services</SelectItem>
                    <SelectItem value="lab">Laboratory / Testing</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full h-12 bg-indigo-600 text-lg font-semibold rounded-xl" 
                  disabled={!selectedDepartment || loading} 
                  onClick={handleJoinQueue}
                >
                  {loading ? "Generating..." : "Confirm & Get Token"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      </main>
    </div>
  )
}