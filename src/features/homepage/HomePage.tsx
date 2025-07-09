import {ROUTE_TITLES, ROUTES} from "../../global/constants.ts"
import {Link} from "react-router"
import "./HomePage.css"

export default function HomePage() {
    return (
        <div className={"home"}>
            <div className={"item"}>
                <Link to={ROUTES.tamaTable} className={"link"}>
                    {ROUTE_TITLES[ROUTES.tamaTable]}
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/tama-table.png"}
                    alt={ROUTE_TITLES[ROUTES.tamaTable]}
                />
            </div>
            <div className={"item"}>
                <Link to={ROUTES.tamaTimeline} className={"link"}>
                    {ROUTE_TITLES[ROUTES.tamaTimeline]}
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/tama-timeline.png"}
                    alt={ROUTE_TITLES[ROUTES.tamaTimeline]}
                />
            </div>
            <div className={"item"}>
                <Link to={ROUTES.uniOutfitPlanner} className={"link"}>
                    {ROUTE_TITLES[ROUTES.uniOutfitPlanner]}
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/uni-outfit-planner.png"}
                    alt={ROUTE_TITLES[ROUTES.uniOutfitPlanner]}
                />
            </div>
            <div className={"item"}>
                <Link to={ROUTES.bitzeeTable} className={"link"}>
                    {ROUTE_TITLES[ROUTES.bitzeeTable]}
                </Link>
                <img
                    className={"image"}
                    src={import.meta.env.BASE_URL + "pages/bitzee-table.png"}
                    alt={ROUTE_TITLES[ROUTES.bitzeeTable]}
                />
            </div>
            <div className={"item"}>
                <div style={{fontWeight: "bold"}}>Planned Features</div>
                <ul  style={{textAlign: "left"}}>
                    <li>Uni Room Planner</li>
                    <li>Compilation of external tama resources</li>
                    <li>Table of alternate forms</li>
                    <li>Raisable characters on other tamas</li>
                    <li>All Raisable Digimon Characters</li>
                </ul>
            </div>
            <div className={"item"}>
                <div style={{fontWeight: "bold"}}>Contact me</div>
                <div style={{textAlign: "left"}}>
                    <div className={"contact-grid"}>
                        <div>Email:</div>
                        <div><a href={"mailto:github.raven@gmail.com"}>github.raven@gmail.com</a></div>
                        <div>Discord:</div>
                        <div>If we are in the same server, feel free to @ me or DM me</div>
                        <div>Github:</div>
                        <div>
                            <a href={"https://github.com/Ravennoxia/tamagotchi-resources/issues"}
                               target="_blank"
                               rel="noopener noreferrer">link</a>
                        </div>
                    </div>
                    <ul>
                        <li>feature request</li>
                        <li>bug report</li>
                        <li>wrong or missing info</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
