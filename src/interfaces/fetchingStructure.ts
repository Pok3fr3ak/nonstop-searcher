import { Presentation } from "./presentation";

export interface FetchingStructure{
    name: string, 
    link: string,
    imgLink?: string,
    presentations: Presentation[]
    nonstop?: boolean
}