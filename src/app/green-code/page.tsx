import { Navbar } from "@/components/Navbar";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GreenCodingPage() {
  return (
    <>
      <Navbar />
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-900"
        id="green-coding"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <h3 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Green Coding
          </h3>
        </div>

        <div className="mx-auto max-w-[800px]">
          <p className="mb-4 text-lg ">
            <strong>Green Coding</strong>, auch bekannt als umweltfreundliche
            oder nachhaltige Softwareentwicklung, bezeichnet die Praxis,
            Software so zu entwickeln, dass der Energieverbrauch und die
            Umweltbelastungen, die durch den Betrieb der Software entstehen,
            minimiert werden. Das Ziel von Green Coding ist es, den ökologischen
            Fußabdruck der Software zu reduzieren.
          </p>
          <p className="mb-4 text-lg ">Es umfasst Strategien wie:</p>
          <div className="ml-6">
            <ol className="list-outside list-decimal space-y-2 tspace-x-4 text-lg ">
              <li>
                <strong>Effiziente Algorithmen:</strong> Auswahl und
                Implementierung von Algorithmen, die weniger Rechenleistung und
                Speicher benötigen.
              </li>
              <li>
                <strong>Ressourcenoptimierung:</strong> Minimierung der Nutzung
                von Hardware-Ressourcen, z.B. durch Reduzierung der CPU-Last,
                Speicherkonsum und Festplattenzugriffe.
              </li>
              <li>
                <strong>Nutzung von erneuerbarer Energie:</strong> Planung und
                Betrieb von Datenzentren und Servern, die erneuerbare
                Energiequellen nutzen.
              </li>
              <li>
                <strong>Verlängerte Lebensdauer von Hardware:</strong> Software
                so entwickeln, dass sie nicht frühzeitige Hardware-Updates oder
                -Ersetzungen erforderlich macht.
              </li>
              <li>
                <strong>Virtuelle und Cloud-Technologien:</strong> Nutzen von
                Virtualisierung und Cloud-Computing-Techniken, um Ressourcen
                effizient zu nutzen und Energie zu sparen.
              </li>
              <li>
                <strong>Energiemanagement:</strong> Implementierung von
                Energiemanagement-Techniken wie Sleep-Modus, Abschaltung
                inaktiver Teile von Anwendungen usw.
              </li>
            </ol>
          </div>
          <p className="mt-4 text-lg ">
            Green Coding ist ein wichtiger Bestandteil der Bemühungen zur
            Reduzierung des CO₂-Ausstoßes im IT-Sektor und trägt zur Förderung
            einer nachhaltigeren digitalen Welt bei.
          </p>
        </div>
      </section>
      <section
        className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-500 to-purple-600"
        id="practices"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <h3 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-300">
            Verfahren
          </h3>
        </div>

        <div className="mx-auto max-w-[800px] text-gray-300">
          <p className="mb-4 text-lg ">
            Um eine werden während der Entwicklung folgende Maßnahmen verwendet:
          </p>
          <p className="mb-4 ml-4 text-lg">
            <strong>Geringe Netzwerkkommunikation</strong>
            <div className="ml-4">
              <strong>Kleine Applikation:</strong> Entwickeln und Implementieren
              einer Anwendung, die schlank und effizient gestaltet ist, um den
              Datenfluss im Netzwerk zu minimieren. Fokus auf essentielle
              Funktionen, um unnötige Last zu vermeiden.
            </div>
            <div className="ml-4">
              <strong>Wenige Bibliotheken:</strong> Reduzieren der Anzahl der
              verwendeten Bibliotheken in der Softwareentwicklung, um
              Speicherbedarf und Abhängigkeiten zu minimieren, was zu einer
              schnelleren und ressourcenschonenderen Netzwerkkommunikation
              führt.
            </div>
          </p>
          <p className="mb-4 ml-4 text-lg ">
            <strong>Energieeffiziente Services</strong>
            <div className="ml-4">
              <strong>Verringerung der verwendeten Services:</strong> Bewusste
              Reduzierung der eingesetzten IT-Dienste, um den Energieverbrauch
              zu senken. Fokus auf die Nutzung der notwendigsten Services.
            </div>
            <div className="ml-4">
              <strong>Keine SQL-Datenbank-Services:</strong> Verzicht auf
              traditionelle SQL-Datenbanken zugunsten energieeffizienterer
              Speicherlösungen wie NoSQL- oder In-Memory-Datenbanken, die
              weniger Ressourcen verbrauchen.
            </div>
            <div className="ml-4">
              <strong>Keine umfangreichen Authentifizierungsservices:</strong>{" "}
              Simplifizierung der Authentifizierungsprozesse, um komplexe und
              ressourcenintensive Authentifizierungsdienste zu vermeiden, die
              sowohl Rechenleistung als auch Zeit beanspruchen.
            </div>
          </p>
          <p className="mb-4 ml-4 text-lg ">
            <strong>Kundenorientierung</strong>
            <div className="ml-4">
              <strong>Regelmäßige Kommunikation und Feedback: </strong>{" "}
              Einrichtung regelmäßiger Kommunikationskanäle mit Kunden zur
              Abfrage und Integration von Feedback. Dies hilft, die
              Dienstleistung auf die Bedürfnisse der Kunden abzustimmen und
              deren Zufriedenheit zu erhöhen, während gleichzeitig unnötige
              Funktionen vermieden werden.
            </div>
          </p>
        </div>

        <div className="mt-4 mx-auto max-w-[800px] text-gray-300">
          <p className="mb-4 text-lg ">
            <strong>
              Testvorgehen für die nachhaltige Erfassung der Daten:
            </strong>
          </p>
          <p className="mb-4 ml-4 text-lg ">
            <strong>
              Testvorgehen für die nachhaltige Erfassung der Daten:
            </strong>
            <div className="ml-4">
              <strong>Definieren von Standardaktionen: </strong> Identifizieren
              und Festlegen von Standardaktionen, die regelmäßig durchgeführt
              werden, um die Funktionsfähigkeit des Systems zu überprüfen.
              Beispielsweise könnte dies das Anlegen neuer Lehrkräfte in einem
              Bildungssystem umfassen.
            </div>
          </p>
          <p className="mb-4 ml-4 text-lg ">
            <strong>Anlegen von automatisierten Testfällen: </strong>
            <div className="ml-4">
              <strong>Definieren von Standardaktionen: </strong> Entwicklung und
              Implementierung automatisierter Testfälle, die die definierten
              Standardaktionen effizient prüfen. Dies ermöglicht eine
              kontinuierliche und ressourcensparende Überwachung und stellt
              sicher, dass Daten korrekt erfasst und verarbeitet werden.
              Automatisierte Tests sind eine nachhaltige Methode, um die
              Integrität und Funktionalität der Anwendungen regelmäßig zu
              validieren, ohne umfangreiche manuelle Tests durchführen zu
              müssen.
            </div>
          </p>
        </div>
      </section>
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        id="test-cases"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <h3 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Messungen
          </h3>
        </div>

        <div className="mx-auto max-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Seite</TableHead>
                <TableHead>Funktion</TableHead>
                <TableHead>CPU Nutzung</TableHead>
                <TableHead>Energie Nutzung</TableHead>
                <TableHead>CO₂-Ausstoß</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/*Lehervewaltung*/}
              <TableRow>
                <TableCell colSpan={2}>Lehrerverwaltung</TableCell>
                <TableCell>23708 ms</TableCell>
                <TableCell>0.014246298375926468 mJ</TableCell>
                <TableCell>1.852018789 mg</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Lehrer erstellen</TableCell>
                <TableCell>293 ms</TableCell>
                <TableCell>0.00037696336550294043 mJ</TableCell>
                <TableCell>0.049005238 mg</TableCell>
              </TableRow>{" "}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Lehrer bearbeiten</TableCell>
                <TableCell>376 ms</TableCell>
                <TableCell>0.00032422978126416517 mJ</TableCell>
                <TableCell>0.042149872 mg</TableCell>
              </TableRow>{" "}
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Lehrer löschen</TableCell>
                <TableCell>330 ms</TableCell>
                <TableCell>0.0003205894660069391 mJ</TableCell>
                <TableCell>0.041676631 mg</TableCell>
              </TableRow>
              {/*Klassenverwaltung*/}
              {/*
              <TableRow>
                <TableCell colSpan={2}>Klassenverwaltung</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Klasse erstellen</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow> <TableRow>
              <TableCell></TableCell>
              <TableCell>Klasse bearbeiten</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow> <TableRow>
              <TableCell></TableCell>
              <TableCell>Klasse löschen</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>*/}
            </TableBody>
          </Table>
        </div>
      </section>
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-teal-800"
        id="Oaklean"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <h3 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl  text-white">
            Oaklean
          </h3>
        </div>

        <p className="text-lg mx-auto max-w-[800px] text-white">
          <a target="_blank" href="https://www.oaklean.io/">
            Oaklean
          </a>{" "}
          ist eine bahnbrechende Softwarelösung, die Entwicklern hilft, den
          Energieverbrauch von NodeJS-Anwendungen zu visualisieren und zu
          optimieren. Durch eine innovative VSCode-Erweiterung und eine
          Integration in Test-Frameworks identifiziert das System
          energieintensive Code-Abschnitte und schlägt umweltfreundliche
          Alternativen vor. Ziel ist es, das Bewusstsein für einen
          verantwortungsvollen Umgang mit Ressourcen in der Softwareentwicklung
          zu schärfen, um so sowohl ökologische als auch ökonomische Vorteile zu
          erzielen.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 flex items-center gap-2"
          >
            <a
              href={`https://github.com/hitabisgmbh/oaklean`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Github className="h-4 w-4" />
              <span className="text-lg">View on GitHub</span>
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
