import { useState, useEffect } from 'react'

interface Props {
    tokens: string[],
    choices: string[],
    onAnswered: (choice: string) => void
}

function nextBlank(values: string[], currentBlank = -1) {
    return values.indexOf('', currentBlank + 1)
}

function computeState(tokens: string[], choices: string[]) {
    return {
        index: nextBlank(tokens),
        tokens,
        choices: choices.map(value => ({text: value, enabled: true}))
    }
}

const InputFillBlanks = (props: Props) => {
    const { tokens, choices, onAnswered } = props
    
    const [state, setState] = useState(computeState(tokens, choices))
    useEffect(() => {
        setState(computeState(tokens, choices))
    }, [props])
    
    console.debug(`rendering InputFillBlanks, props: ${JSON.stringify(props)}, state: ${JSON.stringify(state)}`)

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
            onAnswered(newTokens.join(''))
        }
    }

    return <section className="fill-blanks">
        <div>
        {
            state.tokens.map((item, index) => {
                if (item == '') {
                    return <label key={`blank-${index}`} className='blank-spot'></label>
                } else {
                    return <label key={`${item}-${index}`}>{item}</label>
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