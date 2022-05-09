import './App.css';
import React, { useState, useEffect } from 'react';

import QuizQuestion from './components/QuizQuestion';

import { get_question } from './lib/numbers.js'

const OptionsGrid = (props) => {
    const { options, correct, answer, onAnswer } = props;
    return <div className="options-grid">
        {
            options.map((item, index) => {
                const classes = ["option-btn"]
                if (answer && item === correct) {
                    classes.push("option-right")
                }
                if (item === answer) {
                    classes.push("option-wrong")
                }
                const handler = (!answer ? (event) => {
                    onAnswer(item);
                    event.stopPropagation();
                } : () => void 0);

                return <button className={[classes.join(' ')]} key={index} onClick={handler} disabled={answer != null}>
                    {item}
                </button>
            })

        }
    </div>
}

function App() {

    const [quizType, setQuizType] = useState("sino")
    const [question, setQuestion] = useState({ options: [] })
    const [answered, setAnswered] = useState(false)

    useEffect(() => {
        setQuestion(get_question(quizType))
    }, [quizType, setQuestion])

    const handleQuizChange = (e) => {
        setQuizType(e.target.value)
    }

    const nextQuestion = () => {
        setQuestion(get_question(quizType))
        setAnswered(false)
    }

    return (
        <div className="App">
            <header>
                <div className="container top-bar">
                    <select id="quiz-select" onChange={handleQuizChange}>
                        <option value="sino">Sino Korean</option>
                        <option value="native">Native Korean</option>
                    </select>

                </div>
            </header>
            <main className="container">
                <QuizQuestion quizType={quizType} question={question} onAnswer={() => { setAnswered(true) }} />
                <div className="container">
                    <button className="btn btn-primary btn-small" id="btn-next"
                        onClick={nextQuestion} disabled={!answered}>
                        <svg className="icon">
                            <use xlinkHref="#chevron-right" />
                        </svg>
                    </button>

                </div>
            </main>
        </div>
    );
}

export default App;
