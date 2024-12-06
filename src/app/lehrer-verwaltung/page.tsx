"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { TeacherAvatar } from "@/components/TeacherAvatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Navbar } from "@/components/Navbar"

type Availability = {
  day: string
  von: number
  bis: number
}

type Teacher = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  priority: number
  availability: Availability[]
}

const teachers: Teacher[] = [
  {
    id: 1,
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@schule.de",
    phone: "0123456789",
    priority: 1.1,
    availability: [
      { day: "Montag", von: 1, bis: 6 },
      { day: "Mittwoch", von: 3, bis: 8 },
    ]
  },
  {
    id: 2,
    firstName: "Erika",
    lastName: "Musterfrau",
    email: "erika.musterfrau@schule.de",
    phone: "0987654321",
    priority: 2.1,
    availability: [
      { day: "Dienstag", von: 2, bis: 3 },
      { day: "Donnerstag", von: 6, bis: 7 },
    ]
  },
  {
    id: 3,
    firstName: "Thomas",
    lastName: "Schmidt",
    email: "thomas.schmidt@schule.de",
    phone: "0234567890",
    priority: 3.4,
    availability: [
      { day: "Montag", von: 3, bis: 4 },
      { day: "Freitag", von: 5, bis: 6 },
    ]
  },
  {
    id: 4,
    firstName: "Anna",
    lastName: "Weber",
    email: "anna.weber@schule.de",
    phone: "0345678901",
    priority: 100,
    availability: [
      { day: "Dienstag", von: 1, bis: 2 },
      { day: "Donnerstag", von: 3, bis: 8 },
    ]
  },
  {
    id: 5,
    firstName: "Michael",
    lastName: "Koch",
    email: "michael.koch@schule.de",
    phone: "0456789012",
    priority: 2.4,
    availability: [
      { day: "Mittwoch", von: 2, bis: 3 },
      { day: "Freitag", von: 6, bis: 7 },
    ]
  },
  {
    id: 6,
    firstName: "Julia",
    lastName: "Becker",
    email: "julia.becker@schule.de",
    phone: "0567890123",
    priority: 3.2,
    availability: [
      { day: "Montag", von: 4, bis: 5 },
      { day: "Donnerstag", von: 2, bis: 7 },
    ]
  },
  {
    id: 7,
    firstName: "Stefan",
    lastName: "Hoffmann",
    email: "stefan.hoffmann@schule.de",
    phone: "0678901234",
    priority: 1.3,
    availability: [
      { day: "Dienstag", von: 3, bis: 4 },
      { day: "Freitag", von: 2, bis: 7 },
    ]
  },
  {
    id: 8,
    firstName: "Laura",
    lastName: "Schulz",
    email: "laura.schulz@schule.de",
    phone: "0789012345",
    priority: 2,
    availability: [
      { day: "Mittwoch", von: 1, bis: 2 },
      { day: "Freitag", von: 3, bis: 8 },
    ]
  },
  {
    id: 9,
    firstName: "Andreas",
    lastName: "Wagner",
    email: "andreas.wagner@schule.de",
    phone: "0890123456",
    priority: 3,
    availability: [
      { day: "Montag", von: 2, bis: 3 },
      { day: "Donnerstag", von: 1, bis: 6 },
    ]
  },
  {
    id: 10,
    firstName: "Sabine",
    lastName: "Fischer",
    email: "sabine.fischer@schule.de",
    phone: "0901234567",
    priority: 1,
    availability: [
      { day: "Dienstag", von: 4, bis: 9 },
      { day: "Freitag", von: 2, bis: 7 },
    ]
  }
]

export default function Lehrerverwaltung() {
  return (
    <>
    <Navbar />
    <main>
    <div className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Lehrerverwaltung</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          Willkommen bei der Lehrerverwaltung. Verwalten Sie hier alle Lehrer-Daten.
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-6">
              <PlusCircle className="mr-2 h-4 w-4" />
              Neuen Lehrer hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Neuen Lehrer erstellen</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Placeholder for the form content */}
              <p>TODO: Hier wird später das Formular implementiert.</p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Priorität</TableHead>
              <TableHead>Verfügbarkeit</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <TeacherAvatar firstName={teacher.firstName} lastName={teacher.lastName} />
                </TableCell>
                <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.priority}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {teacher.availability.map(a => a.day).join(", ")}
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul>
                          {teacher.availability.map((a, index) => (
                            <li key={index}>
                              {a.day}: Block {a.von} - {a.bis}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Lehrer bearbeiten</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {/* Placeholder for the form content */}
                          <p>Hier wird später das Bearbeitungsformular implementiert.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Lehrer löschen</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Sind Sie sicher, dass Sie diesen Lehrer löschen möchten?</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>Abbrechen</Button>
                          <Button variant="destructive" onClick={() => {}}>Löschen</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
    </main>
    </>

  )
}

