"use client";

import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Slot } from "@radix-ui/react-slot";
import { FC } from "react";
import { GripVertical, PencilRuler, X, Pause, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleCard {
  id: string;
  teacher: Teacher;
  type: ClassType;
  color: string;
  day: Weekday;
  className: ClassName;
  week: Week;
  index: number;
  secondaryTeacher?: Teacher;
}

type WeekSchedule = {
  [week in Week]: (ScheduleCard | null)[];
};

type ClassSchedule = {
  [className in ClassName]: WeekSchedule;
};

type Schedule = {
  [day in Weekday]: ClassSchedule;
};

const weekdays = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;
type Weekday = (typeof weekdays)[number];

const classes = [
  "Class1",
  "Class2",
  "Class3",
  "Class4",
  "Class5",
  "Class6",
  "Class7",
  "Class8",
  "Class9",
  "Class10",
] as const;
type ClassName = (typeof classes)[number];

const weeks = ["A", "B"] as const;
type Week = (typeof weeks)[number];

const timeSlots = Array.from({ length: 8 }, (_, i) => i + 1);

const classTypes = [
  "Mathematik",
  "Deutsch",
  "Kunst",
  "Englisch",
  "Sport",
  "Biologie",
  "Chemie",
  "Physik",
  "Geschichte",
  "Geographie",
] as const;
type ClassType = (typeof classTypes)[number];

const teachers = [
  "Herr Schmidt",
  "Frau Müller",
  "Herr Weber",
  "Frau Fischer",
  "Herr Wagner",
  "Frau Becker",
  "Herr Hoffmann",
  "Frau Schulz",
  "Herr Koch",
  "Frau Meyer",
] as const;
type Teacher = (typeof teachers)[number];

const getColorByTeacher = (teacher: Teacher): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98FB98",
    "#DDA0DD",
    "#F0E68C",
    "#87CEFA",
    "#FFB6C1",
    "#20B2AA",
  ];
  return colors[teachers.indexOf(teacher) % colors.length];
};

interface DraggableCardProps {
  card: ScheduleCard;
  moveCard: (
    card: ScheduleCard,
    toDay: Weekday,
    toClass: ClassName,
    toWeek: Week,
    toIndex: number,
  ) => void;
  editCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
    teacher: Teacher,
    type: ClassType,
    color: string,
    secondaryTeacher?: Teacher,
  ) => void;
  deleteCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
  ) => void;
}

