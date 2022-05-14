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

class Wheel {
    constructor(table, options={}) {
        this.table = table
        this.wheel = Object.keys(table).map(k => ({
            'key': k,
            'weight': 1
        }))
        this.total = this.wheel.reduce((t, item) => t + item.weight, 0)
        this.options = {
            distinct : false,
            ...options
        }
    }

    getItem() {
        const random = Math.random() * this.total
        const last_index = this.wheel.length - 1
        let i = 0;
        let weight = 0;
        while (i < last_index && weight < random) {
            i += 1;
            weight += this.wheel[i].weight;
        }
        const key = this.wheel[i].key
        if (this.options.distinct) {
            const last = this.wheel.pop()
            if (i < last_index) {
                this.wheel[i] = last
            }
        }
        
        return [key, this.table[key]]
    }
}

const generate_native_number = (length = 1) => {
    let value = 0;
    let text = ''
    if (length > 1) {
        const [digit, name] = new Wheel(native_numbers_tens).getItem();
        value += parseInt(digit, 10);
        text += name;
    }
    const [digit, name] = new Wheel(native_numbers_units).getItem();
    if (digit !== '10' || length === 1) {
        value += parseInt(digit, 10);
        text += name;
    }
    return {
        number: value, 
        text: text
    }
}

const generate_sino_korean_number = (length = 1) => {
    let value = 0;
    let text = ''
    const wheel = new Wheel(sino_numbers);
    console.group('generate sino-korean number')
    for (let i = 0, v = 1; i < length; i++, v *= 10) {
        const [digit, name] = wheel.getItem()
        console.log(`digit ${digit} : ${name}`)
        if (digit === '1') {
            text = sino_positional[v] + text;
            value += parseInt(digit) * v;
        } else if (digit !== '10') {
            text = name + sino_positional[v] + text;
            value += parseInt(digit) * v;
        }
    }
    console.groupEnd()
    return {
        number: value, 
        text: text
    }
}

export function get_question(type, num_options = 4, length = 2) {
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
    const correctChoice = choices[ choices.length * Math.random() << 0 ];

    return {
        'options': choices.map(x => x[1]),
        'text': correctChoice[0],
        'answer': correctChoice[1]
    }
}

export const getQuizTitle = (type) => {
    return type.startsWith('sino-') ? 'Sino-Korean' : 'Native'
}
