"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { TeacherAvatar } from "@/components/TeacherAvatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const initialTeachers: Teacher[] = [
  {
    id: 1,
    firstName: "Max",
    lastName: "Mustermann",
    email: "max.mustermann@schule.de",
    phone: "0123456789",
    priority: 1,
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
    priority: 2,
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
    priority: 3,
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
    priority: 1,
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
    priority: 2,
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
    priority: 3,
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
    priority: 1,
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
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const handleCreateTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const id = Math.max(...teachers.map(t => t.id)) + 1
    setTeachers([...teachers, { ...newTeacher, id }])
  }

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t))
    setEditingTeacher(null)
  }

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter(t => t.id !== id))
  }

  return (
    <>
    <Navbar />

    <div className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Lehrerverwaltung</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          Willkommen bei der Lehrerverwaltung. Verwalten Sie hier alle Lehrer-Daten.
        </p>
        
        <CreateTeacherDialog onCreateTeacher={handleCreateTeacher} />
        
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
                    <EditTeacherDialog teacher={teacher} onUpdateTeacher={handleUpdateTeacher} />
                    <DeleteTeacherDialog teacher={teacher} onDeleteTeacher={handleDeleteTeacher} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>

    </>
  )
}

function CreateTeacherDialog({ onCreateTeacher }: { onCreateTeacher: (teacher: Omit<Teacher, 'id'>) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    priority: 1,
    availability: [{ day: 'Montag', von: 1, bis: 2 }]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateTeacher(formData)
    setOpen(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      priority: 1,
      availability: [{ day: 'Montag', von: 1, bis: 2 }]
    })
  }

  const handleAvailabilityChange = (index: number, field: keyof Availability, value: string | number) => {
    const newAvailability = [...formData.availability]
    newAvailability[index] = { ...newAvailability[index], [field]: value }
    setFormData({ ...formData, availability: newAvailability })
  }

  const addAvailability = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: 'Montag', von: 1, bis: 2 }]
    })
  }

  const removeAvailability = (index: number) => {
    const newAvailability = formData.availability.filter((_, i) => i !== index)
    setFormData({ ...formData, availability: newAvailability })
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6 bg-green-500 hover:bg-green-600">
          <PlusCircle className="mr-2 h-4 w-4" />
          Erstellung eines neuen Lehrers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Neuen Lehrer erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Vorname
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nachname
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorität
              </Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wählen Sie eine Priorität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              <Label>Verfügbarkeit</Label>
              {formData.availability.map((availability, index) => (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Select
                    value={availability.day}
                    onValueChange={(value) => handleAvailabilityChange(index, 'day', value)}
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
                    type="number"
                    value={availability.von}
                    onChange={(e) => handleAvailabilityChange(index, 'von', parseInt(e.target.value))}
                    min={1}
                    max={10}
                  />
                  <Input
                    type="number"
                    value={availability.bis}
                    onChange={(e) => handleAvailabilityChange(index, 'bis', parseInt(e.target.value))}
                    min={1}
                    max={10}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeAvailability(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
        <DialogFooter className="flex justify-between mt-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={addAvailability}>
            Verfügbarkeit hinzufügen
          </Button>
          <Button type="submit" onClick={handleSubmit}>Erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

function EditTeacherDialog({ teacher, onUpdateTeacher }: { teacher: Teacher, onUpdateTeacher: (teacher: Teacher) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(teacher)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateTeacher(formData)
    setOpen(false)
  }

  const handleAvailabilityChange = (index: number, field: keyof Availability, value: string | number) => {
    const newAvailability = [...formData.availability]
    newAvailability[index] = { ...newAvailability[index], [field]: value }
    setFormData({ ...formData, availability: newAvailability })
  }

  const addAvailability = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: 'Montag', von: 1, bis: 2 }]
    })
  }

  const removeAvailability = (index: number) => {
    const newAvailability = formData.availability.filter((_, i) => i !== index)
    setFormData({ ...formData, availability: newAvailability })
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Lehrer bearbeiten</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Vorname
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nachname
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorität
              </Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wählen Sie eine Priorität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4">
              <Label>Verfügbarkeit</Label>
              {formData.availability.map((availability, index) => (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Select
                    value={availability.day}
                    onValueChange={(value) => handleAvailabilityChange(index, 'day', value)}
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
                    type="number"
                    value={availability.von}
                    onChange={(e) => handleAvailabilityChange(index, 'von', parseInt(e.target.value))}
                    min={1}
                    max={10}
                  />
                  <Input
                    type="number"
                    value={availability.bis}
                    onChange={(e) => handleAvailabilityChange(index, 'bis', parseInt(e.target.value))}
                    min={1}
                    max={10}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeAvailability(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
        <DialogFooter className="flex justify-between mt-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={addAvailability}>
            Verfügbarkeit hinzufügen
          </Button>
          <Button type="submit">Aktualisieren</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

function DeleteTeacherDialog({ teacher, onDeleteTeacher }: { teacher: Teacher, onDeleteTeacher: (id: number) => void }) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    onDeleteTeacher(teacher.id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <p className="font-semibold">{`${teacher.firstName} ${teacher.lastName}`}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button variant="destructive" onClick={handleDelete}>Löschen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

