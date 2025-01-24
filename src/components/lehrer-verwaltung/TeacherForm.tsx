"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

type Blocker = {
  id?: number;
  day: string;
  timeslot_from: number;
  timeslot_to: number;
};

export interface TeacherFormData {
  id?: number; // nur vorhanden im Edit-Fall
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  priority: number;
  weekly_capacity: number;
  blocker: Blocker[];
  color: string;
}

export interface TeacherFormProps {
  /**
   * Vorbelegtes Formular (Edit-Fall)
   * oder Leeres Objekt (Create-Fall)
   */
  initialData: TeacherFormData;

  /**
   * Wird aufgerufen, wenn das Formular abgesendet wird.
   * Hier kann das createTeacher oder updateTeacher kommen.
   */
  onSubmit: (data: TeacherFormData) => Promise<void> | void;

  /**
   * Optional: Callback, wenn das Formular erfolgreich abgeschlossen/geschlossen ist.
   * (z.B. zum Schließen des Dialogs)
   */
  onFinished?: () => void;

  /**
   * Optional: Unterscheidung, ob das Formular im Erstellen- oder Bearbeiten-Modus ist
   */
  isEditMode: boolean; //
}

export function TeacherForm({
  initialData,
  onSubmit,
  onFinished,
  isEditMode = false,
}: TeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Falls initialData sich ändert (z. B. nachträglich edit), aktualisieren:
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (key: keyof TeacherFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Blocker-Methoden
  const handleBlockerChange = (
    index: number,
    field: keyof Blocker,
    value: any,
  ) => {
    const newBlocker = [...formData.blocker];
    newBlocker[index] = {
      ...newBlocker[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      blocker: newBlocker,
    });
  };

  const addBlocker = () => {
    setFormData({
      ...formData,
      blocker: [
        ...formData.blocker,
        {
          day: "Montag",
          timeslot_from: 1,
          timeslot_to: 2,
        },
      ],
    });
  };

  const removeBlocker = (index: number) => {
    const newBlocker = formData.blocker.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      blocker: newBlocker,
    });
  };

  // Validierung
  const validate = (): boolean => {
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    ) {
      alert(
        "Bitte alle benötigten Felder ausfüllen (Vorname, Nachname, E-Mail).",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData); // z.B. createTeacher(formData) / updateTeacher(formData)
      onFinished?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 p-1">
      <div className="space-y-4">
        {/* Vorname */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="first_name" className="text-right">
            Vorname
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            className="col-span-3"
          />
        </div>

        {/* Nachname */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="last_name" className="text-right">
            Nachname
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            className="col-span-3"
          />
        </div>

        {/* E-Mail */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            E-Mail
          </Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="col-span-3"
          />
        </div>

        {/* Telefon */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Telefon
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="col-span-3"
          />
        </div>

        {/* Priorität */}
        <div data-cy="priority" className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="priority" className="text-right">
            Priorität
          </Label>
          <Select
            value={formData.priority.toString()}
            onValueChange={(val) => handleChange("priority", parseInt(val))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Priorität wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wöchentliche Kapazität */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="weekly_capacity" className="text-right">
            Wöchentliche Kapazität
          </Label>
          <Input
            id="weekly_capacity"
            type="number"
            value={formData.weekly_capacity}
            onChange={(e) =>
              handleChange("weekly_capacity", parseInt(e.target.value || "40"))
            }
            className="col-span-3"
          />
        </div>

        {/* Farbe */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="color" className="text-right">
            Farbe
          </Label>
          <div className="flex items-center gap-4">
            <div className="relative w-6 h-6">
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: formData.color }}
              />
            </div>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-0 h-0 opacity-0 absolute" // versteckter Input
            />
          </div>
        </div>

        {/* Blocker */}
        <div className="space-y-2" data-cy="blocker">
          <Label>Verfügbarkeit (Blocker)</Label>
          {formData.blocker.map((b, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Select
                value={b.day}
                onValueChange={(val) => handleBlockerChange(index, "day", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Montag">Montag</SelectItem>
                  <SelectItem value="Dienstag">Dienstag</SelectItem>
                  <SelectItem value="Mittwoch">Mittwoch</SelectItem>
                  <SelectItem value="Donnerstag">Donnerstag</SelectItem>
                  <SelectItem value="Freitag">Freitag</SelectItem>
                </SelectContent>
              </Select>

              <Input
                id={`blocker-min-${index}`}
                type="number"
                value={b.timeslot_from}
                onChange={(e) =>
                  handleBlockerChange(
                    index,
                    "timeslot_from",
                    parseInt(e.target.value),
                  )
                }
                min={1}
                max={10}
              />
              <Input
                id={`blocker-max-${index}`}
                type="number"
                value={b.timeslot_to}
                onChange={(e) =>
                  handleBlockerChange(
                    index,
                    "timeslot_to",
                    parseInt(e.target.value),
                  )
                }
                min={1}
                max={10}
              />
              <Button
                data-cy={`blocker-delete-${index}`}
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeBlocker(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addBlocker}>
            Blocker hinzufügen
          </Button>
        </div>
      </div>

      {/* Footer / Submit */}
      <div className="flex justify-end mt-4 pt-4 border-t space-x-2">
        <Button
          data-cy="submit-button"
          type="submit"
          disabled={isSubmitting}
          id="submit-form-button"
        >
          {isSubmitting
            ? "Wird gesendet..."
            : isEditMode == false
              ? "Erstellen"
              : "Aktualisieren"}
        </Button>
      </div>
    </form>
  );
}
