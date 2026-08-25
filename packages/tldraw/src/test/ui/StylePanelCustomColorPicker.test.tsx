import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import {
	createShapeId,
	DefaultColorStyle,
	Editor,
	TLDefaultColorStyle,
	TLGeoShape,
} from '@tldraw/editor'
import { Tldraw } from '../../lib/Tldraw'
import { renderTldrawComponentWithEditor } from '../testutils/renderTldrawComponent'

let editor: Editor

beforeEach(async () => {
	globalThis.localStorage?.clear()
	const result = await renderTldrawComponentWithEditor((onMount) => <Tldraw onMount={onMount} />, {
		waitForPatterns: false,
	})
	editor = result.editor

	act(() => {
		editor.user.updateUserPreferences({ colorScheme: 'light' })
		editor.setStyleForNextShapes(DefaultColorStyle, 'black')
	})
})

describe('StylePanelCustomColorPicker', () => {
	it('renders the trigger button under the default colors', async () => {
		const trigger = await screen.findByTestId('style.custom-color')
		const colorGrid = await screen.findByTestId('style.color')

		expect(
			colorGrid.compareDocumentPosition(trigger) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy()
	})

	it('is not active while a named color is selected', async () => {
		const trigger = await screen.findByTestId('style.custom-color')
		expect(trigger.getAttribute('data-isactive')).toBe('false')
	})

	it('applies a typed hex color to the selected shape and records it as recent', async () => {
		const id = createShapeId()
		act(() => {
			editor.createShape<TLGeoShape>({ id, type: 'geo', x: 0, y: 0, props: { w: 100, h: 100 } })
			editor.select(id)
		})

		fireEvent.click(await screen.findByTestId('style.custom-color'))
		const input = await screen.findByTestId('style.custom-color.hex')

		fireEvent.change(input, { target: { value: '#ff6600' } })
		fireEvent.keyDown(input, { key: 'Enter' })

		await waitFor(() => {
			expect(editor.getShape<TLGeoShape>(id)!.props.color).toBe('#ff6600')
		})

		// the color is now in the recent colors row
		await screen.findByTestId('style.custom-color.recent.ff6600')

		// and the trigger shows it as the active swatch
		const trigger = await screen.findByTestId('style.custom-color')
		await waitFor(() => {
			expect(trigger.getAttribute('data-isactive')).toBe('true')
		})
	})

	it('shows the active state when the next-shape color is a custom hex', async () => {
		act(() => {
			editor.setStyleForNextShapes(DefaultColorStyle, '#00ff88' as TLDefaultColorStyle)
		})

		const trigger = await screen.findByTestId('style.custom-color')
		await waitFor(() => {
			expect(trigger.getAttribute('data-isactive')).toBe('true')
		})
	})

	it('adjusts the color with the keyboard from the saturation area', async () => {
		fireEvent.click(await screen.findByTestId('style.custom-color'))
		const saturation = await screen.findByTestId('style.custom-color.saturation')

		fireEvent.keyDown(saturation, { key: 'ArrowUp' })

		await waitFor(() => {
			const next = editor.getStyleForNextShape(DefaultColorStyle)
			expect(next).toMatch(/^#[0-9a-f]{6}$/)
		})
	})

	it('ignores invalid hex input', async () => {
		fireEvent.click(await screen.findByTestId('style.custom-color'))
		const input = (await screen.findByTestId('style.custom-color.hex')) as HTMLInputElement

		fireEvent.change(input, { target: { value: 'not-a-color' } })
		fireEvent.keyDown(input, { key: 'Enter' })

		await waitFor(() => {
			// input reverts to the current picker color rather than keeping garbage
			expect(input.value).toMatch(/^#[0-9a-f]{6}$/)
		})
		expect(editor.getStyleForNextShape(DefaultColorStyle)).toBe('black')
	})
})
