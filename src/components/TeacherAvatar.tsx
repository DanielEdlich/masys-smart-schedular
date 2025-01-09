import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeacherAvatarProps {
  first_name: string;
  last_name: string;
}

export function TeacherAvatar({ first_name, last_name }: TeacherAvatarProps) {
  const initials = `${first_name[0]}${last_name[0]}`.toUpperCase();

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
