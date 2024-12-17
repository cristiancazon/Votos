import { Switch, Route } from "wouter";
import { VoteRecorder } from "@/pages/VoteRecorder";

function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2C4A6E] text-white p-4 mb-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Sistema de Registro de Votos</h1>
        </div>
        <Switch>
          <Route path="/" component={VoteRecorder} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
