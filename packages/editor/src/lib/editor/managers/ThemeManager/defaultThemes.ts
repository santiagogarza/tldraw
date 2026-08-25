import {
	DefaultFontFamilies,
	isHexColor,
	TLDefaultColor,
	TLDefaultColorStyle,
	TLTheme,
	TLThemeColors,
} from '@tldraw/tlschema'

/**
 * The default theme definition containing color palettes for both light and dark modes.
 *
 * @public
 */
export const DEFAULT_THEME: TLTheme = {
	id: 'default',
	fontSize: 16,
	lineHeight: 1.35,
	strokeWidth: 2,
	fonts: {
		draw: {
			fontFamily: DefaultFontFamilies.draw,
			faces: [
				{ family: 'tldraw_draw', src: { url: 'tldraw_draw', format: 'woff2' }, weight: 'normal' },
				{
					family: 'tldraw_draw',
					src: { url: 'tldraw_draw_bold', format: 'woff2' },
					weight: 'bold',
				},
				{
					family: 'tldraw_draw',
					src: { url: 'tldraw_draw_italic', format: 'woff2' },
					weight: 'normal',
					style: 'italic',
				},
				{
					family: 'tldraw_draw',
					src: { url: 'tldraw_draw_italic_bold', format: 'woff2' },
					weight: 'bold',
					style: 'italic',
				},
			],
		},
		sans: {
			fontFamily: DefaultFontFamilies.sans,
			faces: [
				{
					family: 'tldraw_sans',
					src: { url: 'tldraw_sans', format: 'woff2' },
					weight: 'normal',
					style: 'normal',
				},
				{
					family: 'tldraw_sans',
					src: { url: 'tldraw_sans_bold', format: 'woff2' },
					weight: 'bold',
					style: 'normal',
				},
				{
					family: 'tldraw_sans',
					src: { url: 'tldraw_sans_italic', format: 'woff2' },
					weight: 'normal',
					style: 'italic',
				},
				{
					family: 'tldraw_sans',
					src: { url: 'tldraw_sans_italic_bold', format: 'woff2' },
					weight: 'bold',
					style: 'italic',
				},
			],
		},
		serif: {
			fontFamily: DefaultFontFamilies.serif,
			faces: [
				{
					family: 'tldraw_serif',
					src: { url: 'tldraw_serif', format: 'woff2' },
					weight: 'normal',
					style: 'normal',
				},
				{
					family: 'tldraw_serif',
					src: { url: 'tldraw_serif_bold', format: 'woff2' },
					weight: 'bold',
					style: 'normal',
				},
				{
					family: 'tldraw_serif',
					src: { url: 'tldraw_serif_italic', format: 'woff2' },
					weight: 'normal',
					style: 'italic',
				},
				{
					family: 'tldraw_serif',
					src: { url: 'tldraw_serif_italic_bold', format: 'woff2' },
					weight: 'bold',
					style: 'italic',
				},
			],
		},
		mono: {
			fontFamily: DefaultFontFamilies.mono,
			faces: [
				{
					family: 'tldraw_mono',
					src: { url: 'tldraw_mono', format: 'woff2' },
					weight: 'normal',
					style: 'normal',
				},
				{
					family: 'tldraw_mono',
					src: { url: 'tldraw_mono_bold', format: 'woff2' },
					weight: 'bold',
					style: 'normal',
				},
				{
					family: 'tldraw_mono',
					src: { url: 'tldraw_mono_italic', format: 'woff2' },
					weight: 'normal',
					style: 'italic',
				},
				{
					family: 'tldraw_mono',
					src: { url: 'tldraw_mono_italic_bold', format: 'woff2' },
					weight: 'bold',
					style: 'italic',
				},
			],
		},
	},
	colors: {
		light: {
			text: '#000000',
			background: '#f9fafb',
			negativeSpace: '#f9fafb',
			solid: '#fcfffe',
			cursor: 'black',
			noteBorder: 'rgb(144, 144, 144)',
			snap: 'hsl(0, 76%, 60%)',
			selectionStroke: 'hsl(214, 84%, 56%)',
			selectionFill: 'hsl(210, 100%, 56%, 24%)',
			brushFill: 'hsl(0, 0%, 56%, 10.2%)',
			brushStroke: 'hsl(0, 0%, 56%, 25.1%)',
			selectedContrast: '#ffffff',
			laser: 'hsl(0, 100%, 50%)',
			black: {
				solid: '#1d1d1d',
				fill: '#1d1d1d',
				linedFill: '#363636',
				frameHeadingStroke: '#717171',
				frameHeadingFill: '#ffffff',
				frameStroke: '#717171',
				frameFill: '#ffffff',
				frameText: '#000000',
				noteFill: '#FCE19C',
				noteText: '#000000',
				semi: '#e8e8e8',
				pattern: '#494949',
				highlightSrgb: '#fddd00',
				highlightP3: 'color(display-p3 0.972 0.8205 0.05)',
			},
			blue: {
				solid: '#4465e9',
				fill: '#4465e9',
				linedFill: '#6580ec',
				frameHeadingStroke: '#6681ec',
				frameHeadingFill: '#f9fafe',
				frameStroke: '#6681ec',
				frameFill: '#f9fafe',
				frameText: '#000000',
				noteFill: '#8AA3FF',
				noteText: '#000000',
				semi: '#dce1f8',
				pattern: '#6681ee',
				highlightSrgb: '#10acff',
				highlightP3: 'color(display-p3 0.308 0.6632 0.9996)',
			},
			green: {
				solid: '#099268',
				fill: '#099268',
				linedFill: '#0bad7c',
				frameHeadingStroke: '#37a684',
				frameHeadingFill: '#f8fcfa',
				frameStroke: '#37a684',
				frameFill: '#f8fcfa',
				frameText: '#000000',
				noteFill: '#6FC896',
				noteText: '#000000',
				semi: '#d3e9e3',
				pattern: '#39a785',
				highlightSrgb: '#00ffc8',
				highlightP3: 'color(display-p3 0.2536 0.984 0.7981)',
			},
			grey: {
				solid: '#9fa8b2',
				fill: '#9fa8b2',
				linedFill: '#bbc1c9',
				frameHeadingStroke: '#aaaaab',
				frameHeadingFill: '#fbfcfc',
				frameStroke: '#aaaaab',
				frameFill: '#fcfcfd',
				frameText: '#000000',
				noteFill: '#C0CAD3',
				noteText: '#000000',
				semi: '#eceef0',
				pattern: '#bcc3c9',
				highlightSrgb: '#cbe7f1',
				highlightP3: 'color(display-p3 0.8163 0.9023 0.9416)',
			},
			'light-blue': {
				solid: '#4ba1f1',
				fill: '#4ba1f1',
				linedFill: '#7abaf5',
				frameHeadingStroke: '#6cb2f3',
				frameHeadingFill: '#f8fbfe',
				frameStroke: '#6cb2f3',
				frameFill: '#fafcff',
				frameText: '#000000',
				noteFill: '#9BC4FD',
				noteText: '#000000',
				semi: '#ddedfa',
				pattern: '#6fbbf8',
				highlightSrgb: '#00f4ff',
				highlightP3: 'color(display-p3 0.1512 0.9414 0.9996)',
			},
			'light-green': {
				solid: '#4cb05e',
				fill: '#4cb05e',
				linedFill: '#7ec88c',
				frameHeadingStroke: '#6dbe7c',
				frameHeadingFill: '#f8fcf9',
				frameStroke: '#6dbe7c',
				frameFill: '#fafdfa',
				frameText: '#000000',
				noteFill: '#98D08A',
				noteText: '#000000',
				semi: '#dbf0e0',
				pattern: '#65cb78',
				highlightSrgb: '#65f641',
				highlightP3: 'color(display-p3 0.563 0.9495 0.3857)',
			},
			'light-red': {
				solid: '#f87777',
				fill: '#f87777',
				linedFill: '#f99a9a',
				frameHeadingStroke: '#f89090',
				frameHeadingFill: '#fffafa',
				frameStroke: '#f89090',
				frameFill: '#fffbfb',
				frameText: '#000000',
				noteFill: '#F7A5A1',
				noteText: '#000000',
				semi: '#f4dadb',
				pattern: '#fe9e9e',
				highlightSrgb: '#ff7fa3',
				highlightP3: 'color(display-p3 0.9988 0.5301 0.6397)',
			},
			'light-violet': {
				solid: '#e085f4',
				fill: '#e085f4',
				linedFill: '#e9abf7',
				frameHeadingStroke: '#e59bf5',
				frameHeadingFill: '#fefaff',
				frameStroke: '#e59bf5',
				frameFill: '#fefbff',
				frameText: '#000000',
				noteFill: '#DFB0F9',
				noteText: '#000000',
				semi: '#f5eafa',
				pattern: '#e9acf8',
				highlightSrgb: '#ff88ff',
				highlightP3: 'color(display-p3 0.9676 0.5652 0.9999)',
			},
			orange: {
				solid: '#e16919',
				fill: '#e16919',
				linedFill: '#ea8643',
				frameHeadingStroke: '#e68544',
				frameHeadingFill: '#fef9f6',
				frameStroke: '#e68544',
				frameFill: '#fef9f6',
				frameText: '#000000',
				noteFill: '#FAA475',
				noteText: '#000000',
				semi: '#f8e2d4',
				pattern: '#f78438',
				highlightSrgb: '#ffa500',
				highlightP3: 'color(display-p3 0.9988 0.6905 0.266)',
			},
			red: {
				solid: '#e03131',
				fill: '#e03131',
				linedFill: '#e75f5f',
				frameHeadingStroke: '#e55757',
				frameHeadingFill: '#fef7f7',
				frameStroke: '#e55757',
				frameFill: '#fef9f9',
				frameText: '#000000',
				noteFill: '#FC8282',
				noteText: '#000000',
				semi: '#f4dadb',
				pattern: '#e55959',
				highlightSrgb: '#ff636e',
				highlightP3: 'color(display-p3 0.9992 0.4376 0.45)',
			},
			violet: {
				solid: '#ae3ec9',
				fill: '#ae3ec9',
				linedFill: '#be68d4',
				frameHeadingStroke: '#bc62d3',
				frameHeadingFill: '#fcf7fd',
				frameStroke: '#bc62d3',
				frameFill: '#fdf9fd',
				frameText: '#000000',
				noteFill: '#DB91FD',
				noteText: '#000000',
				semi: '#ecdcf2',
				pattern: '#bd63d3',
				highlightSrgb: '#c77cff',
				highlightP3: 'color(display-p3 0.7469 0.5089 0.9995)',
			},
			yellow: {
				solid: '#f1ac4b',
				fill: '#f1ac4b',
				linedFill: '#f5c27a',
				frameHeadingStroke: '#f3bb6c',
				frameHeadingFill: '#fefcf8',
				frameStroke: '#f3bb6c',
				frameFill: '#fffdfa',
				frameText: '#000000',
				noteFill: '#FED49A',
				noteText: '#000000',
				semi: '#f9f0e6',
				pattern: '#fecb92',
				highlightSrgb: '#fddd00',
				highlightP3: 'color(display-p3 0.972 0.8705 0.05)',
			},
			white: {
				solid: '#FFFFFF',
				fill: '#FFFFFF',
				linedFill: '#ffffff',
				semi: '#f5f5f5',
				pattern: '#f9f9f9',
				frameHeadingStroke: '#7d7d7d',
				frameHeadingFill: '#ffffff',
				frameStroke: '#7d7d7d',
				frameFill: '#ffffff',
				frameText: '#000000',
				noteFill: '#FFFFFF',
				noteText: '#000000',
				highlightSrgb: '#ffffff',
				highlightP3: 'color(display-p3 1 1 1)',
			},
		},
		dark: {
			text: 'hsl(210, 17%, 98%)',
			background: 'hsl(240, 5%, 6.5%)',
			negativeSpace: 'hsl(240, 5%, 6.5%)',
			solid: '#010403',
			cursor: 'white',
			snap: 'hsl(0, 76%, 60%)',
			selectionStroke: 'hsl(214, 84%, 56%)',
			selectionFill: 'hsl(209, 100%, 57%, 20%)',
			brushFill: 'hsl(0, 0%, 56%, 10.2%)',
			brushStroke: 'hsl(0, 0%, 56%, 25.1%)',
			selectedContrast: '#ffffff',
			laser: 'hsl(0, 100%, 50%)',
			noteBorder: 'rgb(20, 20, 20)',

			black: {
				solid: '#f2f2f2',
				fill: '#f2f2f2',
				linedFill: '#ffffff',
				frameHeadingStroke: '#5c5c5c',
				frameHeadingFill: '#252525',
				frameStroke: '#5c5c5c',
				frameFill: '#0c0c0c',
				frameText: '#f2f2f2',
				noteFill: '#2c2c2c',
				noteText: '#f2f2f2',
				semi: '#2c3036',
				pattern: '#989898',
				highlightSrgb: '#d2b700',
				highlightP3: 'color(display-p3 0.8078 0.6225 0.0312)',
			},
			blue: {
				solid: '#4f72fc', // 3c60f0
				fill: '#4f72fc',
				linedFill: '#3c5cdd',
				frameHeadingStroke: '#384994',
				frameHeadingFill: '#1C2036',
				frameStroke: '#384994',
				frameFill: '#11141f',
				frameText: '#f2f2f2',
				noteFill: '#2A3F98',
				noteText: '#f2f2f2',
				semi: '#262d40',
				pattern: '#3a4b9e',
				highlightSrgb: '#0079d2',
				highlightP3: 'color(display-p3 0.0032 0.4655 0.7991)',
			},
			green: {
				solid: '#099268',
				fill: '#099268',
				linedFill: '#087856',
				frameHeadingStroke: '#10513C',
				frameHeadingFill: '#14241f',
				frameStroke: '#10513C',
				frameFill: '#0E1614',
				frameText: '#f2f2f2',
				noteFill: '#014429',
				noteText: '#f2f2f2',
				semi: '#253231',
				pattern: '#366a53',
				highlightSrgb: '#009774',
				highlightP3: 'color(display-p3 0.0085 0.582 0.4604)',
			},
			grey: {
				solid: '#9398b0',
				fill: '#9398b0',
				linedFill: '#8388a5',
				frameHeadingStroke: '#42474D',
				frameHeadingFill: '#23262A',
				frameStroke: '#42474D',
				frameFill: '#151719',
				frameText: '#f2f2f2',
				noteFill: '#56595F',
				noteText: '#f2f2f2',
				semi: '#33373c',
				pattern: '#7c8187',
				highlightSrgb: '#9cb4cb',
				highlightP3: 'color(display-p3 0.6299 0.7012 0.7856)',
			},
			'light-blue': {
				solid: '#4dabf7',
				fill: '#4dabf7',
				linedFill: '#2793ec',
				frameHeadingStroke: '#075797',
				frameHeadingFill: '#142839',
				frameStroke: '#075797',
				frameFill: '#0B1823',
				frameText: '#f2f2f2',
				noteFill: '#1F5495',
				noteText: '#f2f2f2',
				semi: '#2a3642',
				pattern: '#4d7aa9',
				highlightSrgb: '#00bdc8',
				highlightP3: 'color(display-p3 0.0023 0.7259 0.7735)',
			},
			'light-green': {
				solid: '#40c057',
				fill: '#40c057',
				linedFill: '#37a44b',
				frameHeadingStroke: '#1C5427',
				frameHeadingFill: '#18251A',
				frameStroke: '#1C5427',
				frameFill: '#0F1911',
				frameText: '#f2f2f2',
				noteFill: '#21581D',
				noteText: '#f2f2f2',
				semi: '#2a3830',
				pattern: '#4e874e',
				highlightSrgb: '#00a000',
				highlightP3: 'color(display-p3 0.2711 0.6172 0.0195)',
			},
			'light-red': {
				solid: '#ff8787',
				fill: '#ff8787',
				linedFill: '#ff6666',
				frameHeadingStroke: '#6f3232',
				frameHeadingFill: '#341818',
				frameStroke: '#6f3232',
				frameFill: '#181212',
				frameText: '#f2f2f2',
				noteFill: '#7a3333',
				noteText: '#f2f2f2',
				semi: '#3c2b2b',
				pattern: '#a56767',
				highlightSrgb: '#db005b',
				highlightP3: 'color(display-p3 0.7849 0.0585 0.3589)',
			},
			'light-violet': {
				solid: '#e599f7',
				fill: '#e599f7',
				linedFill: '#dc71f4',
				frameHeadingStroke: '#6c367a',
				frameHeadingFill: '#2D2230',
				frameStroke: '#6c367a',
				frameFill: '#1C151E',
				frameText: '#f2f2f2',
				noteFill: '#762F8E',
				noteText: '#f2f2f2',
				semi: '#383442',
				pattern: '#9770a9',
				highlightSrgb: '#c400c7',
				highlightP3: 'color(display-p3 0.7024 0.0403 0.753)',
			},
			orange: {
				solid: '#f76707',
				fill: '#f76707',
				linedFill: '#f54900',
				frameHeadingStroke: '#773a0e',
				frameHeadingFill: '#2f1d13',
				frameStroke: '#773a0e',
				frameFill: '#1c1512',
				frameText: '#f2f2f2',
				noteFill: '#7c3905',
				noteText: '#f2f2f2',
				semi: '#3b2e27',
				pattern: '#9f552d',
				highlightSrgb: '#d07a00',
				highlightP3: 'color(display-p3 0.7699 0.4937 0.0085)',
			},
			red: {
				solid: '#e03131',
				fill: '#e03131',
				linedFill: '#c31d1d',
				frameHeadingStroke: '#701e1e',
				frameHeadingFill: '#301616',
				frameStroke: '#701e1e',
				frameFill: '#1b1313',
				frameText: '#f2f2f2',
				noteFill: '#7e201f',
				noteText: '#f2f2f2',
				semi: '#382726',
				pattern: '#8f3734',
				highlightSrgb: '#de002c',
				highlightP3: 'color(display-p3 0.7978 0.0509 0.2035)',
			},
			violet: {
				solid: '#ae3ec9',
				fill: '#ae3ec9',
				linedFill: '#8f2fa7',
				frameHeadingStroke: '#6d1583',
				frameHeadingFill: '#27152e',
				frameStroke: '#6d1583',
				frameFill: '#1b0f21',
				frameText: '#f2f2f2',
				noteFill: '#5f1c70',
				noteText: '#f2f2f2',
				semi: '#342938',
				pattern: '#763a8b',
				highlightSrgb: '#9e00ee',
				highlightP3: 'color(display-p3 0.5651 0.0079 0.8986)',
			},
			yellow: {
				solid: '#ffc034',
				fill: '#ffc034',
				linedFill: '#ffae00',
				frameHeadingStroke: '#684e12',
				frameHeadingFill: '#2a2113',
				frameStroke: '#684e12',
				frameFill: '#1e1911',
				frameText: '#f2f2f2',
				noteFill: '#8a5e1c',
				noteText: '#f2f2f2',
				semi: '#3b352b',
				pattern: '#fecb92',
				highlightSrgb: '#d2b700',
				highlightP3: 'color(display-p3 0.8078 0.7225 0.0312)',
			},
			white: {
				solid: '#f3f3f3',
				fill: '#f3f3f3',
				linedFill: '#f3f3f3',
				semi: '#f5f5f5',
				pattern: '#f9f9f9',
				frameHeadingStroke: '#ffffff',
				frameHeadingFill: '#ffffff',
				frameStroke: '#ffffff',
				frameFill: '#ffffff',
				frameText: '#000000',
				noteFill: '#eaeaea',
				noteText: '#1d1d1d',
				highlightSrgb: '#ffffff',
				highlightP3: 'color(display-p3 1 1 1)',
			},
		},
	},
}

