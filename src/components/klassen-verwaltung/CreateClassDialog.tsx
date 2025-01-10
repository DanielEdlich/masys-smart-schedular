"use client";

import { ClassDialog } from "./ClassDialog";
import { Teacher, SchoolClass } from "@/db/types";

type AddClassDialogProps = {
  onAddClass: (newClass: Omit<SchoolClass, "id">) => Promise<void>;
  onClose: () => void;
  teachers: Teacher[];
};

export function AddClassDialog({
  onAddClass,
  onClose,
  teachers,
}: AddClassDialogProps) {
  const initialClass: Omit<SchoolClass, "id"> = {
    name: "",
    year: "",
    track: "A",
    primary_teacher_id: 0,
    secondary_teacher_id: null,
  };

  return (
    <ClassDialog
      initialClass={initialClass}
      onSubmit={onAddClass}
      onCancel={onClose}
      teachers={teachers}
      title="Neue Klasse hinzufügen"
    />
  );
}
