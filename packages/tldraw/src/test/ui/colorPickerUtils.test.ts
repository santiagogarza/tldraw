import { describe, expect, it } from 'vitest'
import {
	hexToHsv,
	hsvToHex,
	normalizeHex,
} from '../../lib/ui/components/StylePanel/colorPickerUtils'
import { makeCustomColorEntry } from '../../lib/ui/components/StylePanel/customColorPalette'

describe('colorPickerUtils', () => {
	it('normalizes 3 and 6 digit hex values', () => {
		expect(normalizeHex('#f00')).toBe('#ff0000')
		expect(normalizeHex('ff0000')).toBe('#ff0000')
		expect(normalizeHex('#abc')).toBe('#aabbcc')
	})

	it('rejects invalid hex values', () => {
		expect(normalizeHex('not-a-color')).toBeNull()
		expect(normalizeHex('#gggggg')).toBeNull()
	})

	it('round-trips hex through hsv', () => {
		const hex = '#4465e9'
		expect(hsvToHex(hexToHsv(hex))).toBe(hex)
	})
})

describe('makeCustomColorEntry', () => {
	it('fans a hex across all theme color roles', () => {
		const entry = makeCustomColorEntry('#ff5500')
		expect(entry).toMatchObject({
			solid: '#ff5500',
			fill: '#ff5500',
			semi: '#ff550033',
			noteFill: '#ff550033',
			highlightSrgb: '#ff5500',
		})
	})
})