/**
 * Resolves a color style value to its actual CSS color string for a given theme and variant.
 * If the color is not a default theme color, returns the color value as-is.
 *
 * @param colors - The color palette for the current color mode (e.g. `theme.colors[colorMode]`)
 * @param color - The color style value to resolve
 * @param variant - Which variant of the color to return (solid, fill, pattern, etc.)
 * @returns The CSS color string for the specified color and variant
 *
 * @example
 * ```ts
 * import { getColorValue } from 'tldraw'
 *
 * const colors = editor.getCurrentTheme().colors[editor.getColorMode()]
 *
 * // Get the solid variant of red
 * const redSolid = getColorValue(colors, 'red', 'solid') // '#e03131'
 *
 * // Get the fill variant of blue
 * const blueFill = getColorValue(colors, 'blue', 'fill') // '#4465e9'
 *
 * // Custom color passes through unchanged
 * const customColor = getColorValue(colors, '#ff0000', 'solid') // '#ff0000'
 * ```
 *
 * @public
 */
export function getColorValue(
	colors: TLThemeColors,
	color: TLDefaultColorStyle | string,
	variant: keyof TLDefaultColor
): string {
	const colorEntry = colors[color as TLDefaultColorStyle]
	if (!colorEntry || typeof colorEntry === 'string') {
		if (typeof color === 'string' && isHexColor(color)) {
			return getCustomColorVariants(colors, color)[variant]
		}
		return color
	}
	return colorEntry[variant]
}

