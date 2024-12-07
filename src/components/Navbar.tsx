import Link from 'next/link'
import { Calendar } from 'lucide-react'


export const Navbar = () => {
    
    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-4 lg:px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">SmartSchedular</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="/">Start</Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="/lehrer-verwaltung">Lehrerverwaltung</Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="/#green-code">Green Code</Link>
          </nav>
        </div>
      </header>
    )
}