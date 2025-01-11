"use client";

import { ClassDialog } from "./ClassDialog";
import { Teacher, SchoolClass } from "@/db/types";

type EditClassDialogProps = {
  schoolClass: SchoolClass;
  onEditClass: (classData: SchoolClass) => Promise<void>;
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
    <ClassDialog<SchoolClass>
      initialClass={schoolClass}
      onSubmit={onEditClass}
      onCancel={onCancel}
      teachers={teachers}
      title="Klasse bearbeiten"
      isEditing
    />
  );
}
