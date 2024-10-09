"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format, addHours, parse, isAfter } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

type ProgressEntry = {
  date: string
  entries: { [key: string]: string }
}

export default function ProgressTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [entries, setEntries] = useState<{ [key: string]: string }>({})
  const [allEntries, setAllEntries] = useState<ProgressEntry[]>([])
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const slots = generateTimeSlots(startTime, endTime)
    setTimeSlots(slots)
    setEntries({})
  }, [startTime, endTime])

  useEffect(() => {
    const savedEntries = localStorage.getItem('progressEntries')
    if (savedEntries) {
      setAllEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    const currentDateEntry = allEntries.find(entry => entry.date === format(selectedDate, 'yyyy-MM-dd'))
    if (currentDateEntry) {
      setEntries(currentDateEntry.entries)
    } else {
      setEntries({})
    }
  }, [selectedDate, allEntries])

  const generateTimeSlots = (start: string, end: string) => {
    const slots = []
    let currentTime = parse(start, 'HH:mm', new Date())
    const endTime = parse(end, 'HH:mm', new Date())

    while (!isAfter(currentTime, endTime)) {
      slots.push(format(currentTime, 'HH:mm'))
      currentTime = addHours(currentTime, 1)
    }

    return slots
  }

  const handleEntryChange = (time: string, value: string) => {
    setEntries(prev => ({ ...prev, [time]: value }))
  }

  const saveEntries = () => {
    const updatedEntries = allEntries.filter(entry => entry.date !== format(selectedDate, 'yyyy-MM-dd'))
    updatedEntries.push({
      date: format(selectedDate, 'yyyy-MM-dd'),
      entries: entries
    })
    setAllEntries(updatedEntries)
    localStorage.setItem('progressEntries', JSON.stringify(updatedEntries))
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved successfully.",
    })
  }

  const generateTimeOptions = () => {
    const options = []
    for (let i = 0; i < 24; i++) {
      const timeValue = `${i.toString().padStart(2, '0')}:00`
      options.push(
        <SelectItem key={i} value={timeValue}>
          {format(parse(timeValue, 'HH:mm', new Date()), 'h:mm a')}
        </SelectItem>
      )
    }
    return options
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date and Time Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border mb-4"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Start Time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions()}
              </SelectContent>
            </Select>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="End Time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions()}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hourly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Time</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((time) => (
                  <TableRow key={time}>
                    <TableCell className="whitespace-nowrap">{format(parse(time, 'HH:mm', new Date()), 'h:mm a')}</TableCell>
                    <TableCell>
                      <Input
                        value={entries[time] || ''}
                        onChange={(e) => handleEntryChange(time, e.target.value)}
                        placeholder="Enter your progress"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={saveEntries} className="mt-4 w-full sm:w-auto">Save Progress</Button>
        </CardContent>
      </Card>
    </div>
  )
}