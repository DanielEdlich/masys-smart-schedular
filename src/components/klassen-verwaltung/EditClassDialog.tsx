"use client";

import { ClassDialog } from "./ClassDialog";
import { Teacher, SchoolClass } from "@/db/types";

type EditClassDialogProps = {
  schoolClass: SchoolClass;
  onEditClass: (
    classData: Omit<SchoolClass, "id"> | SchoolClass,
  ) => Promise<void>;
  onCancel: () => void;
  teachers: Teacher[];
};

export function EditClassDialog({
  schoolClass,
  onEditClass,
  onCancel,
  teachers,
}: EditClassDialogProps) {
  return (
    <ClassDialog
      initialClass={schoolClass}
      onSubmit={onEditClass}
      onCancel={onCancel}
      teachers={teachers}
      title="Klasse bearbeiten"
      isEditing
    />
  );
}
