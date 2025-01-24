"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteTeacher } from "@/app/actions/teacherActions";
import { useToast } from "@/hooks/use-toast";

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

export function DeleteTeacherDialog({teacher}: { teacher: Teacher }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  
  const handleDelete = async () => {
    try {
      await deleteTeacher(teacher.id);
      // Trigger Toast on success
      toast({
        title: "Lehrer erfolgreich gelöscht!",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen des Lehrers.",
      }); // Trigger Toast on error
    }
    router.refresh();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-cy="delete-dialog-button" variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4"/>
          Löschen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lehrer löschen</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Sind Sie sicher, dass Sie diesen Lehrer löschen möchten?</p>
          <p className="font-semibold">{`${teacher.first_name} ${teacher.last_name}`}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button data-cy="confirm-delete-button" variant="destructive" onClick={handleDelete}>
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
