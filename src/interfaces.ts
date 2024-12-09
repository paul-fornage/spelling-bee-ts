


export interface Language {
    name: string;
    code: string;
    letter_set: string;
    flag_emoji: string;
}
export interface CombData {
    center_char: string;
    outer_chars: string[];
}
export interface ValidWord {
    point_value: number,
    word: string,
    is_found: boolean,
    is_panagram: boolean,
}

export interface WordCountData {
    points_found: number,
    words_found: number,
    max_points: number,
    max_words: number,
}