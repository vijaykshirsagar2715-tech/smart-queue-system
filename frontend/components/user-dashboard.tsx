"use client"

import { useState } from "react"
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

const pastVisits = [
  { id: "A-098", department: "General", date: "Apr 15, 2026", status: "completed" },
  { id: "B-045", department: "Billing", date: "Apr 10, 2026", status: "completed" },
  { id: "A-087", department: "General", date: "Apr 5, 2026", status: "cancelled" },
  { id: "E-012", department: "Emergency", date: "Mar 28, 2026", status: "completed" },
]

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Mock data
  const currentToken = "A-102"
  const peopleAhead = 7
  const estimatedTime = 15
  const progress = 65

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-foreground">SmartQ</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">JD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-foreground">John Doe</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Active Token Card */}
        <Card className="bg-card border-border shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald/5 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Your Active Token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Token Display */}
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <div className="text-6xl sm:text-7xl font-bold text-primary tracking-tight">
                  {currentToken}
                </div>
                <p className="text-muted-foreground mt-2">Department: General</p>
              </div>
              
              {/* Circular Progress */}
              <div className="relative">
                <svg className="w-32 h-32 sm:w-40 sm:h-40 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.64} 264`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">{progress}%</span>
                  <span className="text-xs text-muted-foreground">Wait Progress</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex lg:flex-col gap-4 lg:gap-6">
                <Card className="bg-muted/50 border-border/50 min-w-[140px]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{peopleAhead}</p>
                      <p className="text-xs text-muted-foreground">People Ahead</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border/50 min-w-[140px]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-emerald" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{estimatedTime}</p>
                      <p className="text-xs text-muted-foreground">Est. Time (Mins)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get New Token */}
        <div className="flex justify-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 gap-2">
                <Plus className="h-5 w-5" />
                Get New Token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request a New Token</DialogTitle>
                <DialogDescription>
                  Select a department to join the queue
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={!selectedDepartment}
                  onClick={() => setDialogOpen(false)}
                >
                  Join Queue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Past Visits */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <History className="h-5 w-5" />
              My Past Visits
            </CardTitle>
            <CardDescription>Your recent queue history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Token ID</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastVisits.map((visit) => (
                  <TableRow key={visit.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{visit.id}</TableCell>
                    <TableCell className="text-foreground">{visit.department}</TableCell>
                    <TableCell className="text-muted-foreground">{visit.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={visit.status === "completed" ? "default" : "secondary"}
                        className={
                          visit.status === "completed"
                            ? "bg-emerald/10 text-emerald hover:bg-emerald/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }
                      >
                        {visit.status === "completed" ? "Completed" : "Cancelled"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
