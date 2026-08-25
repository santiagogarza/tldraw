import {
	DefaultColorStyle,
	getColorValue,
	getFromLocalStorage,
	isHexColor,
	setInLocalStorage,
	TLDefaultColorStyle,
	useEditor,
	useValue,
} from '@tldraw/editor'
import { memo, useCallback, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TldrawUiButton } from '../primitives/Button/TldrawUiButton'
import { TldrawUiInput } from '../primitives/TldrawUiInput'
import {
	TldrawUiPopover,
	TldrawUiPopoverContent,
	TldrawUiPopoverTrigger,
} from '../primitives/TldrawUiPopover'
import { useStylePanelContext } from './StylePanelContext'

const DEFAULT_CUSTOM_COLOR = '#00b8d1'
const RECENT_COLORS_KEY = 'tldraw_recent_custom_colors'
const MAX_RECENT_COLORS = 8

interface HSV {
	h: number
	s: number
	v: number
}

function clamp01(n: number) {
	return Math.max(0, Math.min(1, n))
}

/** Accepts "f60", "#ff6600", "FF6600", or 8-digit hex; returns a `#rrggbb` string. */
function normalizeHexInput(input: string): string | null {
	let hex = input.trim().replace(/^#/, '').toLowerCase()
	if (/^[0-9a-f]{3}$/.test(hex)) {
		hex = hex
			.split('')
			.map((c) => c + c)
			.join('')
	}
	if (/^[0-9a-f]{8}$/.test(hex)) {
		hex = hex.slice(0, 6)
	}
	if (!/^[0-9a-f]{6}$/.test(hex)) return null
	return `#${hex}`
}

function hsvToHex({ h, s, v }: HSV): string {
	const c = v * s
	const hp = (((h % 360) + 360) % 360) / 60
	const x = c * (1 - Math.abs((hp % 2) - 1))
	const m = v - c
	let rgb: [number, number, number]
	if (hp < 1) rgb = [c, x, 0]
	else if (hp < 2) rgb = [x, c, 0]
	else if (hp < 3) rgb = [0, c, x]
	else if (hp < 4) rgb = [0, x, c]
	else if (hp < 5) rgb = [x, 0, c]
	else rgb = [c, 0, x]
	return (
		'#' +
		rgb
			.map((n) =>
				Math.round((n + m) * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	)
}

function hexToHsv(hex: string): HSV | null {
	const normalized = normalizeHexInput(hex)
	if (!normalized) return null
	const n = parseInt(normalized.slice(1), 16)
	const r = ((n >> 16) & 0xff) / 255
	const g = ((n >> 8) & 0xff) / 255
	const b = (n & 0xff) / 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const d = max - min
	let h = 0
	if (d !== 0) {
		if (max === r) h = 60 * (((g - b) / d + 6) % 6)
		else if (max === g) h = 60 * ((b - r) / d + 2)
		else h = 60 * ((r - g) / d + 4)
	}
	return { h, s: max === 0 ? 0 : d / max, v: max }
}

function getStoredRecentColors(): string[] {
	try {
		const stored: unknown = JSON.parse(getFromLocalStorage(RECENT_COLORS_KEY) ?? '[]')
		if (!Array.isArray(stored)) return []
		return stored.filter((v): v is string => typeof v === 'string' && isHexColor(v))
	} catch {
		return []
	}
}

/** @public @react */
export const StylePanelCustomColorPicker = memo(function StylePanelCustomColorPicker() {
	const editor = useEditor()
	const ctx = useStylePanelContext()
	const msg = useTranslation()

	const color = ctx.styles.get(DefaultColorStyle)
	const themeColors = useValue(
		'custom color picker theme colors',
		() => editor.getCurrentTheme().colors[editor.getColorMode()],
		[editor]
	)

	const activeHex =
		color?.type === 'shared' && isHexColor(color.value) ? normalizeHexInput(color.value) : null

	const [hsv, setHsv] = useState<HSV>(() => hexToHsv(DEFAULT_CUSTOM_COLOR)!)
	const [hexInput, setHexInput] = useState<string>(DEFAULT_CUSTOM_COLOR)
	const [recentColors, setRecentColors] = useState<string[]>(getStoredRecentColors)

	const currentHex = hsvToHex(hsv)
	const rCurrentHex = useRef(currentHex)
	rCurrentHex.current = currentHex

	const svRef = useRef<HTMLDivElement>(null)
	const hueRef = useRef<HTMLDivElement>(null)

	const applyHsv = useCallback(
		(next: HSV) => {
			setHsv(next)
			const hex = hsvToHex(next)
			setHexInput(hex)
			rCurrentHex.current = hex
			// hex color codes are valid runtime values for the color style,
			// but aren't part of the named color union
			ctx.onValueChange(DefaultColorStyle, hex as TLDefaultColorStyle)
		},
		[ctx]
	)

	const addRecentColor = useCallback((hex: string) => {
		setRecentColors((prev) => {
			const next = [hex, ...prev.filter((c) => c !== hex)].slice(0, MAX_RECENT_COLORS)
			setInLocalStorage(RECENT_COLORS_KEY, JSON.stringify(next))
			return next
		})
	}, [])

	// When the popover opens, start from the current color: the active custom
	// color if there is one, else the solid value of the current named color.
	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) return
			let hex: string | null = null
			if (color?.type === 'shared') {
				hex = normalizeHexInput(getColorValue(themeColors, color.value, 'solid'))
			}
			hex ??= recentColors[0] ?? DEFAULT_CUSTOM_COLOR
			const nextHsv = hexToHsv(hex)
			if (nextHsv) {
				setHsv(nextHsv)
				setHexInput(hex)
				rCurrentHex.current = hex
			}
		},
		[color, recentColors, themeColors]
	)

	const updateSvFromPointer = useCallback(
		(e: React.PointerEvent) => {
			const el = svRef.current
			if (!el) return
			const rect = el.getBoundingClientRect()
			applyHsv({
				h: hsv.h,
				s: clamp01((e.clientX - rect.left) / rect.width),
				v: 1 - clamp01((e.clientY - rect.top) / rect.height),
			})
		},
		[applyHsv, hsv.h]
	)

	const updateHueFromPointer = useCallback(
		(e: React.PointerEvent) => {
			const el = hueRef.current
			if (!el) return
			const rect = el.getBoundingClientRect()
			applyHsv({
				h: clamp01((e.clientX - rect.left) / rect.width) * 359.9,
				s: hsv.s,
				v: hsv.v,
			})
		},
		[applyHsv, hsv.s, hsv.v]
	)

	const handlePointerDown = useCallback(
		(update: (e: React.PointerEvent) => void) => (e: React.PointerEvent) => {
			e.currentTarget.setPointerCapture(e.pointerId)
			ctx.onHistoryMark('custom color picker')
			update(e)
		},
		[ctx]
	)

	const handlePointerMove = useCallback(
		(update: (e: React.PointerEvent) => void) => (e: React.PointerEvent) => {
			if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
			update(e)
		},
		[]
	)

	const handlePointerUp = useCallback(
		(e: React.PointerEvent) => {
			if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
			e.currentTarget.releasePointerCapture(e.pointerId)
			addRecentColor(rCurrentHex.current)
		},
		[addRecentColor]
	)

	const handleSvKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const step = e.shiftKey ? 0.1 : 0.02
			let { s, v } = hsv
			switch (e.key) {
				case 'ArrowLeft':
					s -= step
					break
				case 'ArrowRight':
					s += step
					break
				case 'ArrowUp':
					v += step
					break
				case 'ArrowDown':
					v -= step
					break
				default:
					return
			}
			e.preventDefault()
			ctx.onHistoryMark('custom color picker')
			applyHsv({ h: hsv.h, s: clamp01(s), v: clamp01(v) })
		},
		[applyHsv, ctx, hsv]
	)

	const handleHueKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const step = e.shiftKey ? 15 : 3
			let h = hsv.h
			switch (e.key) {
				case 'ArrowLeft':
				case 'ArrowDown':
					h -= step
					break
				case 'ArrowRight':
				case 'ArrowUp':
					h += step
					break
				default:
					return
			}
			e.preventDefault()
			ctx.onHistoryMark('custom color picker')
			applyHsv({ h: Math.max(0, Math.min(359.9, h)), s: hsv.s, v: hsv.v })
		},
		[applyHsv, ctx, hsv]
	)

	const commitHexInput = useCallback(
		(value: string) => {
			const normalized = normalizeHexInput(value)
			if (!normalized) {
				setHexInput(rCurrentHex.current)
				return
			}
			if (normalized === rCurrentHex.current && normalized === activeHex) {
				setHexInput(normalized)
				return
			}
			const nextHsv = hexToHsv(normalized)
			if (!nextHsv) return
			ctx.onHistoryMark('custom color picker')
			applyHsv(nextHsv)
			addRecentColor(normalized)
		},
		[activeHex, addRecentColor, applyHsv, ctx]
	)

	const handlePickRecent = useCallback(
		(hex: string) => {
			const nextHsv = hexToHsv(hex)
			if (!nextHsv) return
			ctx.onHistoryMark('custom color picker')
			applyHsv(nextHsv)
			addRecentColor(hex)
		},
		[addRecentColor, applyHsv, ctx]
	)

	if (color === undefined) return null

	const title = msg('style-panel.custom-color')

	return (
		<TldrawUiPopover id="style panel custom color" onOpenChange={handleOpenChange}>
			<TldrawUiPopoverTrigger>
				<TldrawUiButton
					type="icon"
					data-testid="style.custom-color"
					title={title}
					isActive={!!activeHex}
					className="tlui-custom-color-picker__trigger"
				>
					<div
						className="tlui-custom-color-picker__trigger-swatch"
						data-custom={!!activeHex}
						style={activeHex ? { backgroundColor: activeHex } : undefined}
					/>
					<span className="tlui-custom-color-picker__trigger-label">{title}</span>
				</TldrawUiButton>
			</TldrawUiPopoverTrigger>
			<TldrawUiPopoverContent side="left" align="start" sideOffset={8} autoFocusFirstButton={false}>
				<div className="tlui-custom-color-picker" data-testid="style.custom-color.panel">
					<div
						ref={svRef}
						className="tlui-custom-color-picker__saturation"
						style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
						role="slider"
						aria-label={msg('style-panel.custom-color-saturation')}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={Math.round(hsv.v * 100)}
						aria-valuetext={currentHex}
						tabIndex={0}
						data-testid="style.custom-color.saturation"
						onPointerDown={handlePointerDown(updateSvFromPointer)}
						onPointerMove={handlePointerMove(updateSvFromPointer)}
						onPointerUp={handlePointerUp}
						onKeyDown={handleSvKeyDown}
					>
						<div
							className="tlui-custom-color-picker__thumb"
							style={{
								left: `${hsv.s * 100}%`,
								top: `${(1 - hsv.v) * 100}%`,
								backgroundColor: currentHex,
							}}
						/>
					</div>
					<div
						ref={hueRef}
						className="tlui-custom-color-picker__hue"
						role="slider"
						aria-label={msg('style-panel.custom-color-hue')}
						aria-valuemin={0}
						aria-valuemax={360}
						aria-valuenow={Math.round(hsv.h)}
						tabIndex={0}
						data-testid="style.custom-color.hue"
						onPointerDown={handlePointerDown(updateHueFromPointer)}
						onPointerMove={handlePointerMove(updateHueFromPointer)}
						onPointerUp={handlePointerUp}
						onKeyDown={handleHueKeyDown}
					>
						<div
							className="tlui-custom-color-picker__thumb"
							style={{
								left: `${(hsv.h / 360) * 100}%`,
								top: '50%',
								backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
							}}
						/>
					</div>
					<div className="tlui-custom-color-picker__hex-row">
						<div
							className="tlui-custom-color-picker__preview"
							style={{ backgroundColor: currentHex }}
						/>
						<TldrawUiInput
							className="tlui-custom-color-picker__hex-input"
							value={hexInput}
							onValueChange={setHexInput}
							onComplete={commitHexInput}
							onBlur={commitHexInput}
							data-testid="style.custom-color.hex"
							aria-label={msg('style-panel.custom-color-hex')}
						/>
					</div>
					{recentColors.length > 0 && (
						<div
							className="tlui-custom-color-picker__recent"
							role="group"
							aria-label={msg('style-panel.custom-color-recent')}
						>
							{recentColors.map((hex) => (
								<TldrawUiButton
									key={hex}
									type="icon"
									className="tlui-custom-color-picker__recent-swatch"
									title={hex}
									data-testid={`style.custom-color.recent.${hex.slice(1)}`}
									onClick={() => handlePickRecent(hex)}
								>
									<div
										className="tlui-custom-color-picker__recent-swatch-fill"
										style={{ backgroundColor: hex }}
									/>
								</TldrawUiButton>
							))}
						</div>
					)}
				</div>
			</TldrawUiPopoverContent>
		</TldrawUiPopover>
	)
})
