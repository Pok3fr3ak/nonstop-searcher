type PseudoCalenderProps = {
    date: string
}

const PseudoCalenderIcon: React.FC<PseudoCalenderProps> = ({ date }) => {
    return (
        <div className="pseudoCalenderIcon">
            <span>{date}</span>
        </div>
    )
}

export default PseudoCalenderIcon;