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
import FilmCard from '@/components/filmCard';
import { useState } from 'react';


const inter = Inter({ subsets: ['latin'] })

export default function Home(props: any) {
  console.log(props);
  const [compact, setCompact] = useState(true);

  return (
    <main
    >
      <button onClick={()=>{
        setCompact(cmp => !cmp)
      }}>SWITCH</button>
      {
        props.films.map((film: FilmInfo) => {
          return (
            <FilmCard film={film} compact={compact}/>
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
      collector.addPresenations(film.name, film.link, film.presentations)
    })
  })



  await browser.close();

  return {
    props: {
      films: collector.getFilms()
    },
    revalidate: (12 * 60 * 60)
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds// In seconds
  };
}
