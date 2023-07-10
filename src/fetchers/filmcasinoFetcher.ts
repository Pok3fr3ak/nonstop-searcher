import { Utils } from "@/classes/Utils";
import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Presentation } from "@/interfaces/presentation";
import { Browser } from "puppeteer";

export default async function getFilmcasinoData(browser: Browser): Promise<FetchingStructure[]> {
    const page = await browser.newPage();

    await page.goto("http://www.filmcasino.at/programm/", { waitUntil: "domcontentloaded" }).catch(err => console.log(err)
    );

    return new Promise(async (resolve, reject)=>{
        const filmcasinoCrawl = await page.evaluate(() => {
            const films = document.querySelectorAll("div#outer-article-wrapper div.article-wrapper");
            return Array.from(films).map(film => {
                const presentations: Presentation[] = [];
                const link = film.querySelector("a")?.getAttribute("href") ?? "";
                const name = film.querySelector("a > h1")?.textContent ?? "";
                const times = film.querySelectorAll("div.article-info");

                Array.from(times).forEach(p => {
                    presentations.push({
                        where: p.querySelector("span.cin > a")?.textContent ?? "",
                        room: "",
                        date: (p.querySelector("span.date")?.textContent ?? "noDate"),
                        time: (p.querySelector("span.disp-time")?.textContent ?? "no time"),
                        lang: null
                    })
                })

                return {
                    name,
                    link: `http://www.filmcasino.at/${link}`,
                    presentations
                }
            })
        })
        
        page.close();
        console.log("Filmcasino Fetch complete");
        resolve(filmcasinoCrawl)
    })
}