import { Presentation } from "./presentation";

export interface FilmInfo{
    name: string,
    year: string,
    length: number,
    checkedNonStop: boolean,
    nonStop: boolean,
    presentations: Presentation[]
}