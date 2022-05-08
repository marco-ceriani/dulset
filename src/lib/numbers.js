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
    9: '구',    // gu
    10: '십'    // sip
}

const sino_positional = {
    10: '십',
    100: '백',
    1000: '천',
    10000: '만'
}

function get_random_number(type) {
    const number = Math.floor(Math.random() * 10) + 1
    let name = null
    if (type === 'native') {
        name = native_numbers_units[number]
    } else if (type === 'sino') {
        name = sino_numbers[number]
    } else {
        throw Error('invalid number type ' + type)
    }
    return [number, name]
}

export function get_question(type, length=4) {
    const choices = Array(length).fill().map(() => get_random_number(type))
    const correct_one = Math.floor(Math.random() * length)
    return {
        'options': choices.map(x => x[1]),
        'text': choices[correct_one][0],
        'answer': choices[correct_one][1]
    }
}
