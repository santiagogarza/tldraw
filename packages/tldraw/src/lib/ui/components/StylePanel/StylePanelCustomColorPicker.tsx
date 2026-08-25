import { DefaultColorStyle, useEditor } from '@tldraw/editor'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TldrawUiButton } from '../primitives/Button/TldrawUiButton'
import { TldrawUiButtonLabel } from '../primitives/Button/TldrawUiButtonLabel'
import { TldrawUiInput } from '../primitives/TldrawUiInput'
import { TldrawUiSlider } from '../primitives/TldrawUiSlider'
import { hexToHsv, hsvToHex, HsvColor, normalizeHex } from './colorPickerUtils'
import { addCustomColor } from './customColorPalette'
import { useStylePanelContext } from './StylePanelContext'

/** @internal */
export interface StylePanelCustomColorPickerProps {
	onClose(): void
	initialHex: string
}

/** @internal @react */
export function StylePanelCustomColorPicker({
	onClose,
	initialHex,
}: StylePanelCustomColorPickerProps) {
	const editor = useEditor()
	const msg = useTranslation()
	const { onValueChange, onHistoryMark } = useStylePanelContext()

	const [hsv, setHsv] = useState<HsvColor>(() => hexToHsv(initialHex))
	const [hexInput, setHexInput] = useState(() => hsvToHex(hexToHsv(initialHex)))

	const hex = hsvToHex(hsv)

	const updateFromHsv = useCallback((next: HsvColor) => {
		setHsv(next)
		setHexInput(hsvToHex(next))
	}, [])

	const updateFromHex = useCallback((nextHex: string) => {
		setHexInput(nextHex)
		const normalized = normalizeHex(nextHex)
		if (normalized) {
			setHsv(hexToHsv(normalized))
		}
	}, [])

	const handleAdd = useCallback(() => {
		const normalized = normalizeHex(hex)
		if (!normalized) return

		const id = addCustomColor(editor, normalized)
		if (!id) return

		onHistoryMark('custom color picker')
		onValueChange(DefaultColorStyle, id as 'black')
		onClose()
	}, [editor, hex, onClose, onHistoryMark, onValueChange])

	return (
		<div className="tlui-style-panel__custom-color-picker" data-testid="style.custom-color-picker">
			<StylePanelSubheadingPicker>{msg('style-panel.custom-color')}</StylePanelSubheadingPicker>
			<SaturationValuePicker hsv={hsv} onChange={updateFromHsv} />
			<TldrawUiSlider
				data-testid="style.custom-color.hue"
				min={0}
				steps={360}
				value={Math.round(hsv.h)}
				label="style-panel.custom-color-hue"
				title={msg('style-panel.custom-color-hue')}
				onValueChange={(value) => updateFromHsv({ ...hsv, h: value })}
			/>
			<div className="tlui-style-panel__custom-color-picker__hex-row">
				<div
					className="tlui-style-panel__custom-color-picker__preview"
					style={{ backgroundColor: hex }}
					data-testid="style.custom-color.preview"
				/>
				<TldrawUiInput
					className="tlui-style-panel__custom-color-picker__hex-input"
					data-testid="style.custom-color.hex"
					value={hexInput}
					onValueChange={updateFromHex}
					onComplete={updateFromHex}
					aria-label={msg('style-panel.custom-color-hex')}
				/>
			</div>
			<div className="tlui-style-panel__custom-color-picker__actions">
				<TldrawUiButton
					type="primary"
					className="tlui-style-panel__custom-color-picker__add"
					data-testid="style.custom-color.add"
					onClick={handleAdd}
				>
					<TldrawUiButtonLabel>{msg('style-panel.add-color')}</TldrawUiButtonLabel>
				</TldrawUiButton>
				<TldrawUiButton
					type="normal"
					className="tlui-style-panel__custom-color-picker__cancel"
					data-testid="style.custom-color.cancel"
					onClick={onClose}
				>
					<TldrawUiButtonLabel>{msg('style-panel.cancel')}</TldrawUiButtonLabel>
				</TldrawUiButton>
			</div>
		</div>
	)
}

function StylePanelSubheadingPicker({ children }: { children: React.ReactNode }) {
	return <div className="tlui-style-panel__subheading">{children}</div>
}

function SaturationValuePicker({
	hsv,
	onChange,
}: {
	hsv: HsvColor
	onChange(hsv: HsvColor): void
}) {
	const areaRef = useRef<HTMLDivElement>(null)
	const draggingRef = useRef(false)

	const hueColor = hsvToHex({ h: hsv.h, s: 100, v: 100 })

	const updateFromPointer = useCallback(
		(clientX: number, clientY: number) => {
			const area = areaRef.current
			if (!area) return
			const rect = area.getBoundingClientRect()
			const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
			const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
			onChange({ ...hsv, s: x * 100, v: (1 - y) * 100 })
		},
		[hsv, onChange]
	)

	useEffect(() => {
		const handlePointerMove = (e: PointerEvent) => {
			if (!draggingRef.current) return
			updateFromPointer(e.clientX, e.clientY)
		}
		const handlePointerUp = () => {
			draggingRef.current = false
		}
		window.addEventListener('pointermove', handlePointerMove)
		window.addEventListener('pointerup', handlePointerUp)
		return () => {
			window.removeEventListener('pointermove', handlePointerMove)
			window.removeEventListener('pointerup', handlePointerUp)
		}
	}, [updateFromPointer])

	const handlePointerDown = (e: React.PointerEvent) => {
		e.preventDefault()
		draggingRef.current = true
		updateFromPointer(e.clientX, e.clientY)
	}

	const thumbLeft = `${hsv.s}%`
	const thumbTop = `${100 - hsv.v}%`

	return (
		<div
			ref={areaRef}
			className="tlui-style-panel__custom-color-picker__sv"
			data-testid="style.custom-color.sv"
			style={{ backgroundColor: hueColor }}
			onPointerDown={handlePointerDown}
		>
			<div className="tlui-style-panel__custom-color-picker__sv-white" />
			<div className="tlui-style-panel__custom-color-picker__sv-black" />
			<div
				className="tlui-style-panel__custom-color-picker__sv-thumb"
				style={{ left: thumbLeft, top: thumbTop, backgroundColor: hsvToHex(hsv) }}
			/>
		</div>
	)
}
