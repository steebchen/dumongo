import * as assert from 'power-assert'
import { encodeCursor } from '../cursors'
import { Project, projects, setFixtures, user1 } from '../test'

describe('Collection.connection', function () {
	beforeEach(setFixtures)

	it('execute basic connection', async function () {
		const result = await Project.connection({
			user: user1,
		})

		const totalCount = await result.totalCount()

		assert(totalCount === 3)

		const sortByKey = '_id'

		assert.deepStrictEqual(result.pageInfo(), {
			endCursor: 'eyJ0eXBlIjoiT2JqZWN0SUQiLCJ2YWx1ZSI6IjViOWZhZWYwYzUxMjEwNGM5YzEyMTJiNCJ9',
			hasNextPage: false,
			sortBy: sortByKey,
			order: 1,
			limit: 10,
			count: 3,
		})

		assert.deepStrictEqual(result.nodes(), projects)

		assert.deepStrictEqual(result.edges(), projects.map((i) => {
			return {
				cursor: encodeCursor(i[sortByKey]),
				node: i,
			}
		}))
	})

	const sortAfterCursor = 'eyJ0eXBlIjoiRGF0ZSIsInZhbHVlIjoiMjAxOC0wOS0xM1QxNDozMjoxOS42MzhaIn0='
	const sortByKey = 'created'

	it('sort after created', async function () {
		const result = await Project.connection({
			user: user1,
		}, {
			sortBy: sortByKey,
			limit: 2,
			order: -1,
		})

		const totalCount = await result.totalCount()

		assert(totalCount === 3)

		assert.deepStrictEqual(result.pageInfo(), {
			endCursor: sortAfterCursor,
			hasNextPage: true,
			sortBy: sortByKey,
			order: -1,
			limit: 2,
			count: 2,
		})

		const filteredProjects = projects.reverse().filter((i, n) => n < 2)

		assert.deepStrictEqual(result.nodes(), filteredProjects)

		assert.deepStrictEqual(result.edges(), filteredProjects.map((i) => {
			return {
				cursor: encodeCursor(i[sortByKey]),
				node: i,
			}
		}))
	})

	it('ask for next items after cursor', async function () {
		const result = await Project.connection({
			user: user1,
		}, {
			sortBy: sortByKey,
			limit: 2,
			order: -1,
			after: sortAfterCursor,
		})

		const totalCount = await result.totalCount()

		assert(totalCount === 3)

		assert.deepStrictEqual(result.pageInfo(), {
			endCursor: 'eyJ0eXBlIjoiRGF0ZSIsInZhbHVlIjoiMjAxOC0wOS0xMlQxNDozMjoxMi4xNDFaIn0=',
			hasNextPage: false,
			sortBy: sortByKey,
			order: -1,
			limit: 2,
			count: 1,
		})

		const filteredProjects = projects.filter((i, n) => n === 2)

		assert.deepStrictEqual(result.nodes(), filteredProjects)

		assert.deepStrictEqual(result.edges(), filteredProjects.map((i) => {
			return {
				cursor: encodeCursor(i[sortByKey]),
				node: i,
			}
		}))
	})
})
