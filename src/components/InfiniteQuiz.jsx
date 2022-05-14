import React, { useState } from 'react'

import QuizQuestion from './QuizQuestion';

import { get_question } from '../lib/numbers'

const generateQuiz = (config) => {
    const type = config.type
    const level = config.level || 2
    const numAnswers = level >= 2 ? 4 : 3
    const numDigits = level
    return get_question(type, numAnswers, numDigits)
}

const InfiniteQuiz = (props) => {
    const { config } = props

    const [question, setQuestion] = useState(generateQuiz(config))
    const [answered, setAnswered] = useState(false)

    const nextQuestion = () => {
        setQuestion(generateQuiz(config))
        setAnswered(false)
    }

    return <div className="quiz">
        <QuizQuestion question={question}
            onAnswer={() => { setAnswered(true) }} />
        <button id="button-next" className="btn btn-primary btn-wide"
            onClick={nextQuestion} disabled={!answered}>
            <svg className="icon">
                <use xlinkHref="#chevron-right" />
            </svg>
        </button>
    </div>

}

export default InfiniteQuiz
