import type {PositionFunction, UniItem, UniPreviewItem} from "../../../global/types.ts"
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
import {useDraggable, useDroppable} from "@dnd-kit/core"
import {CSS} from "@dnd-kit/utilities"
import "./UniPlanner.css"
import {ToggleGroupItem} from "@radix-ui/react-toggle-group"
import {handleRemoveItem} from "./PlannerFunctions.tsx"
import {Cross1Icon} from "@radix-ui/react-icons"

export function Droppable({children, ref}: {
    children: ReactNode,
    ref: Ref<HTMLElement>
}) {
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
        <div ref={combinedRef} className={"display-item-outfit"}>
            {children}
        </div>
    )
}

export function Draggable({id, selectedMover, item, zIndex, urlBase}: {
    id: string,
    selectedMover: string,
    item: UniPreviewItem,
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
        <>
            {item.item?.image &&
                <button className={"draggable cell-not-button"} ref={setNodeRef}
                        style={style} {...listeners} {...attributes}>
                    {item.item?.image && (
                        <DisplayItem item={item} urlBase={urlBase}/>
                    )}
                </button>
            }
        </>

    )
}

function DisplayItem({item, urlBase}: { item: UniPreviewItem, urlBase: string }) {
    return (
        <img
            className={"display-image"}
            src={urlBase + "uni-assets/images/" + item.item?.image}
            alt={item.item?.image + ""}
        />
    )
}

export function DisplayItemRoom({item, urlBase, zIndex, positionFunction}: {
    item: UniPreviewItem,
    urlBase: string,
    zIndex: number,
    positionFunction: PositionFunction
}) {
    const imgRef = useRef<HTMLImageElement>(null)
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0})

    useEffect(() => {
        function calculateAndSetDimensions() {
            const currentImgRef = imgRef.current
            if (currentImgRef) {
                setImageDimensions({
                    width: currentImgRef.naturalWidth,
                    height: currentImgRef.naturalHeight
                })
            }
        }

        const currentImgRef = imgRef.current
        if (currentImgRef?.complete) {
            calculateAndSetDimensions()
        } else if (currentImgRef) {
            currentImgRef.onload = calculateAndSetDimensions
        }

        return () => {
            if (currentImgRef) {
                currentImgRef.onload = null
            }
        }
    }, [item.item?.image, urlBase])

    const {left, top} = positionFunction(
        item.x,
        item.y,
        imageDimensions.width,
        imageDimensions.height
    )

    return (
        <>
            {item.item?.image &&
                <img
                    ref={imgRef}
                    className={"display-image"}
                    style={{
                        position: "absolute",
                        left: left,
                        top: top,
                        zIndex: zIndex
                    }}
                    src={urlBase + "uni-assets/images/" + item.item?.image}
                    alt={item.item?.image + ""}
                />
            }
        </>
    )
}

export function Gallery({data, type, setter, urlBase, isRoom = false, petItems}: {
    data: UniItem[],
    type: string,
    setter: Dispatch<SetStateAction<Record<string, UniPreviewItem>>>,
    urlBase: string,
    isRoom?: boolean,
    petItems?: UniItem[]
}) {
    return (
        <>
            {data.map((item, index) => {
                if (item.image) {
                    return (
                        <div key={item.name + index}>
                            <GalleryItem item={item} type={type} setter={setter} urlBase={urlBase} isRoom={isRoom}
                                         petItems={petItems}/>
                        </div>
                    )
                }
            })}
        </>
    )
}

function GalleryItem({item, type, setter, urlBase, isRoom, petItems}: {
    item: UniItem,
    type: string,
    setter: Dispatch<SetStateAction<Record<string, UniPreviewItem>>>,
    urlBase: string,
    isRoom: boolean,
    petItems?: UniItem[]
}) {
    const isGarden = type === "furnitureGarden"
    const associatedPet = isGarden && item.pet
        ? petItems?.find(pet => pet.name === item.pet)
        : null
    return (
        <button
            className={`gallery-item ${isRoom ? "gallery-item-room" : undefined}`}
            style={{position: "relative"}}
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
                src={urlBase + "uni-assets/images/" + item.image}
                alt={item.name}
            />
            {isGarden && associatedPet?.image && (
                <img
                    className={"gallery-pet"}
                    src={urlBase + "uni-assets/images/" + associatedPet.image}
                    alt={associatedPet.name}
                />
            )}
        </button>
    )
}


export function Mover({type, label, selectedMover, style}: {
    type: string,
    label: string,
    selectedMover: string,
    style?: CSSProperties
}) {
    return (
        <ToggleGroupItem
            className={`mover ${selectedMover === type ? "selected-mover" : undefined}`}
            value={type}
            style={style}
        >
            {label}
        </ToggleGroupItem>
    )
}

export function SelectedItem({type, header, selectedItem, setSelectedItems}: {
    type: string,
    header: string,
    selectedItem: UniItem | null,
    setSelectedItems: Dispatch<SetStateAction<Record<string, UniPreviewItem>>>
}) {
    return (
        <>
            {selectedItem && (
                <>
                    <button className={"remove-selection"} onClick={handleRemoveItem(type, setSelectedItems)}>
                        <Cross1Icon/>
                    </button>
                    <div>{header}</div>
                    <div className={"selected-source-text"}>{selectedItem?.name}</div>
                    <div>From:</div>
                    <div className={"selected-source-text"}>{selectedItem?.source}</div>
                </>
            )}
        </>
    )
}
