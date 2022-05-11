import './App.css';
import React, { useState, useEffect } from 'react';

import QuizQuestion from './components/QuizQuestion';
import QuizSelect from './components/QuizSelect';

import { get_question } from './lib/numbers.js'

function App() {

    const [quizConfig, setQuizConfig] = useState({})
    const [question, setQuestion] = useState({ options: [] })
    const [answered, setAnswered] = useState(false)

    useEffect(() => {
        setQuestion(get_question(quizConfig?.type, 4, quizConfig?.level))
    }, [quizConfig, setQuestion])

    const nextQuestion = () => {
        setQuestion(get_question(quizConfig?.type, 4, quizConfig?.level))
        setAnswered(false)
    }

    const resetQuizConfig = () => {
        setQuizConfig({})
    }

    const selectQuizConfig = (type, difficulty) => {
        const pieces = type.split('-');
        setQuizConfig({
            type: pieces[0],
            level: difficulty
        })
    }

    let mainBody = null;
    if (quizConfig?.type) {
        mainBody = <>
            <QuizQuestion question={question} onAnswer={() => { setAnswered(true) }} />
            <div className="container">
                <button className="btn btn-primary btn-small" id="btn-next"
                    onClick={nextQuestion} disabled={!answered}>
                    <svg className="icon">
                        <use xlinkHref="#chevron-right" />
                    </svg>
                </button>
            </div>
        </>
    } else {
        mainBody = <QuizSelect onSelect={selectQuizConfig} />
    }

    return (
        <div className="App">
            <header>
                <div className="container top-bar">
                    <svg className="icon" onClick={resetQuizConfig}>
                        <use href="#home" />
                    </svg>
                    <h2 className="pageTitle">{quizConfig?.type}</h2>
                </div>
            </header>
            <main>
                {mainBody}
            </main>
        </div>
    );
}

export default App;