type RGB = [number, number, number]

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, and `hsl()` color strings. */
function parseColor(color: string): RGB | null {
	if (color.startsWith('#')) {
		let hex = color.slice(1)
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('')
		}
		if (hex.length < 6) return null
		const n = parseInt(hex.slice(0, 6), 16)
		if (Number.isNaN(n)) return null
		return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
	}
	const numbers = color.match(/-?[\d.]+/g)?.map(Number)
	if (!numbers || numbers.length < 3) return null
	if (color.startsWith('hsl')) {
		return hslToRgb(numbers[0], numbers[1] / 100, numbers[2] / 100)
	}
	if (color.startsWith('rgb')) {
		return [numbers[0], numbers[1], numbers[2]]
	}
	return null
}

function hslToRgb(h: number, s: number, l: number): RGB {
	const c = (1 - Math.abs(2 * l - 1)) * s
	const hp = (((h % 360) + 360) % 360) / 60
	const x = c * (1 - Math.abs((hp % 2) - 1))
	const m = l - c / 2
	let rgb: RGB
	if (hp < 1) rgb = [c, x, 0]
	else if (hp < 2) rgb = [x, c, 0]
	else if (hp < 3) rgb = [0, c, x]
	else if (hp < 4) rgb = [0, x, c]
	else if (hp < 5) rgb = [x, 0, c]
	else rgb = [c, 0, x]
	return rgb.map((v) => Math.round((v + m) * 255)) as RGB
}

