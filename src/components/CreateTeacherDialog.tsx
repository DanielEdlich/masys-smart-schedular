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
import { createTeacher } from "@/app/actions/teacherActions";
import { TeacherForm, TeacherFormData } from "./TeacherForm";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

export function CreateTeacherDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Default-Werte für ein neu anzulegendes Teacher-Objekt
  const initialData: TeacherFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    priority: 1,
    weekly_capacity: 40,
    color: "#000000",
    blocker: [{ day: "Montag", timeslot_from: 1, timeslot_to: 2 }],
  };

  const onSubmit = async (data: TeacherFormData) => {
    try {
      await createTeacher(data);
      toast({ title: "Lehrer erfolgreich angelegt!" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Erstellen des Lehrers.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6 bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Lehrerin/Lehrer anlegen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Neuen Lehrer erstellen</DialogTitle>
        </DialogHeader>
        <TeacherForm
          initialData={initialData}
          onSubmit={onSubmit}
          onFinished={() => setOpen(false)}
          isEditMode={false}
        />
      </DialogContent>
    </Dialog>
  );
}
