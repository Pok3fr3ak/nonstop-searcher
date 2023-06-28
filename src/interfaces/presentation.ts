import { NonStopCinemas } from "./nonStopCinemas";

export interface Presentation{
    where: string, 
    room: string, 
    date: string,
    time: string,
    lang: string | null
}