import { parse } from 'node-html-parser'

export class Parser {
    constructor(private parser = parse){}
}