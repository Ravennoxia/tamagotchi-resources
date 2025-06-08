import type {ICellRendererParams} from "ag-grid-community"
import "./CombinedRenderer.css"
import type {IRow} from "../../../global/types.ts"

interface CombinedImageNameRendererParams extends ICellRendererParams<IRow, string | null> {
    isPhone: boolean;
}

export default function CombinedRenderer(params: CombinedImageNameRendererParams) {
    let nameColor: string = "#696969"
    if (params.data?.gender === "Female") {
        nameColor = "#FF69B4"
    } else if (params.data?.gender === "Male") {
        nameColor = "#1E90FF"
    }

    const imageUrl = params.data?.image

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
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={params.data?.name}
                    className={params.isPhone ? "tama-image-tiny" : "tama-image-small"}
                    style={{margin: "0 5px"}}
                />
            )}
            <span
                className="tama-name"
                style={{color: nameColor, textDecoration: "underline"}}
            >
                {params.value}
            </span>
        </a>
    )
}
