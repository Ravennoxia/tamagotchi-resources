import "./App.css"
import {useEffect, useState} from "react"
import Navigation from "./features/navigation/Navigation.tsx"
import {BrowserRouter, Route, Routes} from "react-router"
import TamaTable from "./features/tamaTable/TamaTable.tsx"
import TamaTimeline from "./features/tamaTimeline/TamaTimeline.tsx"
import {routes} from "./global/constants.ts"

const baseName = import.meta.env.PROD ? "/tamagotchi-resources" : "/"

export default function App() {
    const [displayFilters, setDisplayFilters] = useState<boolean>(false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("theme")
        if (savedMode === "dark") {
            return true
        }
        if (savedMode === "light") {
            return false
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    })

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleSystemThemeChange = (event: MediaQueryListEvent) => {
            setIsDarkMode(event.matches)
        }

        mediaQuery.addEventListener("change", handleSystemThemeChange)

        const htmlElement = document.documentElement
        if (isDarkMode) {
            htmlElement.setAttribute("data-theme", "dark")
            localStorage.setItem("theme", "dark")
        } else {
            htmlElement.setAttribute("data-theme", "light")
            localStorage.setItem("theme", "light")
        }
        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange)
        }
    }, [isDarkMode])

    return (
        <BrowserRouter basename={baseName}>
            <div className={"app-div"}>
                <Navigation setDisplayFilters={setDisplayFilters}
                            isDarkMode={isDarkMode}
                            setIsDarkMode={setIsDarkMode}/>
                <Routes>
                    <Route path={routes.home} element={
                        <TamaTable displayFilters={displayFilters} isDarkMode={isDarkMode}/>
                    }
                    />
                    <Route path={routes.tamaTable} element={
                        <TamaTable displayFilters={displayFilters} isDarkMode={isDarkMode}/>
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
