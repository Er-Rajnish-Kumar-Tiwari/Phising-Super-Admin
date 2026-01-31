import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import Datepicker from "react-tailwindcss-datepicker";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const StepThree: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<
    "immediately" | "setup_later"
  >("immediately");

  // ✅ SINGLE DATE
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  // ✅ SINGLE TIME
  const [time, setTime] = useState("09:00");

  const [timezone, setTimezone] = useState("UTC");

  const TIMEZONES = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
    { value: "Europe/London", label: "GMT (London)" },
    { value: "Europe/Paris", label: "CET (Paris)" },
    { value: "Europe/Berlin", label: "CET (Berlin)" },
    { value: "Europe/Moscow", label: "MSK (Moscow)" },
    { value: "America/New_York", label: "EST (New York)" },
    { value: "America/Chicago", label: "CST (Chicago)" },
    { value: "America/Denver", label: "MST (Denver)" },
    { value: "America/Los_Angeles", label: "PST (Los Angeles)" },
    { value: "Asia/Dubai", label: "GST (Dubai)" },
    { value: "Asia/Singapore", label: "SGT (Singapore)" },
    { value: "Asia/Tokyo", label: "JST (Tokyo)" },
    { value: "Asia/Shanghai", label: "CST (China)" },
    { value: "Asia/Hong_Kong", label: "HKT (Hong Kong)" },
    { value: "Asia/Seoul", label: "KST (Seoul)" },
    { value: "Australia/Sydney", label: "AEST (Sydney)" },
    { value: "Australia/Melbourne", label: "AEST (Melbourne)" },
    { value: "America/Sao_Paulo", label: "BRT (São Paulo)" },
    { value: "Africa/Johannesburg", label: "SAST (Johannesburg)" },
  ];

  return (
    // h-full aur flex-col se space control hoga
    <div className="flex flex-col h-full ">
      
      {/* CONTENT AREA: flex-grow ensures this takes only needed space */}
      <div className="flex-grow space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-lg text-[#101828]">Email Delivery Schedule</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white text-sm">
                Choose when you want the email to be delivered
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* OPTIONS */}
        <div className="space-y-4">
          {/* IMMEDIATELY */}
          <div
            onClick={() => setScheduleType("immediately")}
            className={cn(
              "flex gap-3 cursor-pointer rounded-xl border p-4 transition-all",
              scheduleType === "immediately" ? "border-purple-600 bg-purple-50/30" : "border-gray-200"
            )}
          >
            <input type="radio" checked={scheduleType === "immediately"} readOnly className="mt-1 accent-purple-600" />
            <div>
              <p className="font-semibold text-gray-900">⚡ Deliver Immediately</p>
              <p className="text-sm text-gray-500">Send the email right away as soon as you confirm</p>
            </div>
          </div>

          {/* SETUP SCHEDULE */}
          <div
            onClick={() => setScheduleType("setup_later")}
            className={cn(
              "cursor-pointer rounded-xl border p-4 transition-all",
              scheduleType === "setup_later" ? "border-purple-600 bg-purple-50/30" : "border-gray-200"
            )}
          >
            <div className="flex gap-3">
              <input type="radio" checked={scheduleType === "setup_later"} readOnly className="mt-1 accent-purple-600" />
              <div>
                <p className="font-semibold flex items-center gap-2 text-gray-900">
                  <Calendar size={18} className="text-gray-500" /> Setup Schedule
                </p>
                <p className="text-sm text-gray-500">Choose a specific date and time to send the email</p>
              </div>
            </div>

            {/* EXTRA FIELDS (Only shows if selected) */}
            {scheduleType === "setup_later" && (
              <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <Datepicker
                      useRange={false}
                      asSingle={true}
                      minDate={new Date()}
                      value={dateValue}
                      onChange={(val: any) => setDateValue(val)}
                      inputClassName="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StepThree;
