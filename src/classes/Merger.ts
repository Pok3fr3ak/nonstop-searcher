import { Presentation } from "@/interfaces/presentation";

export class Merger{
    public films: Array<{
        name: string,
        link: string,
        presentations: Presentation[],
    }>

    constructor(){
        this.films = [];
    }

    addPresentation(name: string, pres: Presentation, link: string){
        const i = this.getFilm(name);
        if(i !== -1){
            if(this.hasPresentation(name, pres) === false){
                this.films[i].presentations.push(pres)
            }
        } else {
            this.films.push({
                name,
                link,
                presentations: [pres]
            })
        }
    }

    getFilm(name: string):number{
        for (let i = 0; i < this.films.length; i++) {
            if(this.films[i].name == name) return i;
        }
        return -1;
    }
    //Returns whether presentation is unique
    //Precondition: Film already exists
    hasPresentation(name: string, pres: Presentation):boolean{
        if(this.getFilm(name) == -1) throw new Error("hasPresentation was called, and film does not exist")

        const film = this.getFilm(name);
        for (let i = 0; i < this.films[film].presentations.length; i++) {
            const currDate = this.films[film].presentations[i].date
            const currRoom = this.films[film].presentations[i].room
            const currWhere = this.films[film].presentations[i].where

            if(currDate === pres.date && currRoom === pres.room && currWhere === pres.where) return true;
        }

        return false
    }

}