"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { updateTeacher } from "@/app/actions/teacherActions";
import { useToast } from "@/hooks/use-toast";
import { TeacherForm, TeacherFormData } from "./TeacherForm";

type Blocker = {
  id?: number;
  day: string;
  timeslot_from: number;
  timeslot_to: number;
};

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  priority: number;
  weekly_capacity: number;
  color: string;
  blocker: Blocker[];
};

export function EditTeacherDialog({ teacher }: { teacher: Teacher }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Passende Konvertierung ins TeacherFormData-Format:
  const initialData: TeacherFormData = {
    id: teacher.id,
    first_name: teacher.first_name,
    last_name: teacher.last_name,
    email: teacher.email,
    phone: teacher.phone,
    priority: teacher.priority,
    weekly_capacity: teacher.weekly_capacity,
    color: teacher.color || "#37EB5B",
    blocker: teacher.blocker || [],
  };

  const onSubmit = async (data: TeacherFormData) => {
    try {
      // updateTeacher erwartet i. d. R. { id, ... } =>
      // Achte darauf, dass du das id-Feld mitgibst
      await updateTeacher(data);
      toast({ title: "Lehrer erfolgreich aktualisiert!" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Aktualisieren des Lehrers.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Lehrerin/Lehrer bearbeiten</DialogTitle>
        </DialogHeader>
        <TeacherForm
          initialData={initialData}
          onSubmit={onSubmit}
          onFinished={() => setOpen(false)}
          isEditMode={true}
        />
      </DialogContent>
    </Dialog>
  );
}
