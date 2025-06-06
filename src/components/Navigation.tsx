import {Toolbar, ToolbarButton} from "@radix-ui/react-toolbar"
import type {Dispatch, SetStateAction} from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu"
import {HamburgerMenuIcon} from "@radix-ui/react-icons"
import {Link, useLocation} from "react-router"
import {routes} from "../data/InterfacesAndConsts.tsx"
import {Separator} from "@radix-ui/react-separator"

export default function Navigation({setDisplayFilters}: { setDisplayFilters: Dispatch<SetStateAction<boolean>> }) {
    const location = useLocation()

    function handleFilterToggle() {
        setDisplayFilters(prevState => !prevState)
    }

    const showFilters = location.pathname === routes.tamaTable || location.pathname === routes.home

    return (
        <Toolbar style={{display: "flex", padding: "5px", gap: "5px", alignItems: "center"}}>
            <NavigationMenu>
                <NavigationMenuItem className={"nav-item"}>
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
            <strong className={"text-left"}>
                Raven's Tamagotchi resources
            </strong>
        </Toolbar>
    )
}
