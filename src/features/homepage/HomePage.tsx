import {ROUTES} from "../../global/constants.ts"
import {Link} from "react-router"
import "./HomePage.css"

export default function HomePage() {
    return (
        <div className={"home"}>
            <div className={"item"}>
                <Link to={ROUTES.tamaTable} className={"link"}>
                    All Raisable Tamagotchi Characters
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/tama-table.png"}
                    alt={"All Raisable Tamagotchi Characters"}
                />
            </div>
            <div className={"item"}>
                <Link to={ROUTES.tamaTimeline} className={"link"}>
                    Tamagotchi Device Timeline
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/tama-timeline.png"}
                    alt={"Tamagotchi Device Timeline"}
                />
            </div>
            <div className={"item"}>
                <Link to={ROUTES.bitzeeTable} className={"link"}>
                    Bitzee Magicals Sprites
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/bitzee-table.png"}
                    alt={"Bitzee Magicals Sprites"}
                />
            </div>
        </div>
    )
}
