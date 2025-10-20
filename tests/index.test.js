import { describe, it, expect } from 'vitest'
import {
    splitChange
} from '../soundchanger.js'

describe('splitChange', () => {
    it('Split all four parameters', () => {
        expect(splitChange("a>b/c_d")).toEqual(["a", "b", "c", "d"])
    })
    it('Split simple change', () => {
        expect(splitChange("a>b")).toEqual(["a", "b", "", ""])
    })
    it('Split change with left environment', () => {
        expect(splitChange("a>b/c_")).toEqual(["a", "b", "c", ""])
    })
    it('Split change with right environment', () => {
        expect(splitChange("a>b/_d")).toEqual(["a", "b", "", "d"])
    })
})
