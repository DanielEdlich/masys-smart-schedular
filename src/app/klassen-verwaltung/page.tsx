'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { AddClassDialog } from '@/components/AddClassDialog'
import { EditClassDialog } from '@/components/EditClassDialog'
import { DeleteConfirmDialog } from '@/components/DeleteClassDialog'
import { useToast } from "@/hooks/use-toast"
import { getClasses, getTeachers, addClass, editClass } from '@/app/actions/classActions'
import { SchoolClass, Teacher } from '@/db/types'
import { Navbar } from '@/components/Navbar'

export default function SchulklassenVerwaltung() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null)
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const classesData = await getClasses()
        const teachersData = await getTeachers()
        setClasses(classesData)
        setTeachers(teachersData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast({
          title: "Fehler beim Laden der Daten",
          description: "Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleAddClass = async (newClass: Omit<SchoolClass, 'id'>) => {
    try {
      const addedClass = await addClass(newClass)
      setClasses(prevClasses => [...prevClasses, addedClass])
      toast({
        title: "Klasse hinzugefügt",
        description: `Neue Klasse ${addedClass.name} wurde erfolgreich hinzugefügt.`,
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to add class:', error)
      toast({
        title: "Fehler beim Hinzufügen der Klasse",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    }
  }

  const handleEditClass = async (updatedClass: SchoolClass) => {
    try {
      await editClass(updatedClass)
      setClasses(prevClasses => prevClasses.map(cls => cls.id === updatedClass.id ? updatedClass : cls))
      setEditingClass(null)
      toast({
        title: "Klasse aktualisiert",
        description: `Klasse ${updatedClass.name} wurde erfolgreich aktualisiert.`,
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to edit class:', error)
      toast({
        title: "Fehler beim Aktualisieren der Klasse",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComplete = () => {
    setClasses(prevClasses => prevClasses.filter(cls => cls.id !== deletingClass?.id))
    setDeletingClass(null)
    router.refresh()
  }

  const getTeacherName = (id: number | null) => {
    if (id === null) return '-'
    const teacher = teachers.find(t => t.id === id)
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unbekannt'
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Laden...</div>
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-16 mt-6">Schulklassen-Verwaltung</h1>
      <div className="mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>Klasse hinzufügen</Button>
        {isAddDialogOpen && (
          <AddClassDialog
            onAddClass={handleAddClass}
            onClose={() => setIsAddDialogOpen(false)}
            teachers={teachers}
          />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Jahrgang</TableHead>
            <TableHead>Zug</TableHead>
            <TableHead>Klassenlehrer</TableHead>
            <TableHead>Co-Klassenlehrer</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.year}</TableCell>
              <TableCell>{cls.track}</TableCell>
              <TableCell>{getTeacherName(cls.primary_teacher_id)}</TableCell>
              <TableCell>{getTeacherName(cls.secondary_teacher_id)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingClass(cls)}
                    className="flex items-center"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingClass(cls)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingClass && (
        <EditClassDialog
          schoolClass={editingClass}
          onEditClass={handleEditClass}
          onCancel={() => setEditingClass(null)}
          teachers={teachers}
        />
      )}

      {deletingClass && (
        <DeleteConfirmDialog
          schoolClass={deletingClass}
          isOpen={!!deletingClass}
          onClose={() => setDeletingClass(null)}
          onDeleteComplete={handleDeleteComplete}
        />
      )}
    </div></>
    
  )
}
