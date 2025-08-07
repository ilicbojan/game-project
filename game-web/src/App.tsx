import "./App.css";
import Game from "./components/Game/Game";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer aria-label="Toast notifications" />
      <Game />
    </div>
  );
}

export default App;
