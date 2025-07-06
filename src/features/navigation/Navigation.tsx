import {Toolbar, ToolbarButton} from "@radix-ui/react-toolbar"
import {type Dispatch, type RefObject, type SetStateAction} from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuSub,
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
    const showFilters = location.pathname === ROUTES.tamaTable
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
                            <Link to={ROUTES.home}>
                                Homepage
                            </Link>
                        </NavigationMenuLink>
                        <Separator className={"separator"}/>
                        <NavigationMenuSub style={{display: "contents"}}>
                            <div className={"nav-sub-label"}>Tamagotchi:</div>
                            <NavigationMenuLink asChild className={"nav-sub-item"}>
                                <Link to={ROUTES.tamaTable}>
                                    {ROUTE_TITLES[ROUTES.tamaTable]}
                                </Link>
                            </NavigationMenuLink>
                            <Separator className={"separator nav-sub-item"}/>
                            <NavigationMenuLink asChild className={"nav-sub-item"}>
                                <Link to={ROUTES.tamaTimeline}>
                                    {ROUTE_TITLES[ROUTES.tamaTimeline]}
                                </Link>
                            </NavigationMenuLink>
                            <Separator className={"separator nav-sub-item"}/>
                            <NavigationMenuLink asChild className={"nav-sub-item"}>
                                <Link to={ROUTES.uniOutfitPlanner}>
                                    {ROUTE_TITLES[ROUTES.uniOutfitPlanner]}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuSub>
                        <Separator className={"separator"}/>
                        <NavigationMenuLink asChild>
                            <Link to={ROUTES.bitzeeTable}>
                                {ROUTE_TITLES[ROUTES.bitzeeTable]}
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