const DraggableCard: FC<DraggableCardProps> = ({
  card,
  moveCard,
  editCard,
  deleteCard,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: card,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Create a ref callback that properly handles the drag reference
  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  return (
    <Card
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: card.color }}
      className="w-full h-full shadow-sm border-none"
    >
      <CardContent className="p-2 flex flex-col justify-between text-xs h-full">
        <div className="flex items-center w-full justify-between">
          <span className="font-bold truncate w-20">{card.type}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
              >
                <Slot>
                  <PencilRuler className="h-3 w-3" />
                </Slot>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Karte bearbeiten</DialogTitle>
              </DialogHeader>
              <CardForm
                day={card.day}
                className={card.className}
                week={card.week}
                slotIndex={card.index}
                addCard={() => {}}
                editCard={editCard}
                deleteCard={deleteCard}
                existingCard={card}
                onClose={() =>
                  document
                    .querySelector<HTMLButtonElement>("[data-dialog-close]")
                    ?.click()
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

interface CardFormProps {
  day: Weekday;
  className: ClassName;
  week: Week;
  slotIndex: number;
  addCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
    teacher: Teacher,
    type: ClassType,
    color: string,
    secondaryTeacher?: Teacher,
  ) => void;
  editCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
    teacher: Teacher,
    type: ClassType,
    color: string,
    secondaryTeacher?: Teacher,
  ) => void;
  deleteCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
  ) => void;
  existingCard?: ScheduleCard;
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({
  day,
  className,
  week,
  slotIndex,
  addCard,
  editCard,
  deleteCard,
  existingCard,
  onClose,
}) => {
  const [teacher, setTeacher] = useState<Teacher>(
    existingCard?.teacher || teachers[0],
  );
  const [type, setType] = useState<ClassType>(
    existingCard?.type || classTypes[0],
  );
  const [secondaryTeacher, setSecondaryTeacher] = useState<Teacher | "none">(
    existingCard?.secondaryTeacher || "none",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const secondaryTeacherValue =
      secondaryTeacher === "none" ? undefined : secondaryTeacher;
    const color = getColorByTeacher(teacher);
    if (existingCard) {
      editCard(
        day,
        className,
        week,
        slotIndex,
        teacher,
        type,
        color,
        secondaryTeacherValue,
      );
    } else {
      addCard(
        day,
        className,
        week,
        slotIndex,
        teacher,
        type,
        color,
        secondaryTeacherValue,
      );
    }
    onClose();
  };

  const handleDelete = () => {
    deleteCard(day, className, week, slotIndex);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Findet statt am:</Label>
          <div className="text-sm text-gray-600">
            {`${slotIndex + 1}. Stunde, ${day}, ${className}, Woche ${week}`}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Fachtyp</Label>
          <Select
            value={type}
            onValueChange={(value: ClassType) => setType(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class type" />
            </SelectTrigger>
            <SelectContent>
              {classTypes.map((classType) => (
                <SelectItem key={classType} value={classType}>
                  {classType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="teacher">Lehrer</Label>
          <Select
            value={teacher}
            onValueChange={(value: Teacher) => setTeacher(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t} value={t}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getColorByTeacher(t) }}
                    ></div>
                    {t}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryTeacher">Zweiter Lehrer (Optional)</Label>
          <Select
            value={secondaryTeacher}
            onValueChange={(value: Teacher | "none") =>
              setSecondaryTeacher(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select secondary teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {teachers.map((t) => (
                <SelectItem key={t} value={t}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getColorByTeacher(t) }}
                    ></div>
                    {t}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between">
          <Button type="submit">
            {existingCard ? "Aktualisieren" : "Hinzufügen"}
          </Button>
          {existingCard && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

interface DroppableSlotProps {
  day: Weekday;
  className: ClassName;
  week: Week;
  slotIndex: number;
  card: ScheduleCard | null;
  moveCard: (
    card: ScheduleCard,
    toDay: Weekday,
    toClass: ClassName,
    toWeek: Week,
    toIndex: number,
  ) => void;
  addCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
    teacher: Teacher,
    type: ClassType,
    color: string,
    secondaryTeacher?: Teacher,
  ) => void;
  editCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
    teacher: Teacher,
    type: ClassType,
    color: string,
    secondaryTeacher?: Teacher,
  ) => void;
  deleteCard: (
    day: Weekday,
    className: ClassName,
    week: Week,
    index: number,
  ) => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  day,
  className,
  week,
  slotIndex,
  card,
  moveCard,
  addCard,
  editCard,
  deleteCard,
}) => {
  const [, drop] = useDrop({
    accept: "CARD",
    canDrop: () => !isBlocked,
    drop: (item: ScheduleCard) => {
      if (
        !isBlocked &&
        (item.day !== day ||
          item.className !== className ||
          item.week !== week ||
          item.index !== slotIndex)
      ) {
        moveCard(item, day, className, week, slotIndex);
      }
    },
  });

  const [isBlocked, setIsBlocked] = useState(false);

  const toggleBlock = () => {
    setIsBlocked(!isBlocked);
  };

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop],
  );

  return (
    <div
      ref={dropRef}
      className="w-32 h-16 relative  rounded-md overflow-hidden"
    >
      {isBlocked ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <Ban className="text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-4 w-4 p-0 rounded-full bg-white shadow-sm"
            onClick={toggleBlock}
            title="Zeitfenster entsperren"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : card ? (
        <DraggableCard
          card={card}
          moveCard={moveCard}
          editCard={editCard}
          deleteCard={deleteCard}
        />
      ) : (
        <div className="w-full h-full flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="h-full flex-grow text-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                title="Neue Karte hinzufügen"
              >
                +
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Karte hinzufügen</DialogTitle>
              </DialogHeader>
              <CardForm
                day={day}
                className={className}
                week={week}
                slotIndex={slotIndex}
                addCard={addCard}
                editCard={editCard}
                deleteCard={deleteCard}
                onClose={() =>
                  document
                    .querySelector<HTMLButtonElement>("[data-dialog-close]")
                    ?.click()
                }
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="h-full aspect-square text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            onClick={toggleBlock}
            title="Zeitfenster sperren"
          >
            <Ban className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

interface ClassSchedulerProps {
  initialSchedule?: Schedule;
}

export default function ClassScheduler({
  initialSchedule,
}: ClassSchedulerProps = {}) {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    if (initialSchedule) return initialSchedule;

    const newSchedule: Schedule = {} as Schedule;
    weekdays.forEach((day) => {
      newSchedule[day] = {} as ClassSchedule;
      classes.forEach((className) => {
        newSchedule[day][className] = {
          A: Array(8).fill(null),
          B: Array(8).fill(null),
        };
      });
    });
    return newSchedule;
  });

  const moveCard = useCallback(
    (
      card: ScheduleCard,
      toDay: Weekday,
      toClass: ClassName,
      toWeek: Week,
      toIndex: number,
    ) => {
      setSchedule((prevSchedule) => {
        const newSchedule = JSON.parse(
          JSON.stringify(prevSchedule),
        ) as Schedule;
        // Remove card from its original position
        newSchedule[card.day][card.className][card.week][card.index] = null;
        // Place card in its new position
        newSchedule[toDay][toClass][toWeek][toIndex] = {
          ...card,
          day: toDay,
          className: toClass,
          week: toWeek,
          index: toIndex,
        };
        return newSchedule;
      });
    },
    [],
  );

  const addCard = useCallback(
    (
      day: Weekday,
      className: ClassName,
      week: Week,
      index: number,
      teacher: Teacher,
      type: ClassType,
      color: string,
      secondaryTeacher?: Teacher,
    ) => {
      setSchedule((prevSchedule) => {
        const newSchedule = { ...prevSchedule };
        const newCard: ScheduleCard = {
          id: `card-${day}-${className}-${week}-${index}`,
          teacher,
          type,
          color,
          day,
          className,
          week,
          index,
          secondaryTeacher,
        };
        newSchedule[day][className][week][index] = newCard;
        return newSchedule;
      });
    },
    [],
  );

  const editCard = useCallback(
    (
      day: Weekday,
      className: ClassName,
      week: Week,
      index: number,
      teacher: Teacher,
      type: ClassType,
      color: string,
      secondaryTeacher?: Teacher,
    ) => {
      setSchedule((prevSchedule) => {
        const newSchedule = { ...prevSchedule };
        const existingCard = newSchedule[day][className][week][index];
        if (existingCard) {
          newSchedule[day][className][week][index] = {
            ...existingCard,
            teacher,
            type,
            color,
            secondaryTeacher,
          };
        }
        return newSchedule;
      });
    },
    [],
  );

  const deleteCard = useCallback(
    (day: Weekday, className: ClassName, week: Week, index: number) => {
      setSchedule((prevSchedule) => {
        const newSchedule = { ...prevSchedule };
        newSchedule[day][className][week][index] = null;
        return newSchedule;
      });
    },
    [],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 flex flex-col h-screen w-screen ">
        <div className="overflow-auto flex-grow">
          <div className="fixed top-20 left-4 right-4 bottom-4 overflow-auto rounded-lg">
            <div className="min-w-[1700px] relative">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="sticky top-0 z-20">
                    <th className="border p-2 bg-purple-50 sticky left-0 z-30 min-w-[100px]"></th>
                    <th className="border p-2 bg-purple-50 sticky left-[100px] z-30 min-w-[50px]"></th>
                    {classes.map((className) => (
                      <th
                        key={className}
                        colSpan={2}
                        className="border p-2 bg-purple-50 min-w-[200px]"
                      >
                        {className}
                      </th>
                    ))}
                  </tr>
                  <tr className="sticky top-[41px] z-20 bg-white">
                    <th className="border p-2 bg-purple-50 sticky left-0 z-30 min-w-[100px]"></th>
                    <th className="border p-2 bg-purple-50 sticky left-[100px] z-30 min-w-[50px]"></th>
                    {classes.flatMap((className) =>
                      weeks.map((week) => (
                        <th
                          key={`${className}-${week}`}
                          className="border p-2 bg-purple-50 min-w-[100px]"
                        >
                          Woche {week}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {weekdays.map((day) => (
                    <React.Fragment key={day}>
                      {timeSlots.map((slot, slotIndex) => (
                        <tr key={`${day}-${slot}`}>
                          {slotIndex === 0 && (
                            <th
                              rowSpan={8}
                              className="border p-2 bg-purple-50 sticky left-0 z-10 min-w-[100px]"
                            >
                              {day}
                            </th>
                          )}
                          <td className="border p-2 bg-purple-50 sticky left-[100px] z-10 min-w-[50px] text-center">
                            {slot}
                          </td>
                          {classes.map((className) =>
                            weeks.map((week) => (
                              <td
                                key={`${day}-${className}-${week}-${slot}`}
                                className="border p-0.5 min-w-[100px]"
                              >
                                <DroppableSlot
                                  day={day}
                                  className={className}
                                  week={week}
                                  slotIndex={slotIndex}
                                  card={
                                    schedule[day][className][week][slotIndex]
                                  }
                                  moveCard={moveCard}
                                  addCard={addCard}
                                  editCard={editCard}
                                  deleteCard={deleteCard}
                                />
                              </td>
                            )),
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
