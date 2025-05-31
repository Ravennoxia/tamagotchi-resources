import "./App.css"
import {useState} from "react"
import Navigation from "./components/Navigation.tsx"
import TamaTable from "./components/TamaTable.tsx"

export default function App() {
    const [displayFilters, setDisplayFilters] = useState<boolean>(false)
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <Navigation setDisplayFilters={setDisplayFilters}/>
            <TamaTable displayFilters={displayFilters}/>
        </div>
    )
}
