import type {ICellRendererParams} from "ag-grid-community"
import "../../../global/AGGridTable.css"
import "../TamaTable.css"
import type {TamaRow} from "../../../global/types.ts"
import * as React from "react"

interface CombinedImageNameRendererParams extends ICellRendererParams<TamaRow, string | null> {
    isPhone: boolean;
}

function TamaNameRenderer(params: CombinedImageNameRendererParams) {
    let nameColor: string = "#696969"
    if (params.data?.gender === "Female") {
        nameColor = "#FF69B4"
    } else if (params.data?.gender === "Male") {
        nameColor = "#1E90FF"
    }

    const image = params.data?.image

    return (
        <a
            href={params.data?.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "flex",
                alignItems: "center"
            }}
        >
            {image && (
                <img
                    src={import.meta.env.BASE_URL + "tamagotchi-images/" + image}
                    alt={params.data?.name}
                    className={params.isPhone ? "tama-image-tiny" : "tama-image-small"}
                    style={{margin: "0 5px"}}
                />
            )}
            <span style={{color: nameColor, textDecoration: "underline", textAlign: "left"}}>
                {params.value}
            </span>
        </a>
    )
}

export default React.memo(TamaNameRenderer)
