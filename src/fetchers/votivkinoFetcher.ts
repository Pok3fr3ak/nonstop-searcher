import { FetchingStructure } from "@/interfaces/fetchingStructure";
import { Presentation } from "@/interfaces/presentation";
import { Browser } from "puppeteer";

export default async function getVotivKinoData(browser: Browser): Promise<FetchingStructure[]>{
    const page = await browser.newPage();

    await page.goto("https://votivkino.at/programm/", {waitUntil: "domcontentloaded"});
    //FETCHING FROM Votiv Kino

    return new Promise(async (resolve, reject)=>{
        const votivKinoCrawl = await page.evaluate(() => {
            const filmRows = document.querySelectorAll("tr.week-film-row");
            return Array.from(filmRows).map(el => {
                const presentations: Presentation[] = [];
                const lang = filmRows[0].querySelector(".details .pad-r-sma")?.textContent ?? "";
                Array.from(el.children).forEach((child, i) => {
                    if (i !== 0) {
                        let date = child.querySelector("a > span.week-show-default")?.getAttribute("id")?.split("has-show-on-")[1].toString();
                        let time = child.querySelector("time")?.textContent ?? "noTime";
                        let where = child.querySelector("a span.location .kinotag")?.textContent ?? "-";
                        let room = child.querySelector("a span.location")?.innerHTML;

                        if (room !== undefined && room !== null) room = room?.split("|")[1].split("</span> ")[1].toString().replaceAll(/&nbsp;/g, " ");
                        if (time !== null && time !== undefined) time = time.substring(3);
                        if (room === undefined || room === undefined) room = "";

                        if (date !== null && date !== undefined) {
                            presentations.push(
                                {
                                    where,
                                    room,
                                    date,
                                    time,
                                    lang,
                                })
                        }
                    }
                })
                return {
                    name: el.children[0].children[0].children[0].textContent ?? "noName",
                    link: el.children[0].children[0].getAttribute("href") ?? "noLink",
                    presentations: presentations
                }
            })
        })

        page.close();

        resolve(votivKinoCrawl)
    })
}