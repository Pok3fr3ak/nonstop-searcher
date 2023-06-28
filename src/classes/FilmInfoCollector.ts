import { FilmInfo } from "@/interfaces/filmInfo";
import { Presentation } from "@/interfaces/presentation";

export class FilmInfoCollector{
    films: FilmInfo[];

    constructor(){
        this.films = new Array<FilmInfo>();
    }

    add(info: FilmInfo){
        this.films.push(info);
    }

    addFilm(name: string){
        this.films.push({
            name: name,
            checkedNonStop: false,
            length: 0,
            nonStop: false,
            year: "0000",
            presentations:[]
        })
    }

    addPresenation(name: string, pres: Presentation){
        const i = this.getIndex(name)
        if(i !== -1){
            this.films[i].presentations.push(pres)
        } else {
            this.addFilm(name)
            this.addPresenation(name, pres)
        }
    }

    addPresenations(name: string, pres: Presentation[]){
        if(this.getIndex(name) === -1) this.addFilm(name)

        pres.forEach((p) => {
            this.addPresenation(name, p)
        })
    }

    updateName(name: string, newName: string){

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

    
    getFilms(){
        return this.films
    }
    

}