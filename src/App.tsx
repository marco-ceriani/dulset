import './App.css';
import React, { useState } from 'react';

import QuizSelect from './components/QuizSelect';
import InfiniteQuiz from './components/InfiniteQuiz'
import { getQuizTitle } from './lib/numbers'

const Header = (props) => {
    const { title, onHomeClick } = props;
    return <header>
            <svg className="icon .icon-btn" onClick={onHomeClick}>
                <use href="#home" />
            </svg>
            <h1>{title}</h1>
    </header>
}

function App() {

    const [quizConfig, setQuizConfig] = useState(null)

    const resetQuizConfig = () => {
        setQuizConfig(null)
    }

    const selectQuizConfig = (type, difficulty) => {
        const config = {
            type: type,
            level: difficulty,
            title: getQuizTitle(type)
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
