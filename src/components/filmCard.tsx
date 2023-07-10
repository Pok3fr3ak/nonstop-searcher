import { FilmInfo } from "@/interfaces/filmInfo"
import PseudoCalenderIcon from "./pseudoCalenderIcon"

type FilmCardProps = {
    film: FilmInfo
    compact: boolean
}

const FilmCard: React.FC<FilmCardProps> = ({ film, compact }) => {
    return (
        <article className='filmCard' key={film.name}>
            <header>
                <h1>{film.name}</h1>
            </header>
            <section>
                {
                    compact ?
                    <div style={{display: "flex", gap: "1em", flexWrap: "wrap"}}>
                        {   
                            film.dates.map(date => {
                                return <PseudoCalenderIcon date={new Date(date).toLocaleDateString("de-DE", { month: "numeric", day: "numeric" })}/>
                            })
                        }
                    </div> : 
                    <>
                        <ul>{
                            film.presentations.map(pres => {
                                const date = new Date(`${pres.date} ${pres.time}`)
                                return (
                                    <li key={`${pres.where}-${pres.date}-${pres.time}`}>
                                        <h2>{`${date.toLocaleDateString("de-DE", { weekday: "short", month: "long", day: "numeric" })}`}</h2>
                                        <h3>{pres.time}</h3>
                                        <div>
                                            <p className="kino">{pres.where}</p>

                                            {pres.room !== '' ? <p className="room">{pres.room}</p> : <></>}
                                        </div>
                                    </li>
                                )
                            })}</ul>
                    </>
                }
            </section>
        </article>
    )
}

export default FilmCard;