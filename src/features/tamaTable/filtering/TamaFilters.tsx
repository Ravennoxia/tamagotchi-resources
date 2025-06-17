import type {ChangeEvent} from "react"

export default function TamaFilters({title, options, selectedOptions, onChange}: {
    title: string,
    options: Record<string, string>,
    selectedOptions: string[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <>
            <strong>{title}:</strong>
            <div className={"filter-row"}>
                {Object.entries(options).map(([key, value]) => (
                    <label key={key}>
                        <input
                            type="checkbox"
                            value={value}
                            checked={selectedOptions.includes(value)}
                            onChange={onChange}/>
                        {value}
                    </label>
                ))}
            </div>
        </>
    )
}
