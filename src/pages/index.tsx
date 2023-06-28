import Image from 'next/image'
import { Inter } from 'next/font/google'
import puppeteer from 'puppeteer';
import { FilmInfoCollector } from '@/classes/FilmInfoCollector';
import getVotivKinoData from '@/fetchers/votivkinoFetcher';
import getFilmcasinoData from '@/fetchers/filmcasinoFetcher';
import getGartenbauData from '@/fetchers/gartenbauFetcher';
import getAdmiralData from '@/fetchers/admiralFetcher';
import getBurgkinoData from '@/fetchers/burgkinoFetcher';
import getSchikanederOrTopkinoData from '@/fetchers/schikanederFetcher';
import { FilmInfo } from '@/interfaces/filmInfo';


const inter = Inter({ subsets: ['latin'] })

export default function Home(props: any) {
  console.log(props);

  return (
    <main
    >
        {
          props.films.map((film: FilmInfo) => {
            return(
              <div className='filmCard'>
                <h1>{film.name}</h1>
                <ul>{
                  film.presentations.map(pres => {
                    return(
                      <li>
                        <h2>{pres.date}</h2>
                        <h3>{pres.time}</h3>
                        <p>{pres.where}</p>
                          
                        {pres.room !== '' ? <p>{pres.room}</p> : <></>}
                                                
                      </li>
                    )
                  })}</ul>
              </div>
            )
          })
        }
    </main>
  )
}

export async function getStaticProps() {
  console.log("Static Props");
  const collector = new FilmInfoCollector();

  //Admiral Kino    X
  //Burg Kino       X    
  //De France       X
  //Filmcasino      X
  //Filmhaus        X
  //Gartenbaukino   X
  //Schikaneder     X
  //Stadtkino       
  //Top Kino        X
  //Votiv Kino      X

  const browser = await puppeteer.launch({ headless: "new", devtools: true });

  const crawls = await Promise.all([
    getVotivKinoData(browser),
    getFilmcasinoData(browser),
    getGartenbauData(browser),
    getAdmiralData(browser),
    getBurgkinoData(browser),
    getSchikanederOrTopkinoData(browser, "Schikaneder"),
    getSchikanederOrTopkinoData(browser, "Topkino")
  ])

  crawls.forEach(crawl => {
    crawl.forEach(film => {
      collector.addPresenations(film.name, film.presentations)
    })
  })

  

  await browser.close();

  return {
    props:{
      films: collector.getFilms()
    }
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds// In seconds
  };
}
