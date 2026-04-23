"use client"

import { useState } from "react"
import axios from "axios" // Added axios for backend communication
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, ArrowRight, ShieldCheck, Loader2 } from "lucide-react"

interface AuthViewProps {
  onLogin: () => void
  onAdminLogin: () => void
}

export function AuthView({ onLogin, onAdminLogin }: AuthViewProps) {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState("login") // Track which tab is open
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false) // For button loading states

  // --- Real Backend Integration ---
  const handleAuthSubmit = async () => {
    if (!email) return alert("Please enter your email.")
    if (!password) return alert("Please enter your password.")

    setLoading(true)

    try {
      if (activeTab === "signup") {
        // --- 1. REGISTRATION LOGIC ---
        if (!name) {
          setLoading(false)
          return alert("Please enter your full name.")
        }
        
        await axios.post("http://localhost:5000/api/users/register", {
          full_name: name,
          email: email,
          password: password 
        })
        
        alert("Account created successfully! You can now log in.")
        setPassword("") // Clear password for security
        setActiveTab("login") // Automatically switch to the login tab
        
      } else {
        // --- 2. LOGIN LOGIC ---
        const res = await axios.post("http://localhost:5000/api/users/login", {
          email: email,
          password: password
        })

        const userData = res.data.user
        
        // Save the real database data to the browser
        localStorage.setItem("user", userData.email)
        localStorage.setItem("userId", userData.id) 
        localStorage.setItem("token", "active-session") 
        
        onLogin() // Trigger the dashboard view
      }
    } catch (error: any) {
      // Catch backend errors (e.g., "Invalid credentials" or "Email already exists")
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Connection to server failed."
      alert("Error: " + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
      
      {/* Simple Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/10 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-[400px] bg-[#121212] border-white/5 shadow-xl rounded-2xl relative z-10">
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-2xl">Q</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">SmartQ</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to manage your tokens
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {/* Added state binding to Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
              <TabsTrigger value="login" className="font-semibold">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold">Register</TabsTrigger>
            </TabsList>
            
            {/* --- LOGIN TAB --- */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-white/20"
                  />
                  <Label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              
              <Button
                onClick={handleAuthSubmit}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
              
              <div className="flex items-center gap-3 py-2">
                <div className="h-[1px] w-full bg-white/5" />
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest whitespace-nowrap">Admin Only</span>
                <div className="h-[1px] w-full bg-white/5" />
              </div>
              
              <Button
                variant="outline"
                onClick={onAdminLogin}
                className="w-full border-white/10 bg-transparent hover:bg-white/5 text-slate-300 h-11"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                Admin Terminal
              </Button>
            </TabsContent>
            
            {/* --- REGISTER TAB --- */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                    />
                  </div>
                </div>
                
                {/* NEW: Added Password field to Registration */}
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400 ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                    />
                  </div>
                </div>
                
              </div>
              
              <Button
                onClick={handleAuthSubmit}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <p className="absolute bottom-6 text-[10px] text-slate-600 font-medium">
        Smart Queue Management System &copy; 2026
      </p>
    </div>
  )
}