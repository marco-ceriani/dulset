import { useState, useCallback } from 'react'
import { new_question, Quiz } from '../lib/numbers'

import InputMultipleChoices from './InputMultipleChoices'
import InputText from './InputText'
import InputFillBlanks from './InputFillBlanks'
import QuestionResult from './QuestionResult'
import type { QuizResult } from './types'
import type { QuizConfig } from '../lib/numbers'

type AnswerHandler = (user_answer: string) => void

type Progress = {
    correct: number,
    total: number,
    answer?: string
}

function select_input_form(question: Quiz, onAnswer: AnswerHandler) {
    switch (question.type) {
        case 'multi-choice':
            return <InputMultipleChoices choices={question.options} onSelect={onAnswer} />
        case 'input':
            return <InputText onSubmit={onAnswer}/>
        case 'fill-blanks':
            return <InputFillBlanks tokens={question.tokens} choices={question.options} onSelect={onAnswer} />
    }
}

const QuizSession = (props: { config: QuizConfig, onComplete: (res: QuizResult) => void}) => {
    const { config, onComplete } = props
    console.log(`rendering QuizSession`)

    const [question, setQuestion] = useState(new_question(config))
    const [progress, setProgress] = useState<Progress>({ correct: 0, total: 0, answer: undefined })

    const onAnswer = useCallback((answer: string) => {
        const new_total = progress.total + 1
        const num_correct = progress.correct + (answer === question.answer ? 1 : 0)
        setProgress({...progress, answer, total: new_total, correct: num_correct})
    }, [progress, setProgress])
    
    function onConfirmAnswer() {
        if (progress.total >= config.num_questions) {
            onComplete({num_correct: progress.correct})
        } else {
            setQuestion(new_question(config))
            setProgress(current => ({ ...current, answer: undefined }))
        }
    }

    return <>
        <div id="quiz-progress">
            <progress max={config.num_questions} value={progress.total} />
            <span>{progress.correct} / {progress.total}</span>
        </div>
        <section className="question">
            {question.question}
        </section>
        <span className="subtitle">Number system: {question.system}</span>

        {select_input_form(question, onAnswer)}

        {progress.answer ?
            <QuestionResult question={question.question}
                answer={question.answer}
                correct={progress.answer === question.answer}
                onClose={onConfirmAnswer} /> : null}
    </>


}

export default QuizSession