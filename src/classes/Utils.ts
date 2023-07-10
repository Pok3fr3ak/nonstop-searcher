export class Utils{
    public static YYYYMD = /\d\d\d\d-\d{1,2}-\d{1,2}/;
    public static DDMM = /\d{1,2}.\d{1,2}./;

    //adds specified Number of days to date and returns a new Date
    static addDays(date: Date, days: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }

    // reformats Strings from DD.MM --> YYYY-MM-DD
    static equalizeDate(dateStr: string | null | undefined): string{
        if(dateStr === null || dateStr === undefined) return "noDate"
        if(dateStr === "noDate") return dateStr;
        
        // Array is of form [DD, MM], however Day and Month may only be one digit
        if(this.DDMM.test(dateStr)){
            const inputArr = dateStr.split(".")
        
            return this.numberDateToString(Number(inputArr[1]), Number(inputArr[0]));
        }

        if(this.YYYYMD.test(dateStr)){
            const inputArr = dateStr.split("-")

            return this.numberDateToString(Number(inputArr[1]), Number(inputArr[0]));
        }



        throw(new Error("Input date string matches no previoulsy definded REGEX to equalize the date"));            
    }

    static numberDateToStringWithYear(year: number, month: number, day: number): string{
        return `${year}-${month.toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 })}-${day.toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 })}`
    }

    static numberDateToString(month: number, day: number): string{
        return this.numberDateToStringWithYear(new Date().getFullYear(), month, day);
    }
}