import {type CSSProperties, useEffect, useRef, useState} from "react"
import type {TamaTimelineEventRow, TamaTimelineItem} from "../../global/types.ts"
import "./TamaTimeline.css"
import {CheckIcon} from "@radix-ui/react-icons"
import TimelineRowItem from "./TamaTimelineRowItem.tsx"

type YearOfEvents = {
    [year: number]: TamaTimelineEventRow[]
}

export default function TamaTimeline({navHeight}: { navHeight: number }) {
    const [yearOfEvents, setYearOfEvents] = useState<YearOfEvents>({})
    const yearRowsContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "tamagotchi-timeline.json")
                if (!response.ok) {
                    const errorMessage = `HTTP error! status: ${response.status}`
                    console.error("Failed to fetch data:", errorMessage)
                    return
                }
                const data: TamaTimelineItem[] = await response.json()
                const processedRows = getEventRows(data)
                setYearOfEvents(groupEventsByYear(processedRows))
            } catch (e) {
                console.error("An unexpected error occurred while fetching data:", e)
            }
        }

        fetchData().then()
    }, [])

    return (
        <div className={"timeline"}>
            <cite className={"cite-timeline"}>Most images and information are from the <a
                href={"https://tamagotchi.fandom.com/wiki/Main_Page"} target="_blank" rel="noopener noreferrer">Tamagotchi
                Wiki</a></cite>
            <div className={"title-container"}>
                <div className={"title"} style={{textAlign: "end"}}>
                    <div className={"title-text"}>Japanese</div>
                    <div className={"title-sub-text"} style={{justifyContent: "flex-end"}}>or Korean or Asian</div>
                    <div className={"title-sub-text"} style={{justifyContent: "flex-end"}}>
                        <CheckIcon className={"check-icon"}/>
                        <div>- has English release</div>
                    </div>
                </div>
                <div className={"timeline-line"} style={{borderRadius: "5px", margin: "10px", marginBottom: 0}}/>
                <div className={"title"}>
                    <div className={"title-text"}>English</div>
                    <div className={"title-sub-text"}>American or European</div>
                    <div className={"title-sub-text"}>
                        <CheckIcon className={"check-icon"}/>
                        <div>- has Japanese release</div>
                    </div>
                </div>
            </div>
            {Object.keys(yearOfEvents).sort((a, b) => a.localeCompare(b)).map((yearKey, index, yearsArray) => {
                const year = Number(yearKey)
                const rowsForThisYear = yearOfEvents[year]
                const evenYear = year % 2 === 0
                const nextYearInTimeline = index < yearsArray.length - 1 ? Number(yearsArray[index + 1]) : null
                const gapYears: number[] = []
                if (nextYearInTimeline && nextYearInTimeline > year + 1) {
                    for (let y = year + 1; y < nextYearInTimeline; y++) {
                        gapYears.push(y)
                    }
                }
                return (
                    <div key={year}
                         ref={yearRowsContainerRef}
                         className={evenYear ? "even-year" : undefined}
                         style={{"--nav-height": `${navHeight}px`} as CSSProperties}
                    >
                        <div className={`year ${evenYear ? "even-year" : undefined}`}>
                            {year}
                        </div>
                        {rowsForThisYear.map((row, rowIndex) => (
                            <div key={"rows-" + year + "-" + rowIndex}>
                                <div className={"timeline-row"}>
                                    <div className={"row-item"}>
                                        {row.asia && (
                                            <TimelineRowItem
                                                item={row.asia}
                                                isLeft={true}
                                                evenYear={evenYear}
                                                showMonth={rowIndex === 0 || !isSameMonth(row.asia.releaseDate, rowsForThisYear[rowIndex - 1].asia?.releaseDate)}
                                            />
                                        )}
                                    </div>
                                    <div className={"timeline-line"} style={{
                                        borderTopLeftRadius: rowIndex === 0 ? "5px" : undefined,
                                        borderTopRightRadius: rowIndex == 0 ? "5px" : undefined
                                    }}/>
                                    <div className={"row-item"}>
                                        {row.international && (
                                            <TimelineRowItem
                                                item={row.international}
                                                isLeft={false}
                                                evenYear={evenYear}
                                                showMonth={rowIndex === 0 || !isSameMonth(row.international.releaseDate, rowsForThisYear[rowIndex - 1].international?.releaseDate)}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={"timeline-row"} style={{height: "1rem"}}>
                                    <div className={"row-item"}/>
                                    <div className={"timeline-line"} style={
                                        rowIndex === rowsForThisYear.length - 1 ?
                                            {
                                                borderBottomLeftRadius: "5px",
                                                borderBottomRightRadius: "5px"
                                            } : undefined
                                    }/>
                                    <div className={"row-item"}/>
                                </div>
                                {rowIndex === rowsForThisYear.length - 1 && (
                                    <div style={{height: "5px"}}/>
                                )}
                            </div>
                        ))}
                        {gapYears.map((gapYear) => (
                            <div key={`gap-${gapYear}`}
                                 className={`year ${gapYear % 2 === 0 ? "even-year" : undefined}`}>
                                {gapYear}
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

function groupEventsByYear(eventRows: TamaTimelineEventRow[]): YearOfEvents {
    const grouped: YearOfEvents = {}
    for (const row of eventRows) {
        if (!grouped[row.year]) {
            grouped[row.year] = []
        }
        grouped[row.year].push(row)
    }
    return grouped
}

function getYearMonth(date: string) {
    if (date.length > 7) {
        return date.slice(0, 7)
    }
    return date
}


function isSameMonth(thisReleaseDate: string, prevReleaseDate?: string) {
    if (prevReleaseDate) {
        return getYearMonth(thisReleaseDate) === getYearMonth(prevReleaseDate)
    }
    return false
}

function getEventRows(data: TamaTimelineItem[]): TamaTimelineEventRow[] {
    data.sort(sortByReleaseDate)
    const eventRows: TamaTimelineEventRow[] = []
    for (const release of data) {
        const cleanedReleaseDate = getYearMonth(release.releaseDate)
        const targetRow = getSameMonthRow(eventRows, release, cleanedReleaseDate)
        let mergedSuccessfully = false
        if (targetRow) {
            mergedSuccessfully = attemptEventRowMerge(release, targetRow, cleanedReleaseDate)
        }
        if (!mergedSuccessfully) {
            createNewEventRow(release, eventRows, cleanedReleaseDate)
        }
    }
    return eventRows
}

function sortByReleaseDate(a: TamaTimelineItem, b: TamaTimelineItem) {
    return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
}

function getSameMonthRow(eventRows: TamaTimelineEventRow[], release: TamaTimelineItem, releaseMonthYear: string): TamaTimelineEventRow | null {
    let targetRow: TamaTimelineEventRow | null = null
    for (let i = eventRows.length - 1; i >= 0; i--) {
        const currentRow = eventRows[i]
        const currentRowDate = currentRow.asia?.releaseDate ?? currentRow.international?.releaseDate
        if (!currentRowDate) {
            continue
        }
        const currentRowMonthYear = getYearMonth(currentRowDate)
        if (currentRowMonthYear === releaseMonthYear) {
            const canMergeIntoCurrent = (release.region === "asia" && !currentRow.asia) ||
                (release.region === "international" && !currentRow.international)
            if (canMergeIntoCurrent) {
                targetRow = currentRow
            }
        } else if (currentRowMonthYear < releaseMonthYear) {
            break
        }
    }
    return targetRow
}

function attemptEventRowMerge(
    release: TamaTimelineItem,
    targetRow: TamaTimelineEventRow,
    cleanedReleaseDate: string
): boolean {
    if (release.region === "asia" && !targetRow.asia) {
        targetRow.asia = {...release, releaseDate: cleanedReleaseDate}
        return true
    }
    if (release.region === "international" && !targetRow.international) {
        targetRow.international = {...release, releaseDate: cleanedReleaseDate}
        return true
    }
    return false
}

function createNewEventRow(
    release: TamaTimelineItem,
    eventRows: TamaTimelineEventRow[],
    cleanedReleaseDate: string
): void {
    const newRow: TamaTimelineEventRow = {
        asia: null,
        international: null,
        year: Number(cleanedReleaseDate.slice(0, 4))
    }
    if (release.region === "asia") {
        newRow.asia = {...release, releaseDate: cleanedReleaseDate}
    } else {
        newRow.international = {...release, releaseDate: cleanedReleaseDate}
    }
    eventRows.push(newRow)
}
