import { Editor, TLDefaultColor, TLTheme, TLThemes, registerColorsFromThemes } from '@tldraw/editor'
import { atom } from '@tldraw/state'

/** @internal */
export const MAX_VISIBLE_CUSTOM_COLORS = 12

/** @internal */
export interface CustomColorEntry {
	id: string
	hex: string
}

/** @internal */
export interface CustomColorPaletteState {
	nextId: number
	colors: CustomColorEntry[]
	hidden: string[]
}

const defaultState: CustomColorPaletteState = {
	nextId: 1,
	colors: [],
	hidden: [],
}

/** @internal */
export const customColorPaletteAtom = atom<CustomColorPaletteState>(
	'customColorPalette',
	defaultState
)

/** @internal */
export function isCustomColorId(id: string): boolean {
	return id.startsWith('custom-')
}

/** @internal */
export function makeCustomColorEntry(solid: string): TLDefaultColor {
	const translucent = solid + '33'
	return {
		solid,
		semi: translucent,
		pattern: solid,
		fill: solid,
		linedFill: translucent,
		frameHeadingStroke: solid,
		frameHeadingFill: translucent,
		frameStroke: solid,
		frameFill: translucent,
		frameText: solid,
		noteFill: translucent,
		noteText: solid,
		highlightSrgb: solid,
		highlightP3: solid,
	}
}

/** @internal */
export function getVisibleCustomColors(state: CustomColorPaletteState): CustomColorEntry[] {
	const hidden = new Set(state.hidden)
	return state.colors.filter((c) => !hidden.has(c.id))
}

/** @internal */
export function buildThemeWithCustomColors(
	baseTheme: TLTheme,
	colors: CustomColorEntry[]
): TLTheme {
	const lightColors = { ...baseTheme.colors.light } as TLTheme['colors']['light']
	const darkColors = { ...baseTheme.colors.dark } as TLTheme['colors']['dark']

	for (const { id, hex } of colors) {
		const entry = makeCustomColorEntry(hex)
		;(lightColors as unknown as Record<string, TLDefaultColor>)[id] = entry
		;(darkColors as unknown as Record<string, TLDefaultColor>)[id] = entry
	}

	return {
		...baseTheme,
		colors: { light: lightColors, dark: darkColors },
	}
}

/** @internal */
export function registerCustomColorsOnEditor(editor: Editor, colors: CustomColorEntry[]): void {
	const theme = buildThemeWithCustomColors(editor.getCurrentTheme(), colors)
	const themes = { [theme.id]: theme } as TLThemes
	registerColorsFromThemes(themes)
	editor.updateTheme(theme)
}

/** @internal */
export function addCustomColor(editor: Editor, hex: string): string | null {
	const state = customColorPaletteAtom.get()
	const visible = getVisibleCustomColors(state)
	if (visible.length >= MAX_VISIBLE_CUSTOM_COLORS) return null

	const id = `custom-${state.nextId}`
	const nextColors = [...state.colors, { id, hex }]
	customColorPaletteAtom.set({
		nextId: state.nextId + 1,
		colors: nextColors,
		hidden: state.hidden,
	})

	registerCustomColorsOnEditor(editor, nextColors)
	return id
}

/** @internal */
export function hideCustomColor(id: string): void {
	const state = customColorPaletteAtom.get()
	if (!state.colors.some((c) => c.id === id)) return
	if (state.hidden.includes(id)) return

	customColorPaletteAtom.set({
		...state,
		hidden: [...state.hidden, id],
	})
}
