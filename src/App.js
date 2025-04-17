import { useState } from "react";
import LandingPage from "./Components/LandingPage";
import SignDetector from "./Components/SignDetector";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? <SignDetector /> : <LandingPage onStart={() => setStarted(true)} />}
    </>
  );
}

export default App;
