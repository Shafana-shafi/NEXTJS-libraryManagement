"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

const statusOptions: FilterOption[] = [
  { label: "Requested", value: "requested" },
  { label: "Success", value: "success" },
  { label: "Declined", value: "declined" },
  { label: "Returned", value: "returned" },
];

const dateRangeOptions: FilterOption[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Past Week", value: "past_week" },
];

export function RequestFilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [requestDate, setRequestDate] = useState<Date | undefined>(undefined);
  const [issuedDate, setIssuedDate] = useState<Date | undefined>(undefined);
  const [returnedDate, setReturnedDate] = useState<Date | undefined>(undefined);
  const [requestDateRange, setRequestDateRange] = useState<string | undefined>(
    undefined
  );
  const [issuedDateRange, setIssuedDateRange] = useState<string | undefined>(
    undefined
  );
  const [returnedDateRange, setReturnedDateRange] = useState<
    string | undefined
  >(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = (value: string) => {
    setStatusFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleDateRangeChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    setter((prev) => (prev === value ? undefined : value));
  };

  const applyFilters = useCallback(() => {
    const filters = {
      status: statusFilters,
      requestDate,
      issuedDate,
      returnedDate,
      requestDateRange,
      issuedDateRange,
      returnedDateRange,
    };

    const params = new URLSearchParams(searchParams.toString());
    params.set("filters", JSON.stringify(filters));
    router.push(`/requests?${params.toString()}`);
    setIsDialogOpen(false);
  }, [
    statusFilters,
    requestDate,
    issuedDate,
    returnedDate,
    requestDateRange,
    issuedDateRange,
    returnedDateRange,
    searchParams,
    router,
  ]);

  const resetFilters = () => {
    setStatusFilters([]);
    setRequestDate(undefined);
    setIssuedDate(undefined);
    setReturnedDate(undefined);
    setRequestDateRange(undefined);
    setIssuedDateRange(undefined);
    setReturnedDateRange(undefined);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Requests</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={statusFilters.includes(option.value)}
                    onCheckedChange={() => handleStatusChange(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DateFilter
            label="Request Date"
            date={requestDate}
            setDate={setRequestDate}
            dateRange={requestDateRange}
            setDateRange={setRequestDateRange}
            handleDateRangeChange={handleDateRangeChange}
          />
          <DateFilter
            label="Issued Date"
            date={issuedDate}
            setDate={setIssuedDate}
            dateRange={issuedDateRange}
            setDateRange={setIssuedDateRange}
            handleDateRangeChange={handleDateRangeChange}
          />
          <DateFilter
            label="Returned Date"
            date={returnedDate}
            setDate={setReturnedDate}
            dateRange={returnedDateRange}
            setDateRange={setReturnedDateRange}
            handleDateRangeChange={handleDateRangeChange}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DateFilterProps {
  label: string;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  dateRange: string | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleDateRangeChange: (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => void;
}

function DateFilter({
  label,
  date,
  setDate,
  dateRange,
  setDateRange,
  handleDateRangeChange,
}: DateFilterProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <RadioGroup
        value={dateRange}
        onValueChange={(value) => handleDateRangeChange(value, setDateRange)}
      >
        {dateRangeOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${label}-${option.value}`}
            />
            <Label htmlFor={`${label}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
