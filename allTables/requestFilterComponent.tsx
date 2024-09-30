// File: app/[locale]/components/requestFilterComponent.tsx
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
import { useTranslations } from "next-intl";

interface FilterOption {
  label: string;
  value: string;
}

export function RequestFilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("RequestFilterComponent");

  const statusOptions: FilterOption[] = [
    { label: t("requested"), value: "requested" },
    { label: t("success"), value: "success" },
    { label: t("declined"), value: "declined" },
    { label: t("returned"), value: "returned" },
  ];

  // Removed date range options for "today" and "yesterday"
  const dateRangeOptions: FilterOption[] = []; // Now it's empty

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
          {t("filter")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {t("filterRequests")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-lg font-bold">
              {t("status")}
            </Label>
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
            label={t("requestDate")}
            date={requestDate}
            setDate={setRequestDate}
            dateRange={requestDateRange}
            setDateRange={setRequestDateRange}
            handleDateRangeChange={handleDateRangeChange}
            dateRangeOptions={dateRangeOptions}
          />
          <DateFilter
            label={t("issuedDate")}
            date={issuedDate}
            setDate={setIssuedDate}
            dateRange={issuedDateRange}
            setDateRange={setIssuedDateRange}
            handleDateRangeChange={handleDateRangeChange}
            dateRangeOptions={dateRangeOptions}
          />
          <DateFilter
            label={t("returnedDate")}
            date={returnedDate}
            setDate={setReturnedDate}
            dateRange={returnedDateRange}
            setDateRange={setReturnedDateRange}
            handleDateRangeChange={handleDateRangeChange}
            dateRangeOptions={dateRangeOptions}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            {t("resetFilters")}
          </Button>
          <Button onClick={applyFilters}>{t("applyFilters")}</Button>
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
  dateRangeOptions: FilterOption[];
}

function DateFilter({
  label,
  date,
  setDate,
  dateRange,
  setDateRange,
  handleDateRangeChange,
  dateRangeOptions,
}: DateFilterProps) {
  const t = useTranslations("RequestFilterComponent");

  return (
    <div className="grid gap-2">
      <Label className="text-lg font-bold">{label}</Label>
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
            {date ? format(date, "PPP") : t("pickADate")}
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
