import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="bg-yellow-300 text-black p-2 text-center">
      <p className="text-sm font-medium">
        🚧 Diese Anwendung befindet sich noch im Aufbau. Wir arbeiten hart daran, sie für Sie fertigzustellen! 🚧
      </p>
    </div>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-4 lg:px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center" href="#">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">SmartSchedular</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="#start">Start</Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="#features">Funktionen</Link>
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="#green-code">Green Code</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white">
                  Effiziente Stundenplanung mit SmartSchedular
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Optimieren Sie die Verteilung von Unterrichtsblöcken durch unseren effizienten Algorithmus. Speziell entwickelt für Planungsverantwortliche in Bildungseinrichtungen.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-gray-900 dark:text-white">Geplante Funktionen</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: Calendar, title: "Algorithmus-basierte Planung", description: "Optimale Verteilung von Unterrichtsblöcken durch fortschrittliche Algorithmen." },
                { icon: Clock, title: "Zeitersparnis", description: "Reduzieren Sie den Planungsaufwand erheblich durch automatisierte Prozesse." },
                { icon: Users, title: "Für Planungsexperten", description: "Speziell entwickelt für die Bedürfnisse von Planungsverantwortlichen in Bildungseinrichtungen." }
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <feature.icon className="h-12 w-12 mb-2 text-primary" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id='green-code' className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-800 dark:text-green-100">Unser Beitrag zum Green Coding</h2>
              <p className="mx-auto max-w-[700px] text-green-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-green-200">
                Bei der Entwicklung von SmartSchedular setzen wir auf Green Coding-Praktiken, um ressourceneffiziente und umweltfreundliche Software zu schaffen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 HTW Berlin.</p>
        </div>
      </footer>
    </div>
  )
}

