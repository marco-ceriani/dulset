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

// derived lists
const all_native_syllables = Object.values(native_numbers_units)
    .concat(Object.values(native_numbers_tens))
    .join('').split('')

const all_sino_korean_syllables = Object.values(sino_numbers)
    .concat(Object.values(sino_positional)
        .filter(v => v != ''))

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

function random_native_syllables(size: number) {
    return shuffle(all_native_syllables).slice(0, size)

}

function random_sino_korean_syllables(size: number) {
    return shuffle(all_sino_korean_syllables).slice(0, size)
}

function random_digits(size: number) {
    return shuffle(['1','2','3','4','5','6','7','8','9','0']).slice(0, size)
}

type QuizInput = 'multi-choice' | 'input' | 'fill-blanks'
type NumberSystem = 'Sino-Korean' | 'Native Korean'

export type Quiz = {
    question: string,
    answer: string,
    system: NumberSystem
} & (
        { type: 'multi-choice', options: string[] } |
        { type: 'input' } |
        { type: 'fill-blanks', tokens: string[], options: string[] }
    )


function guess_value(number: number, text: string) {
    return { question: text, answer: number.toString() }
}

function guess_name(number: number, text: string) {
    return { question: number.toString(), answer: text }
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

    const inputType = new WeightedWheel([['multi-choice', 3], ['input', 1], ['fill-blanks', 4]] as Weighted<QuizInput>[]).getItem()

    if (inputType == 'multi-choice') {
        const direction = random_item([guess_value, guess_name])

        const { number, text } = generator_func(num_digits)
        const { question, answer } = direction(number, text)

        const num_options = 4;
        const options = shuffle(Array.from({ length: num_options - 1 }, (_) => {
            const { number, text } = generator_func(num_digits);
            return direction(number, text).answer;
        }
        ).concat([answer]))

        return {
            type: 'multi-choice',
            question,
            answer,
            system: number_system,
            options
        }
    } else if (inputType == 'input') {
        const { number, text } = generator_func(num_digits)
        return {
            type: 'input',
            question: number.toString(),
            answer: text,
            system: number_system
        }
    } else if (inputType == 'fill-blanks') {
        const quiz_function = new WeightedWheel([[guess_name, 3], [guess_value, 1]]).getItem()
        const { number, text } = generator_func(Math.max(num_digits, 3))
        const { question, answer } = quiz_function(number, text)

        const syllables = answer.split('')
        const num_blanks = Math.ceil(syllables.length / 4)
        const blank_positions = shuffle(Array.from(Array(syllables.length), (_, i) => i)).slice(0, num_blanks)

        const tokens = syllables.map((val, index) => (index in blank_positions) ? '' : val)
        const correct_options = syllables.filter((_, index) => index in blank_positions)
        const num_random_options = 8 - correct_options.length
        const other_options = quiz_function == guess_value ? random_digits(num_random_options) :
            number_system == 'Native Korean' ?
                random_native_syllables(num_random_options) :
                random_sino_korean_syllables(num_random_options)
        let options = shuffle(correct_options.concat(other_options))


        return {
            type: 'fill-blanks',
            question,
            answer,
            system: number_system,
            tokens: tokens,
            options: options
        }
    } else {
        throw new Error("Invalid quiz type")
    }


}