import React, { useState } from 'react';


const QuizSelect = (props) => {
    const { onSelect } = props;

    const [difficulty, setDifficulty] = useState(1);

    const openQuiz = (type) => {
        if (typeof onSelect === 'function') {
            onSelect(type, difficulty);
        }
    }

    const QuizTypeButton = (props) => {
        const { type, children } = props;
        return <button className="quiz-select-btn" onClick={() => openQuiz(type)}>
            {children}
        </button>
    }

    return <div className="quiz-selection">
        <div>
            <h3>Difficulty</h3>
            <input type="range" min="1" max="3"
                aria-label="select difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))} />
        </div>
        <section>
            <h3>Native Numbers</h3>
            <div className="options-group">
                <QuizTypeButton type="native-to">1 ➔ 하나</QuizTypeButton>
                <QuizTypeButton type="native-from">하나 ➔ 1</QuizTypeButton>
            </div>
            <h3>Sino-Korean Numbers</h3>
            <div className="options-group">
                <QuizTypeButton type="sino-to">1 ➔ 일</QuizTypeButton>
                <QuizTypeButton type="sino-from">일 ➔ 1</QuizTypeButton>
            </div>
        </section>
    </div>
}

export default QuizSelect;
