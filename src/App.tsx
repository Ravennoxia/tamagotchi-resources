import "./App.css"
import {useCallback, useEffect, useState} from "react"
import Navigation from "./features/navigation/Navigation.tsx"
import {BrowserRouter, Route, Routes} from "react-router"
import TamaTable from "./features/tamaTable/TamaTable.tsx"
import TamaTimeline from "./features/tamaTimeline/TamaTimeline.tsx"
import {PHONE_BREAKPOINT, routes} from "./global/constants.ts"
import BitzeeTable from "./features/bitzee/BitzeeTable.tsx"

const baseName = import.meta.env.PROD ? "/tamagotchi-resources" : "/"

export default function App() {
    const [isPhone, setIsPhone] = useState<boolean>(window.innerWidth < PHONE_BREAKPOINT)
    const [themeMode, setThemeMode] = useState<string>("dark")
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

    const handleResize = useCallback(() => {
        const newIsPhone = window.innerWidth < PHONE_BREAKPOINT
        if (newIsPhone !== isPhone) {
            setIsPhone(newIsPhone)
        }
    }, [isPhone])

    useEffect(() => {
        if (isDarkMode) {
            setThemeMode("dark")
        } else {
            setThemeMode("light")
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [isDarkMode, handleResize])

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
                        <TamaTable displayFilters={displayFilters} themeMode={themeMode} isPhone={isPhone}/>
                    }
                    />
                    <Route path={routes.tamaTable} element={
                        <TamaTable displayFilters={displayFilters} themeMode={themeMode} isPhone={isPhone}/>
                    }
                    />
                    <Route path={routes.tamaTimeline} element={
                        <TamaTimeline/>
                    }
                    />
                    <Route path={routes.bitzeeTable} element={
                        <BitzeeTable themeMode={themeMode}/>
                    }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
