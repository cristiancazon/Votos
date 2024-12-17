import { Switch, Route, Link } from "wouter";
import { VoteRecorder } from "@/pages/VoteRecorder";
import { Dashboard } from "@/pages/Dashboard";
import { TableResults } from "@/pages/TableResults";

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2C4A6E] text-white p-4 mb-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Sistema de Registro de Votos</h1>
          <nav className="flex justify-center space-x-4">
            <Link href="/">
              <a className="hover:text-gray-300 transition-colors">Cargar Votos</a>
            </Link>
            <Link href="/dashboard">
              <a className="hover:text-gray-300 transition-colors">Ver Resumen</a>
            </Link>
            <Link href="/table">
              <a className="hover:text-gray-300 transition-colors">Consultar Mesa</a>
            </Link>
          </nav>
        </div>
        <Switch>
          <Route path="/" component={VoteRecorder} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/table" component={TableResults} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
