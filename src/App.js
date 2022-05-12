import './App.css';
import React, { useState } from 'react';

import QuizSelect from './components/QuizSelect';

import InfiniteQuiz from './components/InfiniteQuiz'

const Header = (props) => {
    const { title, onHomeClick } = props;
    return <header>
        <div className="container top-bar">
            <svg className="icon" onClick={onHomeClick}>
                <use href="#home" />
            </svg>
            <h2 className="pageTitle">{title}</h2>
        </div>
    </header>
}

function App() {

    const [quizConfig, setQuizConfig] = useState(null)

    const resetQuizConfig = () => {
        setQuizConfig(null)
    }

    const selectQuizConfig = (type, difficulty) => {
        const pieces = type.split('-');
        const realType = pieces[0];
        const config = {
            type: realType,
            level: difficulty,
            title: realType === 'sino' ? 'Sino-Korean' : 'Native'
        }
        setQuizConfig(config)
    }

    return (
        <div className="App">
            <Header title={quizConfig?.title || '둘셋'} onHomeClick={resetQuizConfig} />
            <main>
                {
                    quizConfig
                        ? <InfiniteQuiz config={quizConfig} />
                        : <QuizSelect onSelect={selectQuizConfig} />
                }
            </main>
        </div>
    );
}

export default App;
