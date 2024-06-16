import { useState } from 'react'
import { new_question, Quiz } from '../lib/numbers'

import InputMultipleChoices from './InputMultipleChoices'
import QuestionResult from './QuestionResult'

type AnswerHandler = (user_answer: string) => void

type Progress = {
    correct: number,
    total: number,
    answer?: string
}

function select_input_form(quiz: Quiz, onAnswer: AnswerHandler) {
    switch (quiz.type) {
        case 'multi-choice':
            return <InputMultipleChoices choices={quiz.options} onSelect={onAnswer} />
        case 'input':
            return <textarea />
    }
}

const QuizSession = ({num_questions = 10}) => {

    const [question, setQuestion] = useState(new_question())
    const [progress, setProgress] = useState<Progress>({ correct: 0, total: 0, answer: undefined })

    function onAnswer(answer: string) {
        if (answer === question.answer) {
            setProgress(current => ({...current, correct: current.correct + 1, total: current.total + 1, answer }))
        } else {
            setProgress(current => ({...current, total: current.total + 1, answer }))
        }
    }

    function onConfirmAnswer() {
        setQuestion(new_question())
        setProgress(current => ({...current, answer: undefined}))
    }

    return <>
        <div id="quiz-progress">
            <progress max={num_questions} value={progress.total} />
            <span>{progress.correct} / {progress.total}</span>
        </div>
        <section className="question">
            {question.question}
        </section>

        {select_input_form(question, onAnswer)}

        {progress.answer ?
            <QuestionResult question={question.question}
                answer={question.answer}
                correct={progress.answer === question.answer}
                onClose={onConfirmAnswer} /> : null}
    </>


}

export default QuizSession