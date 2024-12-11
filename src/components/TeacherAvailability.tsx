'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Availability = {
  day: string
  von: number
  bis: number
}

export function TeacherAvailability({ availability }: { availability: Availability[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {availability.map(a => a.day).join(", ")}
        </TooltipTrigger>
        <TooltipContent>
          <ul>
            {availability.map((a, index) => (
              <li key={index}>
                {a.day}: Block {a.von} - {a.bis}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

