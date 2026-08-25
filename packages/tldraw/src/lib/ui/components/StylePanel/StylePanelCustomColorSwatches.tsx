import {
	DefaultColorStyle,
	elementShouldCaptureKeys,
	getColorValue,
	TLDefaultColorStyle,
	useEditor,
	useValue,
} from '@tldraw/editor'
import { ContextMenu as _ContextMenu } from 'radix-ui'
import React, { useCallback, useMemo, useRef } from 'react'
import { StyleValuesForUi } from '../../../styles'
import { PORTRAIT_BREAKPOINT } from '../../constants'
import { useBreakpoint } from '../../context/breakpoints'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TldrawUiButtonIcon } from '../primitives/Button/TldrawUiButtonIcon'
import { TldrawUiGrid } from '../primitives/layout'
import {
	TldrawUiToolbar,
	TldrawUiToolbarToggleGroup,
	TldrawUiToolbarToggleItem,
} from '../primitives/TldrawUiToolbar'
import {
	customColorPaletteAtom,
	getVisibleCustomColors,
	hideCustomColor,
} from './customColorPalette'
import { useStylePanelContext } from './StylePanelContext'

/** @internal @react */
export function StylePanelCustomColorSwatches() {
	const editor = useEditor()
	const { styles, onValueChange, onHistoryMark } = useStylePanelContext()
	const msg = useTranslation()
	const color = styles.get(DefaultColorStyle)

	const paletteState = useValue(customColorPaletteAtom)
	const visibleCustomColors = getVisibleCustomColors(paletteState)

	const colors = useValue(
		'style panel custom color swatch colors',
		() => editor.getCurrentTheme().colors[editor.getColorMode()],
		[editor]
	)

	const items: StyleValuesForUi<string> = useMemo(
		() => visibleCustomColors.map((c) => ({ value: c.id, icon: 'color' as const })),
		[visibleCustomColors]
	)

	const breakpoint = useBreakpoint()
	const rPointing = useRef(false)
	const rPointingOriginalActiveElement = useRef<HTMLElement | null>(null)

	const {
		handleButtonClick,
		handleButtonPointerDown,
		handleButtonPointerEnter,
		handleButtonPointerUp,
	} = useMemo(() => {
		const handlePointerUp = () => {
			rPointing.current = false
			editor.getContainerWindow().removeEventListener('pointerup', handlePointerUp)

			const origActiveEl = rPointingOriginalActiveElement.current
			if (origActiveEl && elementShouldCaptureKeys(origActiveEl, false)) {
				origActiveEl.focus()
			} else if (breakpoint >= PORTRAIT_BREAKPOINT.TABLET_SM) {
				editor.getContainer().focus()
			}
			rPointingOriginalActiveElement.current = null
		}

		const handleButtonClick = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset
			if (!id) return
			if (color?.type === 'shared' && color.value === id) return

			onHistoryMark('point picker item')
			onValueChange(DefaultColorStyle, id as 'black')
		}

		const handleButtonPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset
			if (!id) return

			onHistoryMark('point picker item')
			onValueChange(DefaultColorStyle, id as 'black')

			rPointing.current = true
			rPointingOriginalActiveElement.current = editor.getContainerDocument()
				.activeElement as HTMLElement
			editor.getContainerWindow().addEventListener('pointerup', handlePointerUp)
		}

		const handleButtonPointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
			if (!rPointing.current) return
			const { id } = e.currentTarget.dataset
			if (!id) return
			onValueChange(DefaultColorStyle, id as 'black')
		}

		const handleButtonPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
			const { id } = e.currentTarget.dataset
			if (!id) return
			if (color?.type === 'shared' && color.value === id) return
			onValueChange(DefaultColorStyle, id as 'black')
		}

		return {
			handleButtonClick,
			handleButtonPointerDown,
			handleButtonPointerEnter,
			handleButtonPointerUp,
		}
	}, [editor, breakpoint, color, onHistoryMark, onValueChange])

	const handleHide = useCallback((id: string) => {
		hideCustomColor(id)
	}, [])

	if (color === undefined || items.length === 0) return null

	return (
		<TldrawUiToolbar label={msg('style-panel.custom-colors')}>
			<TldrawUiToolbarToggleGroup
				data-testid="style.custom-color"
				type="single"
				value={color.type === 'shared' ? color.value : null}
				asChild
			>
				<TldrawUiGrid>
					{items.map((item) => {
						const isActive = color.type === 'shared' && color.value === item.value
						const entry = visibleCustomColors.find((c) => c.id === item.value)
						const label =
							msg('style-panel.color') + ' — ' + (entry?.hex.toUpperCase() ?? item.value)
						return (
							<_ContextMenu.Root key={item.value}>
								<_ContextMenu.Trigger asChild>
									<TldrawUiToolbarToggleItem
										type="icon"
										data-id={item.value}
										data-testid={`style.color.${item.value}`}
										aria-label={label + (isActive ? ` (${msg('style-panel.selected')})` : '')}
										tooltip={
											<>
												<div>{label}</div>
												{isActive ? <div>({msg('style-panel.selected')})</div> : null}
											</>
										}
										value={item.value}
										data-state={isActive ? 'on' : 'off'}
										data-isactive={isActive}
										title={label}
										style={{
											color: getColorValue(colors, item.value as TLDefaultColorStyle, 'solid'),
										}}
										onContextMenu={(e) => {
											e.preventDefault()
											e.stopPropagation()
										}}
										onPointerEnter={handleButtonPointerEnter}
										onPointerDown={handleButtonPointerDown}
										onPointerUp={handleButtonPointerUp}
										onClick={handleButtonClick}
									>
										<TldrawUiButtonIcon icon={item.icon} />
									</TldrawUiToolbarToggleItem>
								</_ContextMenu.Trigger>
								<_ContextMenu.Portal container={editor.getContainer()}>
									<_ContextMenu.Content className="tlui-menu">
										<_ContextMenu.Item
											className="tlui-button tlui-button__menu"
											data-testid={`style.color.${item.value}.hide`}
											onSelect={() => handleHide(item.value)}
										>
											{msg('style-panel.hide-custom-color')}
										</_ContextMenu.Item>
									</_ContextMenu.Content>
								</_ContextMenu.Portal>
							</_ContextMenu.Root>
						)
					})}
				</TldrawUiGrid>
			</TldrawUiToolbarToggleGroup>
		</TldrawUiToolbar>
	)
}
