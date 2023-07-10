import { Presentation } from "./presentation";

export interface FilmInfo{
    name: string,
    year: string,
    filmLinks: string[],
    length: number,
    checkedNonStop: boolean,
    nonStop: boolean,
    presentations: Presentation[],
    dates: string[]
}