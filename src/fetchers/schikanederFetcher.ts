import { Analyzer } from "@/classes/Analyzer";
import { Merger } from "@/classes/Merger";
import { Utils } from "@/classes/Utils";
import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Browser } from "puppeteer";

interface IntermediateStructure{
    films:{        
        tag: string, 
        time: string, 
        room: string, 
        name: string, 
        link: string,
        infos: string | null
    }[]
}


export default async function getSchikanederOrTopkinoData(browser: Browser, kino: "Schikaneder" | "Topkino"): Promise<FetchingStructure[]> {
    //0.. Sunday, 6.. Saturday
    const callsPerDay = new Map()
    callsPerDay.set(2, 10)
    callsPerDay.set(3, 9)
    callsPerDay.set(4, 8)
    callsPerDay.set(5, 7)
    callsPerDay.set(6, 6)
    callsPerDay.set(0, 5)
    callsPerDay.set(1, 4)

    const numOfCalls = callsPerDay.get(new Date().getDay())
    
    return new Promise(async (resolve, reject) => {
        const baseLink = kino === "Schikaneder" ? `https://www.schikaneder.at` : `https://www.topkino.at`
        const additionalLink = "/kino/kinoprogramm"
        const today = new Date()
        const schikanederMerger = new Merger();
        let dateOffset = 0;
        const promises: Promise<IntermediateStructure>[] = [];
        for (let i = 0; i < numOfCalls; i++) {
            promises.push(new Promise(async (resolve, reject) => {
                const localPage = await browser.newPage();
                const queryDate = Utils.addDays(today, i)
                const dateString = `${queryDate.getFullYear()}-${(queryDate.getMonth() + 1).toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 })}-${(queryDate.getDate()).toLocaleString("de-DE", { minimumIntegerDigits: 2, maximumFractionDigits: 0 })}`
                

                await localPage.goto(`${baseLink}${additionalLink}?date=${dateString}`, { waitUntil: "domcontentloaded" })
                dateOffset++;
            
                const content = await localPage.evaluate(() => {
                    const entries = document.querySelectorAll(".programm > .entry")
                    const films = Array.from(entries).map(row => {
                        const tag = row.querySelector(".tag")?.textContent?.split(",")[1].replaceAll(" ", "").trim() ?? "noDayInfoAvailable"
                        const time = row.querySelector(".uhrzeit")?.textContent?.replaceAll("\n", " ").replace(/\s+/g, ' ').trim() ?? "noTimeInfoAvailable"
                        const room = row.querySelector(".raum")?.textContent?.trim() ?? "noRoomInfoAvailable"
                        const name = row.querySelector("h2 a")?.textContent?.replaceAll("\n", " ").replace(/\s+/g, ' ').trim() ?? "noNameInfoAvailable"
                        const link = row.querySelector("h2 a")?.getAttribute("href") ?? "noLink"
                        const infos = row.querySelector(".subinfo")?.textContent ?? null
                        return ({
                            tag, time, room, name, link, infos
                        })
                    })
                    return {
                        films
                    }
                }).then((data) => data)

                localPage.close();
                resolve(content)
            }))
        }

        const content = await Promise.all(promises)

        content.forEach(day => {
            day.films.forEach(film => {
                const version = new Analyzer(film.infos).getVersion();
                schikanederMerger.addPresentation(film.name, {
                    where: kino,
                    room: film.room,
                    date: film.tag,
                    time: film.time,
                    lang: version
                }, `${baseLink}${film.link}`)
            })
        })

        console.log("Schikaneder/TopKino Fetch complete");
        resolve(schikanederMerger.films)
    })

    
}