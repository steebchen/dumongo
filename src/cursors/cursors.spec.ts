import { ObjectID } from 'mongodb'
import * as assert from 'power-assert'
import { decodeCursor, encodeCursor } from '.'

describe('Collection encodeCursor & decodeCursor', function () {
	it('string', function () {
		const value = 'hi'
		const cursor = encodeCursor(value)
		const encoded = Buffer.from(JSON.stringify(value)).toString('base64')

		assert(cursor === encoded)

		const decoded = decodeCursor(encoded)

		assert(decoded === value)
	})

	it('number', function () {
		const value = 5
		const cursor = encodeCursor(value)
		const encoded = Buffer.from(JSON.stringify(value)).toString('base64')

		assert(cursor === encoded)

		const decoded = decodeCursor(encoded)

		assert(decoded === value)
	})

	it('date', function () {
		const value = new Date()
		const cursor = encodeCursor(value)

		const json = {
			type: 'Date',
			value,
		}

		const encoded = Buffer.from(JSON.stringify(json)).toString('base64')

		assert(cursor === encoded)

		const decoded = decodeCursor(cursor)

		assert.deepEqual(decoded, value)
	})

	it('ObjectID', function () {
		const value = new ObjectID()
		const cursor = encodeCursor(value)

		const json = {
			type: 'ObjectID',
			value,
		}

		const encoded = Buffer.from(JSON.stringify(json)).toString('base64')

		assert(cursor === encoded)

		const decoded = decodeCursor(cursor)

		assert.deepEqual(decoded, value)
	})

	it('fails decoding invalid string', function () {
		assert.throws(() => {
			decodeCursor('...')
		})
	})
})
