import type {UniItem, UniPreviewItem} from "../../global/types.ts"
import {useEffect, useRef, useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs"
import {DisplayItemRoom, Gallery, SelectedItem} from "./common/PlannerComponents.tsx"
import "./common/UniPlanner.css"
import {downloadImage, getPositionBottom, getPositionCenter} from "./common/PlannerFunctions.tsx"

export default function UniRoomPlanner({urlBase}: { urlBase: string }) {
    const [roomItems, setRoomItems] = useState<UniItem[]>([])
    const [furnitureItems, setFurnitureItems] = useState<UniItem[]>([])
    const [toyItems, setToyItems] = useState<UniItem[]>([])
    const [petItems, setPetItems] = useState<UniItem[]>([])
    const [selectedItems, setSelectedItems] = useState<Record<string, UniPreviewItem>>({
        room: {item: null, x: 64, y: 64},
        furnitureLeft: {item: null, x: 32, y: 75},
        furnitureRight: {item: null, x: 96, y: 75},
        item: {item: null, x: 32, y: 90},
        furnitureGarden: {item: null, x: 32, y: 80},
        pet: {item: null, x: 96, y: 96}
    })
    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const responseRoom = await fetch(urlBase + "uni-assets/room.json")
                setRoomItems(await responseRoom.json())
                const responseFurniture = await fetch(urlBase + "uni-assets/furniture.json")
                setFurnitureItems(await responseFurniture.json())
                const responseToys = await fetch(urlBase + "uni-assets/item.json")
                setToyItems(await responseToys.json())
                const responsePets = await fetch(urlBase + "uni-assets/pet.json")
                setPetItems(await responsePets.json())
            } catch (e) {
                console.error("An unexpected error occurred while fetching data:", e)
            }
        }

        fetchData().then()
    }, [urlBase])

    useEffect(() => {
        const selectedGardenFurniture = selectedItems.furnitureGarden.item
        if (selectedGardenFurniture?.pet) {
            const matchingPet = petItems.find(petItem =>
                petItem.name === selectedGardenFurniture.pet
            )
            if (matchingPet) {
                setSelectedItems(prev => ({
                    ...prev,
                    pet: {...prev.pet, item: matchingPet}
                }))
            } else {
                setSelectedItems(prev => ({
                    ...prev,
                    pet: {...prev.pet, item: null}
                }))
            }
        } else {
            setSelectedItems(prev => ({
                ...prev,
                pet: {...prev.pet, item: null}
            }))
        }
    }, [selectedItems.furnitureGarden.item, petItems])

    function isInvalidCombo() {
        const sources = new Set([
            selectedItems.room.item?.source,
            selectedItems.furnitureLeft.item?.source,
            selectedItems.furnitureRight.item?.source,
            selectedItems.furnitureGarden.item?.source,
            selectedItems.item.item?.source]
            .filter(source => source != null))
        return Array.from(sources).filter(s => s.includes("DL Area:")).length > 1
    }

    return (
        <div className={"planner"}>
            <div className={"display-wrapper"} style={{padding: "1rem 0"}}>
                <div className={"display-items"}>
                    <div className={"display"} ref={imageRef} style={{padding: 0}}>
                        <div className={"display-item-room"}>
                            <DisplayItemRoom item={selectedItems.room} urlBase={urlBase} zIndex={50}
                                             positionFunction={getPositionCenter}/>
                            <DisplayItemRoom item={selectedItems.furnitureLeft} urlBase={urlBase} zIndex={51}
                                             positionFunction={getPositionBottom}/>
                            <DisplayItemRoom item={selectedItems.furnitureRight} urlBase={urlBase} zIndex={52}
                                             positionFunction={getPositionBottom}/>
                            <DisplayItemRoom item={selectedItems.item} urlBase={urlBase} zIndex={53}
                                             positionFunction={getPositionCenter}/>
                        </div>
                        <div className={"display-item-room"}>
                            <img
                                className={"display-image"}
                                style={{position: "absolute", left: 0, top: 0, zIndex: 50}}
                                src={urlBase + "uni-assets/images/Garden.png"}
                                alt={"Garden"}
                            />
                            <DisplayItemRoom item={selectedItems.furnitureGarden} urlBase={urlBase} zIndex={51}
                                             positionFunction={getPositionCenter}/>
                            <DisplayItemRoom item={selectedItems.pet} urlBase={urlBase} zIndex={52}
                                             positionFunction={getPositionCenter}/>
                        </div>
                    </div>
                    <button onClick={() => downloadImage(imageRef, "tama-room")}>Download Image</button>
                </div>
                <div className={"selected-sources"} style={{paddingTop: "1rem"}}>
                    <SelectedItem type={"room"} header={"Room:"} selectedItem={selectedItems.room.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"furnitureLeft"} header={"Left:"}
                                  selectedItem={selectedItems.furnitureLeft.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"furnitureRight"} header={"Right:"}
                                  selectedItem={selectedItems.furnitureRight.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"item"} header={"Item:"} selectedItem={selectedItems.item.item}
                                  setSelectedItems={setSelectedItems}/>
                    <SelectedItem type={"furnitureGarden"} header={"Garden:"}
                                  selectedItem={selectedItems.furnitureGarden.item}
                                  setSelectedItems={setSelectedItems}/>
                </div>
                {isInvalidCombo() && (
                    <div className={"warning"}>
                        Warning: You can only display items from one DL Area at the same time
                    </div>
                )}
            </div>
            <div className={"tabs-container"}>
                <Tabs defaultValue={"room"} className={"all-tabs"}>
                    <TabsList>
                        <TabsTrigger value={"room"} className={"tab"}>Room</TabsTrigger>
                        <TabsTrigger value={"furnitureLeft"} className={"tab"}>Left</TabsTrigger>
                        <TabsTrigger value={"furnitureRight"} className={"tab"}>Right</TabsTrigger>
                        <TabsTrigger value={"item"} className={"tab"}>Item</TabsTrigger>
                        <TabsTrigger value={"furnitureGarden"} className={"tab"}>Garden</TabsTrigger>
                    </TabsList>
                    <TabsContent value={"room"} className={"gallery"}>
                        <Gallery data={roomItems} type={"room"} setter={setSelectedItems} urlBase={urlBase}
                                 isRoom={true}/>
                    </TabsContent>
                    <TabsContent value={"furnitureLeft"} className={"gallery"}>
                        <Gallery data={furnitureItems} type={"furnitureLeft"} setter={setSelectedItems}
                                 urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"furnitureRight"} className={"gallery"}>
                        <Gallery data={furnitureItems} type={"furnitureRight"} setter={setSelectedItems}
                                 urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"item"} className={"gallery"}>
                        <Gallery data={toyItems} type={"item"} setter={setSelectedItems} urlBase={urlBase}/>
                    </TabsContent>
                    <TabsContent value={"furnitureGarden"} className={"gallery"}>
                        <Gallery data={furnitureItems} type={"furnitureGarden"} setter={setSelectedItems}
                                 urlBase={urlBase} petItems={petItems}/>
                    </TabsContent>
                </Tabs>
            </div>
            <cite className={"cite-planner"}>Positions are approximated</cite>
            <cite className={"cite-planner"}>Images and information are from the <a
                href={"https://tamagotchi.fandom.com/wiki/Main_Page"} target="_blank" rel="noopener noreferrer">Tamagotchi
                Wiki</a></cite>
        </div>
    )
}
