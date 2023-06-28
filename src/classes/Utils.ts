export class Utils{
    //adds specified Number of days to date and returns a new Date
    static addDays(date: Date, days: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }
}