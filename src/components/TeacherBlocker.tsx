'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Blocker = {
  day: string
  von: number
  bis: number
}

export function TeacherBlocker({ blocker }: { blocker: Blocker[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {blocker.map(a => a.day).join(", ")}
        </TooltipTrigger>
        <TooltipContent>
          <ul>
            {blocker.map((a, index) => (
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

