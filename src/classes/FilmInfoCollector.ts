import { FilmInfo } from "@/interfaces/filmInfo";
import { Presentation } from "@/interfaces/presentation";
import { Utils } from "./Utils";

export class FilmInfoCollector{
    films: FilmInfo[];
    dateRegEX: RegExp;

    constructor(){
        this.films = new Array<FilmInfo>();
        this.dateRegEX = /\d\d\d\d-\d\d-\d\d/
    }

    /**
     * Add a Film defined by its name to the collector
     * Nonstop-Info, the Filmlinks, the dates and the presentations are initalized with default vaules (null or empty array)
     * @param name The name of the Film to add
     */

    addFilm(name: string){
        this.films.push({
            name: name,
            checkedNonStop: false,
            filmLinks: [],
            length: 0,
            nonStop: false,
            year: "0000",
            presentations:[],
            dates: []
        })
    }

    /**
     * Adds a single Presentation to a Film.
     * If the film is not already added, this function will add the film to the Collector
     * @param name Name of the Film (identifier)
     * @param link The link to the film
     * @param pres Single presentation
     */

    addPresenation(name: string, link: string, pres: Presentation){
        const i = this.getIndex(name)
        if(i !== -1){
            this.films[i].presentations.push(this.formatPresentation(pres))
            if(!this.films[i].filmLinks.includes(link)) this.films[i].filmLinks.push(link)
        } else {
            this.addFilm(name)
            this.addPresenation(name, link, pres)
        }
    }

    /**
     * A shorthand function for using the function "addPresentation" with arrays.
     * For further Information see addPesentation
     */

    addPresenations(name: string, link: string, pres: Presentation[]){
        if(this.getIndex(name) === -1) this.addFilm(name)

        pres.forEach((p) => {
            this.addPresenation(name, link, p)
        })
    }

    updateNonStop(name: string, nonStopStatus: boolean){

    }

    checkFilmEquality(a: string, b:string):boolean{
        //console.log(this.equalizeString(a), " <---> ", this.equalizeString(b))
        return this.equalizeString(a) === this.equalizeString(b)
    }

    equalizeString(str: string){
        return str.replaceAll("\n", " ").replace(/\s+/g, ' ').replaceAll("–", "").replaceAll("-", "").trim().toUpperCase();
    }

    private getIndex(name: string){
        for(let i = 0; i < this.films.length; i++){
            if(this.checkFilmEquality(this.films[i].name, name)) return i;
        }
        return -1;
    }

    /**
     * Gets all the films from the collector, before they are returned they are sorted and the uniqueDates array is filled
     * @returns The sorted array of films
     */

    getFilms(){
        this.sort();
        this.consolidateUniqueDates();
        return this.films
    }

    /**
     * Sorts alle the films. Films are ordered by their earliest presentation, all presentations of each film are ordered by their time
     */
    sort(){
        this.films.forEach(film => {
            film.presentations.sort((a, b) => {
                const d1 = new Date(`${a.date} ${a.time}`);
                const d2 = new Date(`${b.date} ${b.time}`)
                if(d1 < d2){
                    return -1
                } else if(d1 === d2){
                    return 0
                } else {
                    return 1
                }
            })
        })

        this.films.sort((a, b) => {
            const d1 = new Date(a.presentations[0].date)
            const d2 = new Date(b.presentations[0].date)

            if(d1 < d2){
                return -1
            } else if(d1 === d2){
                return 0
            } else {
                return 1
            }
        })
    }

    /**
     * Consollidates the Dates from all Presentations
     */
    consolidateUniqueDates(){
        this.films.forEach(film => {
            film.presentations.forEach(pres => {
                if(!film.dates.includes(pres.date)) film.dates.push(pres.date)
            })
        })

    }
    
    formatPresentation(p: Presentation):Presentation{
        if(!this.dateRegEX.test(p.date)) p.date = Utils.equalizeDate(p.date)

        return p;
    }

}