import { Merger } from "@/classes/Merger";
import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Browser } from "puppeteer";


export default async function getGartenbauData(browser: Browser): Promise<FetchingStructure[]> {
    const page = await browser.newPage();
    
    await page.goto("https://gartenbaukino.at/programm/programmuebersicht/")

    return new Promise(async (resolve, reject)=>{
        const gartenbauCrawl = await page.evaluate(() => {
            const cards = document.querySelectorAll("div.movie-preview-grid__entry");
            const collected = Array.from(cards).map(card => {
                const name = card.querySelector("h2.movie-preview__title a")?.textContent ?? "";
                const date = card.querySelector(".movie-preview__date time")?.getAttribute("datetime") ?? "";
                const time = card.querySelector("div.span-seperator span a time")?.textContent ?? "";
                const link = card.querySelector("h2.movie-preview__title a")?.getAttribute("href") ?? "";
                return {
                    name,
                    date,
                    time,
                    link: `https://gartenbaukino.at${link}`
                }
            })

            return collected
        }).then(b => {
            const merger = new Merger();
            b.forEach(c => {
                merger.addPresentation(
                    c.name,
                    {
                        where: "Gartenbaukino",
                        room: "",
                        date: c.date,
                        time: c.time,
                        lang: null
                    },
                    c.link
                )
            })

            return merger.films
        })
        page.close();
        console.log("Gartenbau Fetch complete");
        resolve(gartenbauCrawl)
    })
}