function toHex([r, g, b]: RGB): string {
	return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

/** Mix `amount` of `toward` into `base` (0 = base, 1 = toward). */
function mix(base: RGB, toward: RGB, amount: number): string {
	return toHex([
		base[0] + (toward[0] - base[0]) * amount,
		base[1] + (toward[1] - base[1]) * amount,
		base[2] + (toward[2] - base[2]) * amount,
	])
}

function relativeLuminance([r, g, b]: RGB): number {
	return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

const customColorVariantsCache = new Map<string, TLDefaultColor>()

/**
 * Derive a full set of color variants for a custom hex color, mixing it toward
 * the theme's background color by roughly the same ratios the built-in palette
 * uses. Cached per hex + background pair.
 */
function getCustomColorVariants(colors: TLThemeColors, hexColor: string): TLDefaultColor {
	const cacheKey = `${hexColor}|${colors.background}`
	const cached = customColorVariantsCache.get(cacheKey)
	if (cached) return cached

	const base = parseColor(hexColor) ?? [0, 0, 0]
	const background = parseColor(colors.background) ?? [255, 255, 255]
	const isDark = relativeLuminance(background) < 0.5

	const noteFill = mix(base, background, isDark ? 0.5 : 0.35)
	const noteFillRgb = parseColor(noteFill) ?? base

	const variants: TLDefaultColor = {
		solid: hexColor,
		fill: hexColor,
		linedFill: mix(base, background, 0.15),
		semi: mix(base, background, isDark ? 0.65 : 0.78),
		pattern: mix(base, background, isDark ? 0.35 : 0.15),
		frameHeadingStroke: mix(base, background, isDark ? 0.5 : 0.2),
		frameHeadingFill: mix(base, background, isDark ? 0.88 : 0.93),
		frameStroke: mix(base, background, isDark ? 0.5 : 0.2),
		frameFill: mix(base, background, isDark ? 0.92 : 0.95),
		frameText: isDark ? '#f2f2f2' : '#000000',
		noteFill,
		noteText: relativeLuminance(noteFillRgb) > 0.45 ? '#000000' : '#f2f2f2',
		highlightSrgb: hexColor,
		highlightP3: hexColor,
	}

	customColorVariantsCache.set(cacheKey, variants)
	return variants
}
