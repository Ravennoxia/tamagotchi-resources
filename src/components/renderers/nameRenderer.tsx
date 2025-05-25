import type {ICellRendererParams} from "ag-grid-community"
import type {IRow} from "../table.tsx"

export default function NameRenderer(params: ICellRendererParams<IRow, string | null>) {
    let color
    if (params.data?.gender === "Female") {
        color = "#FF69B4"
    } else if (params.data?.gender === "Male") {
        color = "#1E90FF"
    } else {
        color = "#696969"
    }
    return (
        <a href={params.data?.link} target="_blank" rel="noopener noreferrer"
           style={{color: color, textDecoration: "underline"}}>
            {params.value}
        </a>
    )
}
