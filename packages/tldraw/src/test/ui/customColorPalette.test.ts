import { describe, expect, it } from 'vitest'
import {
	customColorPaletteAtom,
	getVisibleCustomColors,
	hideCustomColor,
	MAX_VISIBLE_CUSTOM_COLORS,
} from '../../lib/ui/components/StylePanel/customColorPalette'

describe('customColorPalette', () => {
	it('tracks visible custom colors separately from hidden ones', () => {
		customColorPaletteAtom.set({
			nextId: 3,
			colors: [
				{ id: 'custom-1', hex: '#ff0000' },
				{ id: 'custom-2', hex: '#00ff00' },
			],
			hidden: ['custom-1'],
		})

		expect(getVisibleCustomColors(customColorPaletteAtom.get())).toEqual([
			{ id: 'custom-2', hex: '#00ff00' },
		])
	})

	it('hides a custom color without removing it from the palette state', () => {
		customColorPaletteAtom.set({
			nextId: 2,
			colors: [{ id: 'custom-1', hex: '#ff0000' }],
			hidden: [],
		})

		hideCustomColor('custom-1')

		const state = customColorPaletteAtom.get()
		expect(state.colors).toEqual([{ id: 'custom-1', hex: '#ff0000' }])
		expect(state.hidden).toEqual(['custom-1'])
		expect(getVisibleCustomColors(state)).toEqual([])
	})

	it('exposes a max visible custom color cap of 12', () => {
		expect(MAX_VISIBLE_CUSTOM_COLORS).toBe(12)
	})
})
