import {Toolbar, ToolbarButton} from "@radix-ui/react-toolbar"
import type {Dispatch, SetStateAction} from "react"

export default function Navigation({setDisplayFilters}: { setDisplayFilters: Dispatch<SetStateAction<boolean>> }) {
    function handleFilterToggle() {
        setDisplayFilters(prevState => !prevState)
    }

    return (
        <Toolbar style={{display: "flex", padding: "5px", gap: "5px", alignItems: "center"}}>
            {//TODO
                /*<NavigationMenu>*/}
            {/*    <NavigationMenuItem className={"nav-item"}>*/}
            {/*        <NavigationMenuTrigger>*/}
            {/*            <HamburgerMenuIcon/>*/}
            {/*        </NavigationMenuTrigger>*/}
            {/*        <NavigationMenuContent className={"nav-content"}>*/}
            {/*            <NavigationMenuLink style={{color: "black"}}>*/}
            {/*                Example link*/}
            {/*            </NavigationMenuLink>*/}
            {/*            <NavigationMenuLink style={{color: "black"}}>*/}
            {/*                This is where I would put links, if I had any*/}
            {/*            </NavigationMenuLink>*/}
            {/*        </NavigationMenuContent>*/}
            {/*    </NavigationMenuItem>*/}
            {/*</NavigationMenu>*/}
            <ToolbarButton onClick={handleFilterToggle}>
                Filters
            </ToolbarButton>
            <strong className={"text-left"}>
                Raven's Tamagotchi resources
            </strong>
        </Toolbar>
    )
}
