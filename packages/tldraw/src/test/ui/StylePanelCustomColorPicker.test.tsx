import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { createShapeId, DefaultColorStyle, Editor, getColorValue, TLGeoShape } from '@tldraw/editor'
import { Tldraw } from '../../lib/Tldraw'
import {
	customColorPaletteAtom,
	hideCustomColor,
	MAX_VISIBLE_CUSTOM_COLORS,
} from '../../lib/ui/components/StylePanel/customColorPalette'
import { renderTldrawComponentWithEditor } from '../testutils/renderTldrawComponent'

let editor: Editor

beforeEach(async () => {
	customColorPaletteAtom.set({ nextId: 1, colors: [], hidden: [] })

	const result = await renderTldrawComponentWithEditor((onMount) => <Tldraw onMount={onMount} />, {
		waitForPatterns: false,
	})
	editor = result.editor

	act(() => {
		editor.user.updateUserPreferences({ colorScheme: 'light' })
		editor.setStyleForNextShapes(DefaultColorStyle, 'black')
		editor.createShape({
			id: createShapeId(),
			type: 'geo',
			x: 0,
			y: 0,
			props: { geo: 'rectangle', w: 100, h: 100 },
		})
		editor.selectAll()
	})
})

async function openCustomColorPicker() {
	const chooseButton = await screen.findByTestId('style.choose-color')
	act(() => {
		fireEvent.click(chooseButton)
	})
	await screen.findByTestId('style.custom-color-picker')
}

describe('StylePanel custom color picker', () => {
	it('opens the custom picker and hides the default fill controls', async () => {
		await openCustomColorPicker()

		expect(screen.getByTestId('style.custom-color-picker')).toBeTruthy()
		expect(screen.queryByTestId('style.fill')).toBeNull()
	})

	it('adds a custom color and applies it to the selection', async () => {
		await openCustomColorPicker()

		const hexInput = screen.getByTestId('style.custom-color.hex')
		act(() => {
			fireEvent.change(hexInput, { target: { value: '#ff5500' } })
		})

		act(() => {
			fireEvent.click(screen.getByTestId('style.custom-color.add'))
		})

		await waitFor(() => {
			expect(screen.getByTestId('style.color.custom-1')).toBeTruthy()
		})

		const shape = editor.getSelectedShapes()[0] as TLGeoShape
		expect(shape.props.color).toBe('custom-1')

		const colors = editor.getCurrentTheme().colors[editor.getColorMode()]
		expect(getColorValue(colors, 'custom-1', 'solid')).toBe('#ff5500')
	})

	it('cancels without adding a custom color', async () => {
		await openCustomColorPicker()

		act(() => {
			fireEvent.click(screen.getByTestId('style.custom-color.cancel'))
		})

		await waitFor(() => {
			expect(screen.queryByTestId('style.custom-color-picker')).toBeNull()
		})
		expect(screen.queryByTestId('style.color.custom-1')).toBeNull()
	})

	it('disables choose color at the visible custom color cap', async () => {
		for (let i = 0; i < MAX_VISIBLE_CUSTOM_COLORS; i++) {
			await openCustomColorPicker()
			act(() => {
				fireEvent.click(screen.getByTestId('style.custom-color.add'))
			})
			await waitFor(() => {
				expect(screen.queryByTestId('style.custom-color-picker')).toBeNull()
			})
		}

		const chooseButton = screen.getByTestId('style.choose-color') as HTMLButtonElement
		expect(chooseButton.disabled).toBe(true)
	})

	it('hides a custom swatch without changing shape color', async () => {
		await openCustomColorPicker()
		act(() => {
			fireEvent.click(screen.getByTestId('style.custom-color.add'))
		})

		await screen.findByTestId('style.color.custom-1')
		const shapeId = editor.getSelectedShapeIds()[0]!

		act(() => {
			hideCustomColor('custom-1')
		})

		await waitFor(() => {
			expect(screen.queryByTestId('style.color.custom-1')).toBeNull()
		})

		expect((editor.getShape(shapeId) as TLGeoShape).props.color).toBe('custom-1')
	})
})
