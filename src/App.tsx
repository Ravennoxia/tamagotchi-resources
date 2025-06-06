import "./App.css"
import {useState} from "react"
import Navigation from "./components/Navigation.tsx"
import {BrowserRouter, Route, Routes} from "react-router"
import TamaTable from "./components/TamaTable.tsx"
import TamaTimeline from "./components/TamaTimeline.tsx"
import {routes} from "./data/InterfacesAndConsts.tsx"

const baseName = import.meta.env.PROD ? "/tamagotchi-resources" : "/"

export default function App() {
    const [displayFilters, setDisplayFilters] = useState<boolean>(false)
    return (
        <BrowserRouter basename={baseName}>
            <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Navigation setDisplayFilters={setDisplayFilters}/>
                <Routes>
                    <Route path={routes.home} element={
                        <TamaTable displayFilters={displayFilters}/>
                    }
                    />
                    <Route path={routes.tamaTable} element={
                        <TamaTable displayFilters={displayFilters}/>
                    }
                    />
                    <Route path={routes.tamaTimeline} element={
                        <TamaTimeline/>
                    }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
