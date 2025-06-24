import {useEffect, useState} from "react"
import type {TamaTimelineItem} from "../../global/types.ts"
import "./TamaTimeline.css"
import "react-vertical-timeline-component/style.min.css"

export function TamaTimeline() {
    const [data, setData] = useState<TamaTimelineItem[] | null>(null)
    const [asiaTamas, setAsiaTamas] = useState<TamaTimelineItem[] | null>(null)
    const [intTamas, setIntTamas] = useState<TamaTimelineItem[] | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "tamagotchi-timeline.json")
                if (!response.ok) {
                    const errorMessage = `HTTP error! status: ${response.status}`
                    console.error("Failed to fetch data:", errorMessage)
                    setData([])
                    return
                }
                setData(await response.json())
            } catch (e) {
                console.error("An unexpected error occurred while fetching data:", e)
                setData([])
            }
        }

        fetchData().then()
    }, [])

    useEffect(() => {
        if (data) {
            setAsiaTamas(data.filter(item => item.region === "asia").sort(sortByReleaseDate))
            setIntTamas(data.filter(item => item.region !== "asia").sort(sortByReleaseDate))
        }
    }, [data])

    return (
        <div className={"timeline"}>
            <div>
                {asiaTamas?.map((item) => {
                    return (
                        <div key={item.id} className={"timeline-item"} style={{justifyContent: "flex-end"}}>
                            <div className={"timeline-mark timeline-mark-left"}></div>
                            <div className={"card-left"}>
                                <div>{new Date(item.releaseDate).toLocaleDateString("en-US", {month: "long"}) + " " + new Date(item.releaseDate).getFullYear()}</div>
                                <div className={"card"} style={{alignItems: "flex-end"}}>
                                    <strong>{item.name}</strong>
                                    {item.text &&
                                        <div className={"card-sub-text"}>{item.text}</div>
                                    }
                                    <img
                                        className={"card-image"}
                                        src={item.image}
                                        alt={item.name}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={"timeline-line"}></div>
            <div>
                {intTamas?.map((item) => {
                    return (
                        <div key={item.id} className={"timeline-item"}>
                            <div className={"timeline-mark timeline-mark-right"}></div>
                            <div className={"card-right"}>
                                <div>{new Date(item.releaseDate).getFullYear() + " " + new Date(item.releaseDate).toLocaleDateString("en-US", {month: "long"})}</div>
                                <div className={"card"} style={{alignItems: "flex-start"}}>
                                    <strong>{item.name}</strong>
                                    {item.text &&
                                        <div className={"card-sub-text"}>{item.text}</div>
                                    }
                                    <img
                                        className={"card-image"}
                                        src={item.image}
                                        alt={item.name}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function sortByReleaseDate(a: TamaTimelineItem, b: TamaTimelineItem) {
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
}
