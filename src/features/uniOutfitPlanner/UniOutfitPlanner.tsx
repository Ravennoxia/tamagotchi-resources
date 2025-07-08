import {
    type CSSProperties,
    type Dispatch,
    type ReactNode,
    type Ref,
    type SetStateAction,
    useEffect,
    useRef,
    useState
} from "react"
import type {UniAccessory, UniOutfitPreviewItem} from "../../global/types.ts"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs"
import {ToggleGroup, ToggleGroupItem} from "@radix-ui/react-toggle-group"
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {CSS} from "@dnd-kit/utilities"
import {restrictToParentElement} from "@dnd-kit/modifiers"
import "../../global/Global.css"
import "./UniOutfitPlanner.css"
import {Cross1Icon} from "@radix-ui/react-icons"
import * as htmlToImage from "html-to-image"

export default function UniOutfitPlanner({urlBase}: { urlBase: string }) {
    const [headItems, setHeadItems] = useState<UniAccessory[]>([])
    const [faceItems, setFaceItems] = useState<UniAccessory[]>([])
    const [bodyItems, setBodyItems] = useState<UniAccessory[]>([])
    const [backItems, setBackItems] = useState<UniAccessory[]>([])
    const [tamas, setTamas] = useState<UniAccessory[]>([])
    const [selectedItems, setSelectedItems] = useState<Record<string, UniOutfitPreviewItem>>({
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
                const responseHead = await fetch(urlBase + "uni-accessories/head.json")
                setHeadItems(await responseHead.json())
                const responseFace = await fetch(urlBase + "uni-accessories/face.json")
                setFaceItems(await responseFace.json())
                const responseBody = await fetch(urlBase + "uni-accessories/body.json")
                setBodyItems(await responseBody.json())
                const responseBack = await fetch(urlBase + "uni-accessories/back.json")
                setBackItems(await responseBack.json())
                const responseTama = await fetch(urlBase + "uni-accessories/tama.json")
                setTamas(await responseTama.json())
            } catch (e) {
                console.error("An unexpected error occurred while fetching data:", e)
            }
        }

        fetchData().then()
    }, [urlBase])

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

    function handleRemoveItem(type: string) {
        return function () {
            setSelectedItems(prevItems => ({
                ...prevItems,
                [type]: {
                    item: null,
                    x: prevItems[type].x,
                    y: prevItems[type].y
                }
            }))
        }
    }

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

    function getBoundingBoxOfImages(container: HTMLElement) {
        let minX = 100
        let minY = 100
        let maxX = 0
        let maxY = 0
        const images = container.querySelectorAll(".display-image")
        if (images.length === 0) {
            return null
        }
        images.forEach(imgElement => {
            const rect = imgElement.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            const currentMinX = rect.left - containerRect.left
            const currentMinY = rect.top - containerRect.top
            const currentMaxX = rect.right - containerRect.left
            const currentMaxY = rect.bottom - containerRect.top
            minX = Math.min(minX, currentMinX)
            minY = Math.min(minY, currentMinY)
            maxX = Math.max(maxX, currentMaxX)
            maxY = Math.max(maxY, currentMaxY)
        })
        const width = maxX - minX
        const height = maxY - minY
        return {x: minX, y: minY, width, height}
    }

    function downloadImage() {
        if (imageRef.current) {
            const boundingBox = getBoundingBoxOfImages(imageRef.current)
            if (!boundingBox) {
                console.warn("No images selected to download.")
                return
            }
            htmlToImage
                .toCanvas(imageRef.current, {backgroundColor: "transparent"})
                .then((fullCanvas) => {
                    const croppedCanvas = document.createElement("canvas")
                    croppedCanvas.width = boundingBox.width
                    croppedCanvas.height = boundingBox.height
                    const ctx = croppedCanvas.getContext("2d")
                    if (!ctx) {
                        console.error("Could not get 2D context for canvas.")
                        return
                    }
                    ctx.drawImage(
                        fullCanvas,
                        boundingBox.x, boundingBox.y,
                        boundingBox.width, boundingBox.height,
                        0, 0,
                        boundingBox.width, boundingBox.height
                    )
                    const dataUrl = croppedCanvas.toDataURL("image/png")
                    const link = document.createElement("a")
                    link.download = "tama-outfit.png"
                    link.href = dataUrl
                    link.click()
                })
                .catch((e) => {
                    console.error("Could not download image: ", e)
                })
        }
    }

    return (
        <div className={"outfit-planner"}>
            <div className={"display-wrapper"}>
                <div className={"display"}>
                    <div className={"display-items"}>
                        <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
                            <Droppable ref={imageRef}> {/*body > face > head > back*/}
                                {selectedItems.head.item?.image &&
                                    <Draggable id={"head"} selectedMover={selectedMover} item={selectedItems.head}
                                               zIndex={51} urlBase={urlBase}/>}
                                {selectedItems.face.item?.image &&
                                    <Draggable id={"face"} selectedMover={selectedMover} item={selectedItems.face}
                                               zIndex={52} urlBase={urlBase}/>}
                                {selectedItems.body.item?.image &&
                                    <Draggable id={"body"} selectedMover={selectedMover} item={selectedItems.body}
                                               zIndex={53} urlBase={urlBase}/>}
                                {selectedItems.back.item?.image &&
                                    <Draggable id={"back"} selectedMover={selectedMover} item={selectedItems.back}
                                               zIndex={50} urlBase={urlBase}/>}
                                {selectedItems.tama.item?.image &&
                                    <Draggable id={"tama"} selectedMover={selectedMover} item={selectedItems.tama}
                                               zIndex={50} urlBase={urlBase}/>}
                            </Droppable>
                        </DndContext>
                        <button className={"download-button"} onClick={downloadImage}>Download Image</button>
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
                    {selectedItems.head.item && (
                        <>
                            <button className={"remove-selection"} onClick={handleRemoveItem("head")}>
                                <Cross1Icon/>
                            </button>
                            <div>Head:</div>
                            <div>{selectedItems.head.item?.name}</div>
                            <div>From:</div>
                            <div>{selectedItems.head.item?.source}</div>
                        </>
                    )}
                    {selectedItems.face.item && (
                        <>
                            <button className={"remove-selection"} onClick={handleRemoveItem("face")}>
                                <Cross1Icon/>
                            </button>
                            <div>Face:</div>
                            <div>{selectedItems.face.item?.name}</div>
                            <div>From:</div>
                            <div>{selectedItems.face.item?.source}</div>
                        </>
                    )}
                    {selectedItems.body.item && (
                        <>
                            <button className={"remove-selection"} onClick={handleRemoveItem("body")}>
                                <Cross1Icon/>
                            </button>
                            <div>Body:</div>
                            <div>{selectedItems.body.item?.name}</div>
                            <div>From:</div>
                            <div>{selectedItems.body.item?.source}</div>
                        </>
                    )}
                    {selectedItems.back.item && (
                        <>
                            <button className={"remove-selection"} onClick={handleRemoveItem("back")}>
                                <Cross1Icon/>
                            </button>
                            <div>Back:</div>
                            <div>{selectedItems.back.item?.name}</div>
                            <div>From:</div>
                            <div>{selectedItems.back.item?.source}</div>
                        </>
                    )}
                </div>
                {isInvalidCombo() && (
                    <div className={"warning"}>Warning: You can only wear items from one DL Area at the same time</div>
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

function Droppable({children, ref}: { children: ReactNode, ref: Ref<HTMLElement> }) {
    const {setNodeRef} = useDroppable({id: "droppable"})
    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node)
        if (typeof ref === "function") {
            ref(node)
        } else if (ref) {
            ref.current = node
        }
    }
    return (
        <div ref={combinedRef} className={"display-item"}>
            {children}
        </div>
    )
}

function Draggable({id, selectedMover, item, zIndex, urlBase}: {
    id: string,
    selectedMover: string,
    item: UniOutfitPreviewItem,
    zIndex: number,
    urlBase: string,
}) {
    const isSelected = id === selectedMover
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: id, disabled: !isSelected})
    const style: CSSProperties = {
        left: `${item.x}px`,
        top: `${item.y}px`,
        zIndex: zIndex,
        pointerEvents: isSelected ? "auto" : "none",
        transform: isSelected ? CSS.Translate.toString(transform) : "translate3d(0, 0, 0)"
    }
    return (
        <button className={"draggable cell-not-button"} ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {item.item?.image && (
                <DisplayItem item={item} urlBase={urlBase}/>
            )}
        </button>
    )
}

