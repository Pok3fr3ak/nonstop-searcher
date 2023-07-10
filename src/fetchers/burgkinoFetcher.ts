import { Merger } from "@/classes/Merger";
import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Presentation } from "@/interfaces/presentation";
import { Browser } from "puppeteer";

export default async function getBurgkinoData(browser: Browser): Promise<FetchingStructure[]> {
    const page = await browser.newPage();
        
    return new Promise(async (resolve, reject) => {
        const links = ["today", "tomorrow", "this-week", "next-week"];

        const merger = new Merger();
        for (const link of links) {
            await page.goto(`https://www.burgkino.at/showtimes/${link}`, { waitUntil: "domcontentloaded" })
            const current = await page.evaluate(() => {
                const cards = document.querySelectorAll("article.movies")
                const collected: { name: string, link: string, presentations: Presentation[] }[] = Array.from(cards).map(card => {
                    const name = card.querySelector("h2 > a")?.textContent ?? "no Name";
                    const link = card.querySelector("h2 > a")?.getAttribute("href") ?? "no link"
                    const filmAndNonStopInfo = card.querySelector(".field--name-field-moviesetting")?.textContent ?? "noNonstopInfo"
                    const showtimes = card.querySelectorAll("tbody tr")
                    //console.log(name, link, showtimes);
                    let presentations: Presentation[] = [];
                    Array.from(showtimes).forEach(show => {
                        const time = show.querySelector("time")?.getAttribute("datetime") ?? "2001-01-27"
                        const room = show.querySelector(".views-field-field-room-name")?.textContent ?? "no Room";
                        const dateObj = new Date(time);
                        presentations.push({
                            where: "Burg Kino",
                            date: `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 })}-${dateObj.getDate().toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 }) }`,
                            time: dateObj.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"}),
                            room,
                            lang: filmAndNonStopInfo
                        })
                    })
                    return ({
                        name,
                        link: `https://www.burgkino.at${link}`,
                        presentations
                    })
                })
                return collected;
            })

            current.forEach(b => {
                b.presentations.forEach(c => {
                    merger.addPresentation(b.name, c, b.link)
                })
            })
        }

        page.close();
        console.log("Burgkino Fetch complete");
        resolve(merger.films)
    })
}