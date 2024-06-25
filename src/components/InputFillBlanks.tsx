import { useState, useEffect } from 'react'

interface Props {
    tokens: string[],
    choices: string[],
    onSelect: (choice: string) => void
}

function nextBlank(values: string[], currentBlank = -1) {
    return values.indexOf('', currentBlank + 1)
}

const InputFillBlanks = (props: Props) => {
    console.log(`rendering input: ${JSON.stringify(props)}`)
    const { tokens, choices, onSelect } = props
    
    const [state, setState] = useState({
        index: nextBlank(tokens),
        tokens,
        choices: choices.map(value => ({text: value, enabled: true}))
    })
    
    useEffect(() => {
        setState({
            index: nextBlank(tokens),
            tokens, 
            choices: choices.map(value => ({text: value, enabled: true}))
        })
    }, [tokens, choices])

    console.log(state)

    function clickHandler(clickedIndex: number) {
        const newIndex = nextBlank(tokens, state.index)
        const clickedChoice = state.choices[clickedIndex]
        const new_choices = [...state.choices]
        new_choices[clickedIndex].enabled = false
        const newTokens = [...state.tokens]
        newTokens[state.index] = clickedChoice.text
        setState({
                index: newIndex,
                tokens: newTokens,
                choices: new_choices
        })
        if (newIndex == -1) {
            onSelect(newTokens.join(''))
        }
    }

    return <section className="fill-blanks">
        <div>
        {
            state.tokens.map((item, index) => {
                if (item == '') {
                    return <label key={index} className='blank-spot'></label>
                } else {
                    return <label key={index}>{item}</label>
                }
            })
        }
        </div>
        <div>
        {
            state.choices.map((item, index) => {
                return <button key={`opt-${index}`} className="btn" disabled={!item.enabled} onClick={() => clickHandler(index)}>{item.text}</button>
            })
        }
        </div>
    </section>
}

export default InputFillBlanks