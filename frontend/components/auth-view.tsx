"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Mail, Lock, User, ArrowRight } from "lucide-react"

interface AuthViewProps {
  onLogin: () => void
  onAdminLogin: () => void
}

export function AuthView({ onLogin, onAdminLogin }: AuthViewProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="dark min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Glassmorphic Card */}
      <Card className="relative w-full max-w-md bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-foreground">SmartQ</span>
          </div>
          <CardTitle className="text-xl text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your queue dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-foreground">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel className="text-foreground">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
              </FieldGroup>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              
              <Button
                onClick={onLogin}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card/40 px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={onAdminLogin}
                className="w-full border-border/50 bg-transparent hover:bg-accent/50 text-foreground"
              >
                Sign in as Admin
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-foreground">Full Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel className="text-foreground">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel className="text-foreground">Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
              </FieldGroup>
              
              <Button
                onClick={onLogin}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <button className="text-primary hover:underline">Terms of Service</button>
                {" "}and{" "}
                <button className="text-primary hover:underline">Privacy Policy</button>
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
