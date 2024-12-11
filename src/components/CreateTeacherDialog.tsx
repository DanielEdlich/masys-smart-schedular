'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from 'lucide-react'
import { createTeacher } from '@/app/actions/teacherActions'
import { useToast } from "@/hooks/use-toast"

type Availability = {
  day: string
  von: number
  bis: number
}

export function CreateTeacherDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    priority: 1,
    availability: [{ day: 'Montag', von: 1, bis: 2 }]
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data on empty fields
    if (!validateFormData(formData)) {
      return
    }

    try {
      await createTeacher(formData)
      // Trigger Toast on success
      toast({
        title: "Lehrer erfolgreich angelegt!"
            })
      setOpen(false)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        priority: 1,
        availability: [{ day: 'Montag', von: 1, bis: 2 }]
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Erstellen des Lehrers."
          })  // Trigger Toast on error
    }
    router.refresh()
  }

  const validateFormData = (data: typeof formData): boolean => {
    if (!data.first_name.trim() || !data.last_name.trim() || !data.email.trim()) {
      toast({
        title: "Leere Felder",
        description: "Bitte füllen Sie alle erforderlichen Felder aus (Vorname, Nachname, E-Mail)."
      })
      return false
    }
    return true
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-1">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Vorname
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nachname
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
  )
}
