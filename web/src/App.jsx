import { Button } from "@/components/ui/button"
import NavBar from "./components/NavBar"
import Inicio from "./screens/Inicio"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <NavBar/>
      <Inicio/>
    </div>
  )
}

export default App