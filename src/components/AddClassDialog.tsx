'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SchoolClass, Teacher } from '@/db/types'


type AddClassDialogProps = {
  onAddClass: (newClass: Omit<SchoolClass, 'id'>) => Promise<void>
  onClose: () => void
  teachers: Teacher[]
}

export function AddClassDialog({ onAddClass, onClose, teachers }: AddClassDialogProps) {
  const [newClass, setNewClass] = useState<Omit<SchoolClass, 'id'>>({
    name: '',
    year: '',
    track: 'A',
    primary_teacher_id: 0,
    secondary_teacher_id: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewClass({ 
      ...newClass, 
      [name]: name.includes('teacher') 
        ? (value === 'null' ? null : parseInt(value)) 
        : value 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onAddClass(newClass)
      onClose()
    } catch (error) {
      console.error('Failed to add class:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Klasse hinzufügen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Klassenname"
            value={newClass.name}
            onChange={handleInputChange}
            required
          />
          <Input
            name="year"
            placeholder="Jahrgang (z.B. 1-3, 4-6)"
            value={newClass.year ?? ''}
            onChange={handleInputChange}
          />
          <Select
            name="track"
            value={newClass.track}
            onValueChange={(value) => handleSelectChange('track', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Zug auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Zug A</SelectItem>
              <SelectItem value="B">Zug B</SelectItem>
            </SelectContent>
          </Select>
          <Select
            name="primary_teacher_id"
            value={newClass.primary_teacher_id.toString()}
            onValueChange={(value) => handleSelectChange('primary_teacher_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Klassenlehrer auswählen" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {`${teacher.first_name} ${teacher.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="secondary_teacher_id"
            value={newClass.secondary_teacher_id?.toString() ?? 'null'}
            onValueChange={(value) => handleSelectChange('secondary_teacher_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Co-Klassenlehrer auswählen (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Keiner</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {`${teacher.first_name} ${teacher.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Hinzufügen...' : 'Klasse hinzufügen'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

