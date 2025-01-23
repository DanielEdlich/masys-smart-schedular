"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Availability = {
  day: string;
  timeslot_from: number;
  timeslot_to: number;
};

export function TeacherAvailability({ availability: availability }: { availability: Availability[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{availability.map((a) => a.day).join(", ")}</TooltipTrigger>
        <TooltipContent>
          <ul>
            {availability.map((a, index) => (
              <li key={index}>
                {a.day}: Block {a.timeslot_from} - {a.timeslot_to}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
