import { CursorValue, DefaultTypes, Query, Result } from '..'
import { decodeCursor, encodeCursor } from '../cursors'
import { Collection as CollectionBase } from './CollectionBase'

export interface Pagination {
	order?: 1 | -1,
	limit?: number,
	sortBy?: string,
	after?: string,
}

export interface PageInfo {
	endCursor: string | null
	hasNextPage: boolean
	sortBy: string
	order: 1 | -1
	limit: number
	count: number
}

export interface Edge<T> {
	node: T
	cursor: string
}

export interface Connection<T> {
	totalCount: () => Promise<number>
	pageInfo: () => PageInfo
	edges: () => Array<Edge<T>>
	nodes: () => T[]
}

export type StaticThis<T> = (new (object: Query<T>) => T) & typeof Collection

export interface CursorObject {
	type: 'Date' | 'ObjectID'
	value: string
}

export type Cursor = string | number | CursorObject

export abstract class Collection extends CollectionBase {
	public static async connection<
		T extends Collection,
		K extends keyof T & string,
	>(
		this: StaticThis<T>,
		sortedQuery: Query<T>,
		{
			sortBy = '_id',
			limit = 10,
			order = 1,
			after,
		}: Pagination = {},
		select?: K[],
	): Promise<Connection<Result<T, K>>> {
		const query = Object.assign({}, sortedQuery)
		if (after) {
			const cursor = decodeCursor(after)

			const sort: DefaultTypes<CursorValue> = {}

			if (order === 1) {
				sort.$gt = cursor
			} else if (order === -1) {
				sort.$lt = cursor
			} else {
				throw new Error(`invalid sort order ${order}`)
			}

			sortedQuery[sortBy] = sort
		}

		const items = await this.find(sortedQuery, {
			limit: limit + 1,
			sort: {
				[sortBy]: order,
			} as any,
		}, select as any)

		let hasNextPage: boolean = false
		let next: string | null = null

		if (items.length === (limit + 1)) {
			items.pop()
			hasNextPage = true
		}

		if (items.length) {
			const prop = items[items.length - 1][sortBy]

			if (!prop) {
				throw new Error(`no such field ${sortBy}`)
			}

			next = encodeCursor(prop)
		}

		return {
			pageInfo: () => {
				return {
					endCursor: next,
					hasNextPage,
					sortBy,
					order,
					limit,
					count: items.length,
				}
			},
			edges: () => {
				const edges: Array<Edge<Result<T, K>>> = []

				for (const item of items) {
					const cursor = items[items.length - 1][sortBy]

					if (!cursor) {
						throw new Error(`no such field ${sortBy} in item ${item._id}`)
					}

					edges.push({
						cursor: encodeCursor(item[sortBy]),
						node: item,
					})
				}

				return edges
			},
			nodes: () => {
				return items
			},
			totalCount: () => {
				return this.count(query)
			},
		}
	}
}
