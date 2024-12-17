import { Switch, Route } from "wouter";
import { VoteRecorder } from "@/pages/VoteRecorder";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Switch>
        <Route path="/" component={VoteRecorder} />
      </Switch>
    </div>
  );
}

export default App;
