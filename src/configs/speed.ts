export enum SPEED {
    IMMEDIATE = 4,
    FAST = 3,
    NORMAL = 2,
    SLOW = 1
}

export const SPEED_AWAIT = {
    [SPEED.IMMEDIATE]: 0,
    [SPEED.FAST]: 10,
    [SPEED.NORMAL]: 50,
    [SPEED.SLOW]: 500
}