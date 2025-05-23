import {type ColDef, type GridOptions} from "ag-grid-community"
import {AgGridReact} from "ag-grid-react"
import ImageRenderer from "./imageRenderer.tsx"
import {useEffect, useState} from "react"

interface IRow {
    make: string;
    model: string;
    price: number;
    electric: boolean;
    image: string;
}

export default function GridExample() {
    const [themeMode, setThemeMode] = useState<string>("dark")

    const rowData: IRow[] = ([
        {make: "Tesla", model: "Model Y", price: 64950, electric: true, image: "weeptchi"},
        {make: "Ford", model: "F-Series", price: 33850, electric: false, image: ""},
        {make: "Toyota", model: "Corolla", price: 29600, electric: false, image: ""},
        {make: "Mercedes", model: "EQA", price: 48890, electric: true, image: ""},
        {make: "Fiat", model: "500", price: 15774, electric: false, image: ""},
        {make: "Nissan", model: "Juke", price: 20675, electric: false, image: ""}
    ])

    const colDefs: ColDef<IRow>[] = ([
        {field: "make"},
        {field: "model"},
        {field: "price"},
        {field: "electric"},
        {field: "image", cellRenderer: ImageRenderer, autoHeight: true}
    ])

    const gridOptions: GridOptions<IRow> = {
        domLayout: "autoHeight",
        autoSizeStrategy: {type: "fitCellContents", skipHeader: true},
    }

    useEffect(() => {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
            setThemeMode(event.matches ? "dark" : "light")
        })
    }, [])

    return (
        <div style={{width: "100%"}} data-ag-theme-mode={themeMode}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                gridOptions={gridOptions}
            />
        </div>
    )
}
