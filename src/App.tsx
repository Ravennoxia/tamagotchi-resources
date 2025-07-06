import "./App.css"
import {useCallback, useEffect, useRef, useState} from "react"
import Navigation from "./features/navigation/Navigation.tsx"
import {BrowserRouter, Route, Routes} from "react-router"
import {PHONE_BREAKPOINT, ROUTES} from "./global/constants.ts"
import TamaTable from "./features/tamaTable/TamaTable.tsx"
import TamaTimeline from "./features/tamaTimeline/TamaTimeline.tsx"
import BitzeeTable from "./features/bitzee/BitzeeTable.tsx"
import HomePage from "./features/homepage/HomePage.tsx"
import UniOutfitPlanner from "./features/uniOutfitPlanner/UniOutfitPlanner.tsx"

const baseName = import.meta.env.PROD ? "/tamagotchi-resources" : "/"

export default function App() {
    const navRef = useRef<HTMLDivElement>(null)
    const [navHeight, setNavHeight] = useState(0)
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
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight)
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

    useEffect(() => {
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight)
        }
    }, [])

    return (
        <BrowserRouter basename={baseName}>
            <div className={"app-div"}>
                <Navigation
                    navRef={navRef}
                    setDisplayFilters={setDisplayFilters}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}/>
                <Routes>
                    <Route path={ROUTES.home} element={
                        <HomePage/>
                    }
                    />
                    <Route path={ROUTES.tamaTable} element={
                        <TamaTable displayFilters={displayFilters} themeMode={themeMode} isPhone={isPhone}/>
                    }
                    />
                    <Route path={ROUTES.tamaTimeline} element={
                        <TamaTimeline navHeight={navHeight}/>
                    }
                    />
                    <Route path={ROUTES.uniOutfitPlanner} element={
                        <UniOutfitPlanner urlBase={baseName}/>
                    }
                    />
                    <Route path={ROUTES.bitzeeTable} element={
                        <BitzeeTable themeMode={themeMode}/>
                    }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
