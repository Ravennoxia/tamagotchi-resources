import {Toolbar, ToolbarButton} from "@radix-ui/react-toolbar"
import {type Dispatch, type RefObject, type SetStateAction} from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu"
import {HamburgerMenuIcon, MoonIcon, SunIcon} from "@radix-ui/react-icons"
import {Link, useLocation} from "react-router"
import {Separator} from "@radix-ui/react-separator"
import "./Navigation.css"
import {ROUTE_TITLES, ROUTES} from "../../global/constants.ts"
import {Switch, SwitchThumb} from "@radix-ui/react-switch"

export default function Navigation({navRef, setDisplayFilters, isDarkMode, setIsDarkMode}: {
    navRef: RefObject<HTMLDivElement | null>
    setDisplayFilters: Dispatch<SetStateAction<boolean>>,
    isDarkMode: boolean,
    setIsDarkMode: Dispatch<SetStateAction<boolean>>
}) {

    const location = useLocation()
    const showFilters = location.pathname === ROUTES.tamaTable || location.pathname === ROUTES.home
    const currentTitle = ROUTE_TITLES[location.pathname] || "Raven's Tamagotchi Resources"

    function handleFilterToggle() {
        setDisplayFilters(prevState => !prevState)
    }

    function handleDarkModeToggle(checked: boolean) {
        setIsDarkMode(checked)
    }

    return (
        <Toolbar ref={navRef} className={"nav-css"}>
            <NavigationMenu>
                <NavigationMenuItem style={{listStyle: "none"}}>
                    <NavigationMenuTrigger>
                        <HamburgerMenuIcon/>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className={"nav-content"}>
                        <NavigationMenuLink asChild>
                            <Link to={ROUTES.tamaTable}>
                                All Raisable Tamagotchi Characters
                            </Link>
                        </NavigationMenuLink>
                        <Separator className={"separator"}/>
                        <NavigationMenuLink asChild>
                            <Link to={ROUTES.tamaTimeline}>
                                Tamagotchi Device Timeline
                            </Link>
                        </NavigationMenuLink>
                        <Separator className={"separator"}/>
                        <NavigationMenuLink asChild>
                            <Link to={ROUTES.bitzeeTable}>
                                Bitzee Magicals Sprites
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenu>
            {showFilters && (
                <ToolbarButton onClick={handleFilterToggle}>
                    Filters
                </ToolbarButton>
            )}
            <strong className={"title-css"}>
                {currentTitle}
            </strong>
            <div className={"switch-parent"}>
                <SunIcon/>
                <Switch className={"switch-root"} checked={isDarkMode} onCheckedChange={handleDarkModeToggle}>
                    <SwitchThumb className={"switch-thumb"}/>
                </Switch>
                <MoonIcon/>
            </div>
        </Toolbar>
    )
}
