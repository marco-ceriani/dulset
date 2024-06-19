import { useState } from 'react'
import { QuizConfig, validate_config } from '../lib/numbers'

interface Props {
    config: QuizConfig
    onStart: (cfg: QuizConfig) => void
}

function ConfigOptions(props: Props) {

    const { config: cfg, onStart } = props

    const [config, setConfig] = useState<QuizConfig>(cfg)

    return <section className="config-section">
        <div>
            <label htmlFor="enable-sino-korean">Sino-Korean numbers</label>
            <input type="checkbox" id="enable-sino-korean" checked={config.sino_korean} onChange={(evt) =>
                setConfig(prevCfg => ({ ...prevCfg, sino_korean: evt.target.checked }))
            } />
        </div>
        <div>
            <label htmlFor="enable-native">Native Korean numbers</label>
            <input type="checkbox" id="enable-native" checked={config.native} onChange={(evt) =>
                setConfig(prevCfg => ({ ...prevCfg, native: evt.target.checked }))
            } />
        </div>
        <div>
            <label htmlFor="num_questions">Number of questions</label>
            <select id="num_questions" className="select" onChange={(evt => 
                setConfig(prevCfg => ({...prevCfg, num_questions: +evt.target.value}))
            )}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
        </div>
        <button className="btn btn-primary" disabled={!validate_config(config)} onClick={() => onStart(config)}>Start</button>
    </section>
}

export default ConfigOptions