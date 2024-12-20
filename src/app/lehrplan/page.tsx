import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TeacherAvatar } from "@/components/TeacherAvatar"
import { CreateTeacherDialog } from '@/components/CreateTeacherDialog'
import { EditTeacherDialog } from '@/components/EditTeacherDialog'
import { DeleteTeacherDialog } from '@/components/DeleteTeacherDialog'
import { TeacherBlocker } from '@/components/TeacherBlocker'
import { getAllTeachers } from '@/app/actions/teacherActions'
import { Navbar } from "@/components/Navbar"
import ClassScheduler from '@/components/ClassScheduler';

export default async function Lehrerverwaltung() {

  return (
    <>  
    <Navbar />
    <div className="fixed h-full w-screen">
        <ClassScheduler/>
    </div>
    </>
  )
}

