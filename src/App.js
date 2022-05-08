import './App.css';
import React, { useState, useEffect } from 'react';

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
                
                return <button className={[classes.join(' ')]} key={index} onClick={() => onAnswer(item)}>
                    {item}
                </button>
            })

        }
    </div>
}

function App() {

    const [question, setQuestion] = useState({options: []})
    const [answer, setAnswer] = useState(null)    

    useEffect(() => {
        setQuestion(get_question('sino'))
    }, [setQuestion])

    const nextQuestion = () => {
        setQuestion(get_question('sino'))
        setAnswer(null)
    }

    const handleAnswer = (value) => {
        setAnswer(value);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Korean Numbers</h1>
            </header>
            <main>
                <section id="top-bar">
                    <label>1 / 10</label>
                    <button className="btn btn-primary btn-small" id="btn-next"
                        onClick={nextQuestion} disabled={answer == null}>
                    <svg className="icon">
                        <use xlinkHref="#chevron-right" />
                    </svg>
                    </button>
                </section>

                <section className="question">
                    { question.text }
                </section>

                <OptionsGrid options={question.options} correct={question.answer} answer={answer} onAnswer={handleAnswer}/>
            </main>
        </div>
    );
}

export default App;
