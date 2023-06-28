export class Analyzer{
    private contents: string | null
    
    constructor(contents: string | null){
        this.contents = this.sanitize(contents);
    }

    getLength(){

    }

    getVersion(){
        if(this.contents === null) return "no Version available"
        const possibleLabels = ["OmeU", "dt. OV", "OmdU", "eOV"]

        for (let i = 0; i < possibleLabels.length; i++) {
            if(this.contents.includes(possibleLabels[i])) return possibleLabels[i]
        }

        return "no Version available"
    }

    getYear(){

    }

    getNonstop(){
        
    }

    sanitize(c: string | null): string | null{
        if(c === null) return null
        return c.replaceAll("\n", " ").replace(/\s+/g, ' ').trim()
    }
}