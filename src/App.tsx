import './App.css';
import { useState, useCallback } from 'react';

import QuizSession from './components/QuizSession'
import ConfigOptions from './components/ConfigOptions'
import { QuizConfig, DEFAULT_CONFIG  } from './lib/numbers'

type GamePhase = 'config' | 'quiz' | 'result'

const Header = (props: { title: string, onHomeClick: () => void }) => {
    const { title, onHomeClick } = props;
    return <header>
        <svg className="icon .icon-btn" onClick={onHomeClick}>
            <use href="#home" />
        </svg>
        <h1>{title}</h1>
    </header>
}

function App() {

    const [config, setConfig] = useState<QuizConfig>(DEFAULT_CONFIG)
    const [phase, setPhase] = useState<GamePhase>('config');

    const start = useCallback((cfg: QuizConfig) => {
        console.info(`Starting with configuration ${JSON.stringify(cfg)}`)
        setConfig(cfg)
        setPhase('quiz')
    }, [setConfig, setPhase])

    let mainContent
    if (phase === 'quiz') {
        mainContent = <QuizSession config={config} onComplete={(_res) => setPhase('config')} />
    } else if (phase == 'config') {
        mainContent = <ConfigOptions config={config} onStart={start} />
    }

    return (
        <div className="App">
            <Header title={'둘셋'} onHomeClick={() => setPhase('config')} />
            <main>
                {mainContent}
            </main>
        </div>
    );
}

export default App;
