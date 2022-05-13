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
            <button>{children}</button>
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
            <h3>Quiz Type</h3>
            <ul>
                <QuizTypeButton type="native-to"># ➔ native</QuizTypeButton>
                <QuizTypeButton type="sino-to"># ➔ sino-korean</QuizTypeButton>
                {/*
                <QuizTypeButton type="native-from">native ➔ #</QuizTypeButton>
                <QuizTypeButton type="sino-from">sino-korean ➔ #</QuizTypeButton>
                */}
            </ul>
        </section>
    </div>
}

export default QuizSelect;
