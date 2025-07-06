import type {TamaTimelineItem} from "../../global/types.ts"
import {CheckIcon} from "@radix-ui/react-icons"
import "./TamaTimeline.css"

export default function TimelineRowItem({item, isLeft, evenYear, showMonth}: {
    item: TamaTimelineItem,
    isLeft: boolean,
    evenYear: boolean,
    showMonth: boolean
}) {
    return (
        <>
            <div className={isLeft ? "timeline-mark mark-left" : "timeline-mark mark-right"}>
            </div>
            <div
                className={"card-container"} style={isLeft ? {alignItems: "flex-end"} : undefined}>
                {showMonth && (
                    <div>
                        {new Date(item.releaseDate).toLocaleDateString("en-US", {month: "long"})}
                    </div>
                )}

                <div className={evenYear ? "card even-year-card" : "card"}
                     style={{alignItems: isLeft ? "flex-end" : "flex-start"}}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.hasOther && (
                            isLeft ?
                                <>
                                    {item.name}
                                    <CheckIcon className={"check-icon"} style={{paddingLeft: "5px"}}/>
                                </> :
                                <>
                                    <CheckIcon className={"check-icon"} style={{paddingRight: "5px"}}/>
                                    {item.name}
                                </>
                        )}
                        {!item.hasOther && (item.name)}
                    </a>
                    {item.text &&
                        <div className={"card-sub-text"}>{item.text}</div>
                    }
                    <img
                        className={"card-image"}
                        src={import.meta.env.BASE_URL + "tamagotchi-device-images/" + item.image}
                        alt={item.name}
                    />
                </div>
            </div>
        </>
    )
}
