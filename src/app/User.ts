export interface User {
    id?: string;
    text: string;
    value: string;
    image: object;
    password: string;
    answers: object;
    questions: Array<string>;
}