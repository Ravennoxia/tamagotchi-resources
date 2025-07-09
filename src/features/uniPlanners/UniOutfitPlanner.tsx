import {useEffect, useRef, useState} from "react"
import type {UniItem, UniPreviewItem} from "../../global/types.ts"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs"
import {ToggleGroup, ToggleGroupItem} from "@radix-ui/react-toggle-group"
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {restrictToParentElement} from "@dnd-kit/modifiers"
import "../../global/Global.css"
import "./common/UniPlanner.css"
import {Draggable, Droppable, Gallery, Mover, SelectedItem} from "./common/PlannerComponents.tsx"
import {downloadImage} from "./common/PlannerFunctions.tsx"

export default function UniOutfitPlanner({urlBase}: { urlBase: string }) {
    const [headItems, setHeadItems] = useState<UniItem[]>([])
    const [faceItems, setFaceItems] = useState<UniItem[]>([])
    const [bodyItems, setBodyItems] = useState<UniItem[]>([])
    const [backItems, setBackItems] = useState<UniItem[]>([])
    const [tamas, setTamas] = useState<UniItem[]>([])
    const [selectedItems, setSelectedItems] = useState<Record<string, UniPreviewItem>>({
        head: {item: null, x: 0, y: 0},
        face: {item: null, x: 0, y: 0},
        body: {item: null, x: 0, y: 0},
        back: {item: null, x: 0, y: 0},
        tama: {item: null, x: 0, y: 0}
    })
    const [selectedMover, setSelectedMover] = useState<string>("tama")
    const imageRef = useRef<HTMLElement>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const responseHead = await fetch(urlBase + "uni-assets/head.json")
                setHeadItems(await responseHead.json())
                const responseFace = await fetch(urlBase + "uni-assets/face.json")
                setFaceItems(await responseFace.json())
                const responseBody = await fetch(urlBase + "uni-assets/body.json")
                setBodyItems(await responseBody.json())
                const responseBack = await fetch(urlBase + "uni-assets/back.json")
                setBackItems(await responseBack.json())
                const responseTama = await fetch(urlBase + "uni-assets/tama.json")
                setTamas(await responseTama.json())
            } catch (e) {
                console.error("An unexpected error occurred while fetching data:", e)
            }
        }

        fetchData().then()
    }, [urlBase])

    function isInvalidCombo() {
        const sources = new Set([
            selectedItems.head.item?.source,
            selectedItems.face.item?.source,
            selectedItems.body.item?.source,
            selectedItems.back.item?.source,
            selectedItems.tama.item?.source]
            .filter(source => source != null))
        return Array.from(sources).filter(s => s.includes("DL Area:")).length > 1
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    )

    function handleDragEnd(event: DragEndEvent) {
        const {active, delta, over} = event
        const itemId = active.id
        setSelectedItems(prevItems => {
            const currentItem = prevItems[itemId]
            if (currentItem && itemId === selectedMover && over?.id === "droppable") {
                const newX = currentItem.x + delta.x
                const newY = currentItem.y + delta.y
                return {
                    ...prevItems,
                    [itemId]: {
                        ...currentItem,
                        x: newX,
                        y: newY
                    }
                }
            }
            return prevItems
        })
    }

    return (
        <div className={"planner"}>
            <div className={"display-wrapper"}>
                <div className={"display"}>
                    <div className={"display-items"}>
                        <DndContext sensors={sensors}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToParentElement]}>
                            <Droppable ref={imageRef}> {/*body > face > head > back*/}
                                <Draggable id={"head"} selectedMover={selectedMover} item={selectedItems.head}
                                           zIndex={51} urlBase={urlBase}/>
                                <Draggable id={"face"} selectedMover={selectedMover} item={selectedItems.face}
                                           zIndex={52} urlBase={urlBase}/>
                                <Draggable id={"body"} selectedMover={selectedMover} item={selectedItems.body}
                                           zIndex={53} urlBase={urlBase}/>
                                <Draggable id={"back"} selectedMover={selectedMover} item={selectedItems.back}
                                           zIndex={50} urlBase={urlBase}/>
                                <Draggable id={"tama"} selectedMover={selectedMover} item={selectedItems.tama}
                                           zIndex={50} urlBase={urlBase}/>
                            </Droppable>
                        </DndContext>
                        <button
                            className={"download-button"}
                            onClick={() => downloadImage(imageRef, "tama-outfit")}
                            style={{width: "100px"}}
                        >
                            Download Image
                        </button>
                    </div>
                    <ToggleGroup
                        className={"movers"}
                        type={"single"}
                        orientation={"vertical"}
                        defaultValue={"tama"}
                        onValueChange={(v) => setSelectedMover(v)}
                    >
                        <ToggleGroupItem className={"mover-header"} value={""} disabled={true}>
                            Movers:
                        </ToggleGroupItem>
                        <Mover type={"tama"} label={"Tama"} selectedMover={selectedMover}/>
                        <Mover type={"head"} label={"Head"} selectedMover={selectedMover}/>
                        <Mover type={"face"} label={"Face"} selectedMover={selectedMover}/>
                        <Mover type={"body"} label={"Body"} selectedMover={selectedMover}/>
                        <Mover type={"back"} label={"Back"} selectedMover={selectedMover}
                               style={{borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px"}}/>
                    </ToggleGroup>
                </div>
                <div className={"selected-sources"}>
                    <SelectedItem type={"head"} header={"Head:"} selectedItem={selectedItems.head.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"face"} header={"Face:"} selectedItem={selectedItems.face.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"body"} header={"Body:"} selectedItem={selectedItems.body.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"back"} header={"Back:"} selectedItem={selectedItems.back.item}
                                  setSelectedItems={setSelectedItems}/>
                </div>
                {isInvalidCombo() && (
                    <div className={"warning"}>
                        Warning: You can only wear items from one DL Area at the same time
                    </div>
                )}
                <div style={{paddingBottom: "1rem"}}></div>
            </div>
            <div className={"tabs-container"}>
                <Tabs defaultValue={"tama"} className={"all-tabs"} onValueChange={(v) => setSelectedMover(v)}>
                    <TabsList>
                        <TabsTrigger value={"tama"} className={"tab"}>Tama</TabsTrigger>
                        <TabsTrigger value={"head"} className={"tab"}>Head</TabsTrigger>
                        <TabsTrigger value={"face"} className={"tab"}>Face</TabsTrigger>
                        <TabsTrigger value={"body"} className={"tab"}>Body</TabsTrigger>
                        <TabsTrigger value={"back"} className={"tab"}>Back</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"tama"} className={"gallery"}>
                        <Gallery data={tamas} type={"tama"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"head"} className={"gallery"}>
                        <Gallery data={headItems} type={"head"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"face"} className={"gallery"}>
                        <Gallery data={faceItems} type={"face"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"body"} className={"gallery"}>
                        <Gallery data={bodyItems} type={"body"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"back"} className={"gallery"}>
                        <Gallery data={backItems} type={"back"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                </Tabs>
            </div>
            <cite className={"cite-planner"}>Images and information are from the <a
                href={"https://tamagotchi.fandom.com/wiki/Main_Page"} target="_blank" rel="noopener noreferrer">Tamagotchi
                Wiki</a></cite>
        </div>
    )
}
