export type PositionFunction = (
    desiredX: number,
    desiredY: number,
    elementWidth: number,
    elementHeight: number
) => { left: string, top: string }
