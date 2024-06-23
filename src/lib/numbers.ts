import { Wheel, WeightedWheel, Weighted, random_item, shuffle } from './random'

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
    for (let i = 0, v = 1; i < length; i++, v *= 10) {
        const [digit, name] = wheel.getItem()
        console.debug(`digit ${digit} : ${name}`)
        if (digit === '1' && v != 1) {
            text = (<any>sino_positional)[v.toString()] + text;
            value += parseInt(digit) * v;
        } else if (digit !== '10') {
            text = name + (<any>sino_positional)[v] + text;
            value += parseInt(digit) * v;
        }
    }
    return {
        number: value,
        text: text
    }
}

type QuizInput = 'multi-choice' | 'input'
type NumberSystem = 'Sino-Korean' | 'Native Korean'

export type Quiz = {
    question: string,
    answer: string
} & (
        { type: 'multi-choice', options: string[] } |
        { type: 'input', system: NumberSystem }
    )


function guess_value(number: number, text: string) {
    return {question: text, answer: number.toString()}
}

function guess_name(number: number, text: string) {
    return {question: number.toString(), answer: text}
}

export type QuizConfig = {
    sino_korean: boolean,
    native: boolean,
    num_questions: number
}

export const DEFAULT_CONFIG = {
    sino_korean: true,
    native: true,
    num_questions: 10
}

const number_generators = {
    'Sino-Korean': generate_sino_korean_number,
    'Native Korean': generate_native_number
}

export function validate_config(cfg: QuizConfig) {
    return cfg.native || cfg.sino_korean
}

export function new_question(config: QuizConfig): Quiz {

    // which kind of number?
    const number_systems: NumberSystem[] = []
    if (config.native) {
        number_systems.push('Native Korean')
    }
    if (config.sino_korean) {
        number_systems.push('Sino-Korean')
    }
    if (number_systems.length === 0) {
        throw new Error("At least one of sino-korean and native numbers must be enabled")
    }
    const number_system = random_item(number_systems)
    const generator_func = number_generators[number_system]!

    let num_digits = 2;
    if (number_system == 'Sino-Korean') {
        num_digits = new WeightedWheel<number>([[1, 1], [2, 5], [3, 5], [4, 2], [5, 1]]).getItem()
    }

    // type of quiz

    const inputType = new WeightedWheel([['multi-choice', 3], ['input', 1]] as Weighted<QuizInput>[]).getItem()

    if (inputType == 'multi-choice') {
        const direction = random_item([guess_value, guess_name])

        const{number, text} = generator_func(num_digits)
        const {question, answer} = direction(number, text)
    
        const num_options = 4;
        const options = shuffle(Array.from({length: num_options - 1}, (_) => {
            const {number,text} = generator_func(num_digits); 
            return direction(number, text).answer;}
        ).concat([answer]))
    
        return {
            type: 'multi-choice',
            question,
            answer,
            options
        }
    } else if (inputType == 'input') {
        const{number, text} = generator_func(num_digits)
        return {
            type: 'input',
            question: number.toString(),
            answer: text,
            system: number_system
        }
    } else {
        throw new Error("Invalid quiz type")
    }


}