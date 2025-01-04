
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

