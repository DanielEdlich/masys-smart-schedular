'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { deleteClass } from '@/app/actions/classActions'
import { useToast } from "@/hooks/use-toast"
import { SchoolClass } from '@/db/types'


type DeleteConfirmDialogProps = {
  schoolClass: SchoolClass
  isOpen: boolean
  onClose: () => void
  onDeleteComplete: () => void
}

export function DeleteConfirmDialog({ schoolClass, isOpen, onClose, onDeleteComplete }: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteClass(schoolClass.id)
      toast({
        title: "Klasse erfolgreich gelöscht!",
        description: `Die Klasse ${schoolClass.name} wurde gelöscht.`
      })
      onDeleteComplete()
    } catch (error) {
      console.error('Failed to delete class:', error)
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen der Klasse.",
        description: "Bitte versuchen Sie es später erneut."
      })
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Klasse löschen</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Sind Sie sicher, dass Sie diese Klasse löschen möchten?</p>
          <p className="font-semibold">{schoolClass.name}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Löschen...' : 'Löschen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}