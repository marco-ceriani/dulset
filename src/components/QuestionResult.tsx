import { useRef, useEffect, ReactEventHandler, SyntheticEvent } from 'react'

const QuestionResult = (props: {question: string, answer: string, correct: boolean, onClose: ReactEventHandler}) => {

    const {question, answer, correct, onClose} = props

    const ref = useRef<HTMLDialogElement>(null)
    useEffect(() => ref.current?.showModal())

    const clicked = (e: SyntheticEvent) => {
        onClose(e)
    }

    const classes = ["result-panel", correct ? "correct" : "wrong"].join(" ")
    return <dialog ref={ref} onCancel={clicked} className={classes} onClick={clicked}>
            <label>{question}</label>
            <label>{answer}</label>
            <button autoFocus onClick={clicked} className="btn">Continue</button>
    </dialog>
}

export default QuestionResult
