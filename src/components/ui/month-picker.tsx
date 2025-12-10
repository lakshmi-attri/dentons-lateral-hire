"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthPicker({
  value,
  onChange,
  placeholder = "Pick a month",
  disabled = false,
  className,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<string>(
    value ? value.split("-")[0] : new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    value ? value.split("-")[1] : ""
  );

  React.useEffect(() => {
    if (value) {
      const [year, month] = value.split("-");
      setSelectedYear(year);
      setSelectedMonth(month);
    }
  }, [value]);

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => (fromYear + i).toString()
  );

  const handleMonthSelect = (monthIndex: string) => {
    setSelectedMonth(monthIndex);
    const newValue = `${selectedYear}-${monthIndex.padStart(2, "0")}`;
    onChange?.(newValue);
    setOpen(false);
  };

  const displayValue = value
    ? `${MONTHS[parseInt(value.split("-")[1]) - 1]} ${value.split("-")[0]}`
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9 border-input bg-transparent",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue ? displayValue : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => {
                const monthValue = (index + 1).toString().padStart(2, "0");
                return (
                  <Button
                    key={month}
                    type="button"
                    variant={selectedMonth === monthValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMonthSelect(monthValue)}
                    className="h-9"
                  >
                    {month.slice(0, 3)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
