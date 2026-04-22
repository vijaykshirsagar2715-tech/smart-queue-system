"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react"

interface AuthViewProps {
  onLogin: () => void
  onAdminLogin: () => void
}

export function AuthView({ onLogin, onAdminLogin }: AuthViewProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleAuthSubmit = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    localStorage.setItem("user", email);
    localStorage.setItem("token", "user-token-123"); 
    onLogin();
  }

  return (
    <div className="dark min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
      
      {/* Simple Background Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/10 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-[400px] bg-[#121212] border-white/5 shadow-xl rounded-2xl">
        
        <CardHeader className="text-center pt-8 pb-4">
          {/* Your Favorite Q Logo */}
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-2xl">Q</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">SmartQ</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to manage your tokens
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6">
              <TabsTrigger value="login" className="font-semibold">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold">Register</TabsTrigger>
            </TabsList>
            
            {/* LOGIN TAB */}
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
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 transition-all"
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
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
            
            {/* REGISTER TAB */}
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
                      className="pl-10 bg-white/5 border-white/10"
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
                      className="pl-10 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                
              </div>
              
              <Button
                onClick={handleAuthSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11"
              >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
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