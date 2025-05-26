import "./App.css"
import TamaTable from "./components/table.tsx"
import Navigation from "./components/navigation.tsx"
import {useState} from "react"

export default function App() {
    const [displayFilters, setDisplayFilters] = useState<boolean>(false)
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <Navigation setDisplayFilters={setDisplayFilters}/>
            <TamaTable displayFilters={displayFilters}/>
        </div>
    )
}
