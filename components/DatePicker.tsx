"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { selectedDateAtom } from "@/state/RecoilState"
import { useRecoilState } from "recoil"

interface DatePickerProps {
    onDateChange: (date: Date) => void;
  }

export default function DatePicker({ onDateChange }: DatePickerProps) {
    const [selectedDate, setSelectedDate] = useRecoilState(selectedDateAtom);

    function handleSelect(date: Date | undefined) {
        if (date) {
          setSelectedDate(date);
          onDateChange(date);
        }
      }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
