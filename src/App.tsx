import './App.css';
import { useState } from 'react';

import QuizSession from './components/QuizSession'

const Header = (props: {title: string, onHomeClick: () => void}) => {
    const { title, onHomeClick } = props;
    return <header>
            <svg className="icon .icon-btn" onClick={onHomeClick}>
                <use href="#home" />
            </svg>
            <h1>{title}</h1>
    </header>
}

function App() {

    const [config, setConfig] = useState({
        //sino_korean: true,
        //native_korean: true,
        num_questions: 10
    })

    const resetQuizConfig = () => {
        setConfig({
            //sino_korean: true,
            //native_korean: true,
            num_questions: 10
        })
    }

  return (
        <div className="App">
            <Header title={'둘셋'} onHomeClick={resetQuizConfig} />
            <main>
                <QuizSession num_questions={config.num_questions}/>
            </main>
      </div>
    );
}

export default App;
