interface Props {
    choices: string[],
    onSelect: (choice: string) => void
}

const InputMultipleChoices = (props: Props) => {
    const { choices, onSelect } = props

    return <section className="options-grid">
        {
            choices.map((item, index) => {
                return <button key={index}
                    className="option-btn"
                    onClick={() => onSelect(item)} >
                    {item}
                </button>
            })

        }
    </section>
}

export default InputMultipleChoices