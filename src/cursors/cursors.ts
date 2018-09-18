import { ObjectID } from 'mongodb'
import { Cursor, CursorValue } from '..'

export function encodeCursor(value: CursorValue): string {
	let encode
	let str

	if (value instanceof ObjectID) {
		encode = {
			type: 'ObjectID',
			value: value.toHexString(),
		} as Cursor
	} else if (value instanceof Date) {
		encode = {
			type: 'Date',
			value: value.toISOString(),
		} as Cursor
	} else {
		encode = value
	}

	str = JSON.stringify(encode)

	const base64 = Buffer.from(str).toString('base64')

	return base64
}

export function decodeCursor(value: string): CursorValue {
	const decoded = Buffer.from(value, 'base64').toString('utf8')

	if (!decoded) {
		throw new Error(`value must be base64-encoded`)
	}

	const obj = JSON.parse(decoded) as Cursor

	if (typeof obj === 'object') {
		if (obj.type === 'ObjectID') {
			return new ObjectID(obj.value)
		}

		if (obj.type === 'Date') {
			return new Date(obj.value)
		}
	}

	return obj as CursorValue
}
