import './App.css';
import { useState } from 'react';

import QuizSession from './components/QuizSession'
import type { QuizConfig } from './lib/numbers'

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

function valid_config(cfg: QuizConfig) {
    return cfg.native || cfg.sino_korean
}

function Options(props: { cfg: QuizConfig, setConfig: (cfg: (old: QuizConfig) => QuizConfig) => void, onStart: () => void }) {

    const { cfg, setConfig, onStart } = props

    return <section className="config-section">
        <div>
            <label htmlFor="enable-sino-korean">Sino-Korean numbers</label>
            <input type="checkbox" id="enable-sino-korean" checked={cfg.sino_korean} onChange={(evt) =>
                setConfig(prevCfg => ({ ...prevCfg, sino_korean: evt.target.checked }))
            } />
        </div>
        <div>
            <label htmlFor="enable-native">Native Korean numbers</label>
            <input type="checkbox" id="enable-native" checked={cfg.native} onChange={(evt) =>
                setConfig(prevCfg => ({ ...prevCfg, native: evt.target.checked }))
            } />
        </div>
        <button className="btn btn-primary" disabled={!valid_config(cfg)} onClick={onStart}>Start</button>
    </section>
}

function App() {

    const [config, setConfig] = useState<QuizConfig>({
        sino_korean: true,
        native: true,
        num_questions: 5
    })
    const [phase, setPhase] = useState<GamePhase>('config');

    let mainContent
    if (phase === 'quiz') {
        mainContent = <QuizSession config={config} onComplete={(_res) => setPhase('config')} />
    } else if (phase == 'config') {
        mainContent = <Options cfg={config} setConfig={setConfig} onStart={() => setPhase('quiz')} />
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
