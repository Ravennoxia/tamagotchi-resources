import {Toolbar, ToolbarButton} from "@radix-ui/react-toolbar"
import {type Dispatch, type SetStateAction} from "react"
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
import {routes} from "../../global/constants.ts"
import {Switch, SwitchThumb} from "@radix-ui/react-switch"

export default function Navigation({setDisplayFilters, isDarkMode, setIsDarkMode}: {
    setDisplayFilters: Dispatch<SetStateAction<boolean>>,
    isDarkMode: boolean,
    setIsDarkMode: Dispatch<SetStateAction<boolean>>
}) {

    const location = useLocation()
    const showFilters = location.pathname === routes.tamaTable || location.pathname === routes.home

    function handleFilterToggle() {
        setDisplayFilters(prevState => !prevState)
    }

    function handleDarkModeToggle(checked: boolean) {
        setIsDarkMode(checked)
    }

    return (
        <Toolbar className={"nav-css"}>
            <NavigationMenu>
                <NavigationMenuItem style={{listStyle: "none"}}>
                    <NavigationMenuTrigger>
                        <HamburgerMenuIcon/>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className={"nav-content"}>
                        <NavigationMenuLink asChild>
                            <Link to={routes.home}>
                                All Raisable Tamagotchi Characters
                            </Link>
                        </NavigationMenuLink>
                        <Separator className={"separator"}/>
                        More will come in the future...
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenu>
            {showFilters && (
                <ToolbarButton onClick={handleFilterToggle}>
                    Filters
                </ToolbarButton>
            )}
            <strong className={"title-css"}>
                Raven's Tamagotchi resources
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
