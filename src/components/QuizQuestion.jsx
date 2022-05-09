import React, { useState, useEffect } from 'react';

const computeClasses = (option, answer, correctAnswer) => {
    if (answer && option === correctAnswer) {
        return "option-btn option-right";
    }
    if (option === answer) {
        return "option-btn option-wrong";
    }
    return "option-btn"
}

const QuizQuestion = (props) => {

    const { question, onAnswer } = props;

    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        setAnswer(null);
    }, [question])

    const clickHandler = (value) => {
        if (!answer) {
            setAnswer(value);
            onAnswer(value === question.answer);
        }
        return false;
    }

    return <>
        <section className="question">
            {question.text}
        </section>
        <section className="options-grid">
            {
                question.options.map((item, index) => {
                    const classes = computeClasses(item, answer, question.answer)
                    return <button key={index}
                        className={classes}
                        onClick={() => clickHandler(item)} >
                        { item }
                    </button>
                })

            }
        </section>
    </>
}

export default QuizQuestion;
