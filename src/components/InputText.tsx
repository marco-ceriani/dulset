import { useState, useEffect } from 'react'

interface Props {
    onSubmit: (choice: string) => void
}

const InputText = (props: Props) => {
    const [text, setText] = useState('')
    const { onSubmit } = props

    useEffect(() => {
        setText('')
    }, [props])

    return <section className="text-input-area">
        <textarea value={text} onChange={(e) => setText(e.target.value)}/>
        <button className="btn" disabled={text.length == 0} onClick={() => onSubmit(text)}>Submit</button>
    </section>
}

export default InputText