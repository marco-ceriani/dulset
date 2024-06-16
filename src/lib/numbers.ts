import { Wheel, random_item, shuffle } from './random'

const native_numbers_units = {
    1: '하나',  // hana
    2: '둘',    // dul
    3: '셋',   // set
    4: '넷',    // net
    5: '다섯',  // daseot
    6: '여섯',  // yeoseot
    7: '일곱',  // ilgop
    8: '여덟',  // yeodeol
    9: '아홉',  // ahop
    10: '열'   // yeol
}

const native_numbers_tens = {
    10: '열',   // yeol
    20: '스물', // seumul
    30: '서른', // seoreun
    40: '마흔', // maheun
    50: '쉰',   // swin
    60: '예순', // yesun
    70: '일흔', // ilheun
    80: '여든', // yeodeun
    90: '아흔'  // aheun
}

const sino_numbers = {
    1: '일',    // il
    2: '이',    // i
    3: '삼',    // sam
    4: '사',    // sa
    5: '오',    // o
    6: '육',    // yuk
    7: '칠',    // chil
    8: '팔',    // pal
    9: '구'     // gu
}

const sino_positional = {
    1: '',
    10: '십',   // sip
    100: '백',
    1000: '천',
    10000: '만'
}

const generate_native_number = (length = 1) => {
    let value = 0
    let text = ''
    if (length > 1) {
        const [digit, name] = new Wheel(Object.entries(native_numbers_tens)).getItem()
        value += parseInt(digit, 10)
        text += name
    }
    const [digit, name] = new Wheel(Object.entries(native_numbers_units)).getItem()
    if (digit !== '10' || length === 1) {
        value += parseInt(digit, 10)
        text += name
    }
    return {
        number: value,
        text: text
    }
}

const generate_sino_korean_number = (length = 1) => {
    let value = 0;
    let text = ''
    const wheel = new Wheel(Object.entries(sino_numbers));
    console.group('generate sino-korean number')
    for (let i = 0, v = 1; i < length; i++, v *= 10) {
        const [digit, name] = wheel.getItem()
        console.debug(`digit ${digit} : ${name}`)
        if (digit === '1') {
            text = (<any>sino_positional)[v.toString()] + text;
            value += parseInt(digit) * v;
        } else if (digit !== '10') {
            text = name + (<any>sino_positional)[v] + text;
            value += parseInt(digit) * v;
        }
    }
    console.groupEnd()
    return {
        number: value,
        text: text
    }
}

export function get_question(type: string, num_options = 4, length = 2) {
    if (!type) {
        console.error('Invalid type')
        return {}
    }
    let generator = null
    if (type === 'native-to' || type === 'native-from') {
        generator = generate_native_number
    } else {
        generator = generate_sino_korean_number
    }

    const answers = new Map();
    while (answers.size < num_options) {
        const answer = generator(length);
        if (type.endsWith('-to')) {
            answers.set(answer.number, answer.text);
        } else {
            answers.set(answer.text, answer.number);
        }
    }
    const choices = [...answers]
    const correctChoice = choices[choices.length * Math.random() << 0];

    return {
        'options': choices.map(x => x[1]),
        'text': correctChoice[0],
        'answer': correctChoice[1]
    }
}

export const getQuizTitle = (type: string) => {
    return type.startsWith('sino-') ? 'Sino-Korean' : 'Native'
}

export type Quiz = {
    question: string,
    answer: string
} & (
        { type: 'multi-choice', options: string[] } |
        { type: 'input' }
    )


function guess_value(number: number, text: string) {
    return {question: text, answer: number.toString()}
}

function guess_name(number: number, text: string) {
    return {question: number.toString(), answer: text}
}

export function new_question(num_digits = 4): Quiz {

    const generator = random_item([generate_sino_korean_number, generate_native_number])
    const direction = random_item([guess_value, guess_name])

    const{number, text} = generator(num_digits)
    const {question, answer} = direction(number, text)

    const num_options = 4;
    const options = shuffle(Array.from({length: num_options - 1}, (_) => {
        const {number,text} = generator(num_digits); 
        return direction(number, text).answer;}
    ).concat([answer]))

    return {
        question,
        answer,
        type: 'multi-choice',
        options
    }
}