/** @internal */
export interface HsvColor {
	h: number
	s: number
	v: number
}

/** @internal */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const normalized = normalizeHex(hex)
	if (!normalized) return null
	const r = parseInt(normalized.slice(1, 3), 16)
	const g = parseInt(normalized.slice(3, 5), 16)
	const b = parseInt(normalized.slice(5, 7), 16)
	return { r, g, b }
}

/** @internal */
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (v: number) =>
		Math.max(0, Math.min(255, Math.round(v)))
			.toString(16)
			.padStart(2, '0')
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/** @internal */
export function normalizeHex(hex: string): string | null {
	const trimmed = hex.trim()
	const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
	if (!match) return null
	let value = match[1]
	if (value.length === 3) {
		value = value
			.split('')
			.map((c) => c + c)
			.join('')
	}
	return `#${value.toLowerCase()}`
}

/** @internal */
export function hexToHsv(hex: string): HsvColor {
	const rgb = hexToRgb(hex)
	if (!rgb) return { h: 0, s: 0, v: 0 }
	return rgbToHsv(rgb.r, rgb.g, rgb.b)
}

/** @internal */
export function hsvToHex({ h, s, v }: HsvColor): string {
	const rgb = hsvToRgb(h, s, v)
	return rgbToHex(rgb.r, rgb.g, rgb.b)
}

/** @internal */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
	const rn = r / 255
	const gn = g / 255
	const bn = b / 255
	const max = Math.max(rn, gn, bn)
	const min = Math.min(rn, gn, bn)
	const delta = max - min

	let h = 0
	if (delta !== 0) {
		if (max === rn) {
			h = ((gn - bn) / delta) % 6
		} else if (max === gn) {
			h = (bn - rn) / delta + 2
		} else {
			h = (rn - gn) / delta + 4
		}
		h *= 60
		if (h < 0) h += 360
	}

	const s = max === 0 ? 0 : delta / max
	return { h, s: s * 100, v: max * 100 }
}

/** @internal */
export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
	const sn = s / 100
	const vn = v / 100
	const c = vn * sn
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = vn - c

	let rp = 0
	let gp = 0
	let bp = 0

	if (h < 60) {
		rp = c
		gp = x
	} else if (h < 120) {
		rp = x
		gp = c
	} else if (h < 180) {
		gp = c
		bp = x
	} else if (h < 240) {
		gp = x
		bp = c
	} else if (h < 300) {
		rp = x
		bp = c
	} else {
		rp = c
		bp = x
	}

	return {
		r: (rp + m) * 255,
		g: (gp + m) * 255,
		b: (bp + m) * 255,
	}
}