function DisplayItem({item, urlBase}: { item: UniOutfitPreviewItem, urlBase: string }) {
    return (
        <img
            className={"display-image"}
            src={urlBase + "uni-accessories/images/" + item.item?.image}
            alt={item.item?.image + ""}
        />
    )
}

function Mover({type, label, selectedMover, style}: {
    type: string,
    label: string,
    selectedMover: string,
    style?: CSSProperties
}) {
    return (
        <ToggleGroupItem
            className={`mover ${selectedMover === type ? "selected-mover" : ""}`}
            value={type}
            style={style}
        >
            {label}
        </ToggleGroupItem>
    )
}

function Gallery({data, type, setter, urlBase}: {
    data: UniAccessory[],
    type: string,
    setter: Dispatch<SetStateAction<Record<string, UniOutfitPreviewItem>>>,
    urlBase: string,
}) {
    return (
        <>
            {data.map((item, index) => {
                if (item.image) {
                    return (
                        <div key={item.name + index}>
                            <GalleryItem item={item} type={type} setter={setter} urlBase={urlBase}/>
                        </div>
                    )
                }
            })}
        </>
    )
}

function GalleryItem({item, type, setter, urlBase}: {
    item: UniAccessory,
    type: string,
    setter: Dispatch<SetStateAction<Record<string, UniOutfitPreviewItem>>>,
    urlBase: string
}) {
    return (
        <button
            className={"gallery-item"}
            onClick={() => {
                setter(prevOutfitItems => ({
                    ...prevOutfitItems,
                    [type]: {
                        item: item,
                        x: prevOutfitItems[type].x,
                        y: prevOutfitItems[type].y
                    }
                }))
            }}>
            <img
                src={urlBase + "uni-accessories/images/" + item.image}
                alt={item.name}
            />
        </button>
    )
}
