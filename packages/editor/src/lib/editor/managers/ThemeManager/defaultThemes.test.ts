import { TLDefaultColor } from '@tldraw/tlschema'
import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME, getColorValue } from './defaultThemes'

const lightColors = DEFAULT_THEME.colors.light
const darkColors = DEFAULT_THEME.colors.dark

function luminance(hex: string) {
	const n = parseInt(hex.slice(1), 16)
	return (0.2126 * ((n >> 16) & 0xff) + 0.7152 * ((n >> 8) & 0xff) + 0.0722 * (n & 0xff)) / 255
}

describe('getColorValue', () => {
	it('resolves named palette colors', () => {
		expect(getColorValue(lightColors, 'red', 'solid')).toBe('#e03131')
		expect(getColorValue(lightColors, 'blue', 'semi')).toBe('#dce1f8')
		expect(getColorValue(darkColors, 'blue', 'solid')).toBe('#4f72fc')
	})

	it('returns unknown non-hex values unchanged', () => {
		expect(getColorValue(lightColors, 'tomato', 'solid')).toBe('tomato')
	})

	describe('custom hex colors', () => {
		it('uses the hex itself for solid variants', () => {
			expect(getColorValue(lightColors, '#ff6600', 'solid')).toBe('#ff6600')
			expect(getColorValue(lightColors, '#ff6600', 'fill')).toBe('#ff6600')
			expect(getColorValue(lightColors, '#ff6600', 'highlightSrgb')).toBe('#ff6600')
			expect(getColorValue(darkColors, '#ff6600', 'solid')).toBe('#ff6600')
		})

		it('derives every variant as a usable color value', () => {
			const variants: (keyof TLDefaultColor)[] = [
				'solid',
				'semi',
				'pattern',
				'fill',
				'linedFill',
				'frameHeadingStroke',
				'frameHeadingFill',
				'frameStroke',
				'frameFill',
				'frameText',
				'noteFill',
				'noteText',
				'highlightSrgb',
				'highlightP3',
			]
			for (const colors of [lightColors, darkColors]) {
				for (const variant of variants) {
					expect(getColorValue(colors, '#ff6600', variant)).toMatch(/^#[0-9a-f]{6}$/)
				}
			}
		})

		it('derives lighter fill variants in light mode', () => {
			const base = luminance('#ff6600')
			expect(luminance(getColorValue(lightColors, '#ff6600', 'semi'))).toBeGreaterThan(base)
			expect(luminance(getColorValue(lightColors, '#ff6600', 'noteFill'))).toBeGreaterThan(base)
			expect(luminance(getColorValue(lightColors, '#ff6600', 'frameFill'))).toBeGreaterThan(base)
		})

		it('derives darker fill variants in dark mode', () => {
			const base = luminance('#ff6600')
			expect(luminance(getColorValue(darkColors, '#ff6600', 'semi'))).toBeLessThan(base)
			expect(luminance(getColorValue(darkColors, '#ff6600', 'noteFill'))).toBeLessThan(base)
			expect(luminance(getColorValue(darkColors, '#ff6600', 'frameFill'))).toBeLessThan(base)
		})

		it('picks readable note text for light and dark custom colors', () => {
			// a dark custom color keeps a dark note fill in light mode, so text is light
			expect(getColorValue(lightColors, '#111111', 'noteText')).toBe('#f2f2f2')
			// a bright custom color gets an even lighter note fill, so text is dark
			expect(getColorValue(lightColors, '#ffee00', 'noteText')).toBe('#000000')
		})

		it('supports shorthand hex codes', () => {
			expect(getColorValue(lightColors, '#f60', 'solid')).toBe('#f60')
			expect(luminance(getColorValue(lightColors, '#f60', 'semi'))).toBeGreaterThan(
				luminance('#ff6600')
			)
		})
	})
})
