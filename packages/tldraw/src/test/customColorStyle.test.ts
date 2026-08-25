import {
	createShapeId,
	DefaultColorStyle,
	getSnapshot,
	loadSnapshot,
	TLDefaultColorStyle,
	TLGeoShape,
} from '@tldraw/editor'
import { TestEditor } from './TestEditor'

let editor: TestEditor

const ids = {
	box1: createShapeId('box1'),
}

beforeEach(() => {
	editor = new TestEditor()
	editor.createShapes([{ id: ids.box1, type: 'geo', x: 0, y: 0, props: { w: 100, h: 100 } }])
})

afterEach(() => {
	editor?.dispose()
})

describe('custom hex color style', () => {
	it('applies a custom hex color to selected shapes', () => {
		editor.select(ids.box1)
		editor.setStyleForSelectedShapes(DefaultColorStyle, '#ff6600' as TLDefaultColorStyle)
		expect(editor.getShape<TLGeoShape>(ids.box1)!.props.color).toBe('#ff6600')
	})

	it('draws the next shape with the custom color', () => {
		editor.setStyleForNextShapes(DefaultColorStyle, '#00aa55' as TLDefaultColorStyle)
		editor.setCurrentTool('geo')
		editor.pointerDown(200, 200).pointerMove(300, 300).pointerUp(300, 300)

		const shapes = editor.getCurrentPageShapes()
		const created = shapes.find((s) => s.id !== ids.box1) as TLGeoShape
		expect(created.props.color).toBe('#00aa55')
	})

	it('undoes and redoes custom color changes', () => {
		editor.select(ids.box1)
		editor.markHistoryStoppingPoint('before color')
		editor.setStyleForSelectedShapes(DefaultColorStyle, '#ff6600' as TLDefaultColorStyle)

		editor.undo()
		expect(editor.getShape<TLGeoShape>(ids.box1)!.props.color).toBe('black')

		editor.redo()
		expect(editor.getShape<TLGeoShape>(ids.box1)!.props.color).toBe('#ff6600')
	})

	it('round-trips custom colors through a snapshot', () => {
		editor.select(ids.box1)
		editor.setStyleForSelectedShapes(DefaultColorStyle, '#ff6600' as TLDefaultColorStyle)

		const snapshot = getSnapshot(editor.store)

		const editor2 = new TestEditor()
		loadSnapshot(editor2.store, snapshot)
		expect(editor2.getShape<TLGeoShape>(ids.box1)!.props.color).toBe('#ff6600')
		editor2.dispose()
	})
})
