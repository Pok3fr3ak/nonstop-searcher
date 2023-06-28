import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Presentation } from "@/interfaces/presentation";
import { Browser } from "puppeteer";

export default async function getAdmiralData(browser: Browser): Promise<FetchingStructure[]> {
    const page = await browser.newPage();
    
    await page.goto("https://admiralkino.at")
    
    return new Promise(async (resolve, reject) => {
        const admiralLinks = await page.evaluate(() => {
            const filmlinks = document.querySelectorAll("a.movie");
            return Array.from(filmlinks).map(l => l.getAttribute("href") ?? "/")
        })
        const promises:Promise<FetchingStructure>[] = [];

        for (let i = 0; i < admiralLinks.length - 1; i++) {
            promises.push(new Promise(async (resolve, reject) => {
                const localPage = await browser.newPage();
                let link = admiralLinks[i];
                console.log(`Loop: i: ${i} - ${link}`);

                await localPage.goto("https://admiralkino.at/" + link + "/", { waitUntil: "domcontentloaded" })
                const data = await localPage.evaluate(() => {
                    const name = document.querySelector("section.hero-left h1")?.textContent ?? "no Name";
                    const nonstop = (document.querySelector("section.hero-right")?.textContent ?? "").toUpperCase().includes("MIT DEM NONSTOP KINOABO BESUCHBAR");
                    const screenings = document.querySelectorAll("div.event-showtimes ul li");
                    const presentations: Presentation[] = [];
                    //console.log(name, nonstop, screenings, presentations);

                    Array.from(screenings).forEach(li => {
                        if (li.textContent !== "" && li.textContent !== null) {

                            presentations.push({
                                where: "Admiral Kino",
                                room: "",
                                date: li.textContent.split("-")[0].trim(),
                                time: li.textContent.split("-")[1].trim(),
                                lang: null,
                            })
                        }
                    })

                    return {
                        name,
                        nonstop,
                        presentations
                    }
                }).then(data => {
                    return data
                })
                localPage.close();
                resolve(data)
            }))
        }

        page.close();
        resolve(await Promise.all(promises))
    })
}