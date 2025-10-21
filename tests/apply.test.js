import { describe, it, expect } from 'vitest'
import { apply } from '../soundchanger.js'

describe('apply', () => {
    it('Simple change', () => {
        expect(apply(
            ["a>b"],
            ["a", "ba", "aba"],
        )).toEqual(["b", "bb", "bbb"])
    })
    it('Simple change word-initial', () => {
        expect(apply(
            ["a>b/#_"],
            ["a", "ba", "aba"],
        )).toEqual(["b", "ba", "bba"])
    })
    it('Simple change word-final', () => {
        expect(apply(
            ["a>b/_#"],
            ["a", "ba", "aba"],
        )).toEqual(["b", "bb", "abb"])
    })
    it('Simple change to zero', () => {
        const strings = ["a", "ba", "aba"]
        const result = ["", "b", "b"]
        const changes = ["a>∅", "a>-", "a>"]

        for (const change of changes) {
            expect(apply(
                [change], strings,
            )).toEqual(result)            
        }
    })
    it('Simple change with category', () => {
        expect(apply(
            ["A>b"],
            ["a", "ab", "abc"],
            {"A": ["a", "b"]},
        )).toEqual(["b", "bb", "bbc"])
    })
})
