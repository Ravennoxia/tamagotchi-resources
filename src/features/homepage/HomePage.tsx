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
        </div>
    )
}
