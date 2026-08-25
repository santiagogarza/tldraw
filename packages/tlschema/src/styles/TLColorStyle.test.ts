import { describe, expect, it } from 'vitest'
import { DefaultColorStyle, DefaultLabelColorStyle, isHexColor } from './TLColorStyle'

describe('isHexColor', () => {
	it('accepts 3, 6, and 8 digit hex codes', () => {
		expect(isHexColor('#fff')).toBe(true)
		expect(isHexColor('#ff6600')).toBe(true)
		expect(isHexColor('#FF6600')).toBe(true)
		expect(isHexColor('#ff660080')).toBe(true)
	})

	it('rejects non-hex values', () => {
		expect(isHexColor('red')).toBe(false)
		expect(isHexColor('ff6600')).toBe(false)
		expect(isHexColor('#ff66')).toBe(false)
		expect(isHexColor('#gggggg')).toBe(false)
		expect(isHexColor('#ff66001')).toBe(false)
		expect(isHexColor('')).toBe(false)
	})
})

describe('DefaultColorStyle', () => {
	it('validates named colors', () => {
		expect(DefaultColorStyle.validate('black')).toBe('black')
		expect(DefaultColorStyle.validate('light-blue')).toBe('light-blue')
	})

	it('validates custom hex colors', () => {
		expect(DefaultColorStyle.validate('#ff6600')).toBe('#ff6600')
		expect(DefaultColorStyle.validate('#0f0')).toBe('#0f0')
		expect(DefaultColorStyle.validate('#00ff0080')).toBe('#00ff0080')
	})

	it('rejects unknown values', () => {
		expect(() => DefaultColorStyle.validate('hotpink')).toThrow()
		expect(() => DefaultColorStyle.validate('#nothex')).toThrow()
		expect(() => DefaultColorStyle.validate(42)).toThrow()
		expect(() => DefaultColorStyle.validate(null)).toThrow()
	})

	it('validates hex colors against a known good version', () => {
		expect(DefaultColorStyle.validateUsingKnownGoodVersion('black', '#ff6600')).toBe('#ff6600')
		expect(() => DefaultColorStyle.validateUsingKnownGoodVersion('black', 'hotpink')).toThrow()
	})

	it('does not add hex colors to the registered named values', () => {
		DefaultColorStyle.validate('#ff6600')
		expect(DefaultColorStyle.values).not.toContain('#ff6600')
	})
})

describe('DefaultLabelColorStyle', () => {
	it('validates custom hex colors', () => {
		expect(DefaultLabelColorStyle.validate('#ff6600')).toBe('#ff6600')
	})
})
