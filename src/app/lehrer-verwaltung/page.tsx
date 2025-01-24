import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { TeacherAvatar } from "@/components/lehrer-verwaltung/TeacherAvatar";
import { CreateTeacherDialog } from "@/components/lehrer-verwaltung/CreateTeacherDialog";
import { EditTeacherDialog } from "@/components/lehrer-verwaltung/EditTeacherDialog";
import { DeleteTeacherDialog } from "@/components/lehrer-verwaltung/DeleteTeacherDialog";
import { TeacherBlocker } from "@/components/lehrer-verwaltung/TeacherBlocker";
import { getAllTeachers } from "@/app/actions/teacherActions";
import { Navbar } from "@/components/Navbar";

export default async function Lehrerverwaltung() {
  const teachersWithBlocker = await getAllTeachers();
  
  return (
    <>
      <Navbar/>
      <div className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-5xl font-bold">Lehrerverwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Willkommen bei der Lehrerverwaltung. Verwalten Sie hier alle
            Lehrer-Daten.
          </p>
          
          <CreateTeacherDialog data-cy="create-teacher-dialog"/>
          
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
              {teachersWithBlocker.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <TeacherAvatar
                      first_name={teacher.first_name}
                      last_name={teacher.last_name}
                      color={teacher.color}
                    />
                  </TableCell>
                  <TableCell>{`${teacher.first_name} ${teacher.last_name}`}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{teacher.priority}</TableCell>
                  <TableCell>
                    <TeacherBlocker blocker={teacher.blocker}/>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <EditTeacherDialog teacher={teacher}/>
                      <DeleteTeacherDialog teacher={teacher}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
    </>
  );
}
