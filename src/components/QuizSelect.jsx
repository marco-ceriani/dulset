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
        return <li onClick={() => openQuiz(type)}>
            <button className="quiz-select-btn">{children}</button>
        </li>
    }

    return <div className="quiz-selection">
        <div className="slider-container">
            <h3>Difficulty</h3>
            <input type="range" min="1" max="3"
                aria-label="select difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))} />
        </div>
        <section className="options-group">
            <h3>Native Numbers</h3>
            <ul>
                <QuizTypeButton type="native-to">1 ➔ 하나</QuizTypeButton>
                <QuizTypeButton type="sino-to">1 ➔ 일</QuizTypeButton>
            </ul>
            <h3>Sino-Korean Numbers</h3>
            <ul>
                <QuizTypeButton type="native-from">하나 ➔ 1</QuizTypeButton>
                <QuizTypeButton type="sino-from">일 ➔ 1</QuizTypeButton>
            </ul>
        </section>
    </div>
}

export default QuizSelect;
