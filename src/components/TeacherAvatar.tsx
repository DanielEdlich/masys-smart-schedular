import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TeacherAvatarProps {
  firstName: string
  lastName: string
}

export function TeacherAvatar({ firstName, lastName }: TeacherAvatarProps) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

