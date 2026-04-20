"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function QueueTable() {
  const [tokens, setTokens] = useState([])

  const fetchTokens = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queue/status')
      setTokens(res.data)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  // Handle "Call Next" action
  const handleCall = async (tokenId: number) => {
    try {
      // You'll need this endpoint in your controller later
      await axios.put(`http://localhost:5000/api/queue/call/${tokenId}`)
      fetchTokens() // Refresh list
    } catch (err) {
      alert("Error calling token")
    }
  }

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token No</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token: any) => (
            <TableRow key={token.id}>
              <TableCell className="font-bold text-primary">{token.token_number}</TableCell>
              <TableCell className="capitalize">{token.department}</TableCell>
              <TableCell>
                <Badge variant={token.status === "called" ? "default" : "secondary"}>
                  {token.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {token.status === "waiting" && (
                  <Button size="sm" onClick={() => handleCall(token.id)}>
                    Call Next
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}