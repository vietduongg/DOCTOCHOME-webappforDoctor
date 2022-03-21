import "./App.css";
import LoginDemo from "./page/Login";
import Dashboard from "./page/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={LoginDemo} />
      </Router>
      <LoginDemo />
    </div>
  );
}

export default App;
