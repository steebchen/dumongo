import * as mongodb from 'mongodb'
import { FindOptions, Index, Pipeline, Query, Result, Update } from './types'

export type StaticThis<T> = (new (object: Query<T>) => T) & typeof Collection

export abstract class Collection {
	private static collection: mongodb.Collection

	// tslint:disable-next-line variable-name
	public _id: mongodb.ObjectID

	public constructor(obj: { [name: string]: any }) {
		for (const item in obj) {
			this[item] = obj[item]
		}
	}

	public static init(db: mongodb.Db, collection: string) {
		this.collection = db.collection(collection)
	}

	public static createIndex<T extends Collection>(
		this: StaticThis<T>,
		index: Index<T>,
		options?: mongodb.IndexOptions,
	) {
		return this.collection.createIndex(index, options)
	}

	public static async findById<T extends Collection>(
		this: StaticThis<T>,
		id: string,
	): Promise<T | null> {
		const obj = await this.collection.findOne({ _id: id })
		if (!obj) {
			return null
		}
		return new this(obj)
	}

	public static async insertOne<T extends Collection>(
		this: StaticThis<T>,
		obj: Query<T>,
	): Promise<T> {
		await this.collection.insertOne(obj)
		return new this(obj)
	}

	public static async insertMany<T extends Collection>(
		this: StaticThis<T>,
		obj: Array<Query<T>>,
	): Promise<void> {
		await this.collection.insertMany(obj)
	}

	public static removeById<T extends Collection>(
		this: StaticThis<T>,
		id: string,
	): Promise<mongodb.DeleteWriteOpResultObject> {
		return this.collection.deleteOne({ _id: id })
	}

	public static removeOne<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
	): Promise<mongodb.DeleteWriteOpResultObject> {
		return this.collection.deleteOne(query)
	}

	public static removeMany<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
	): Promise<mongodb.DeleteWriteOpResultObject> {
		return this.collection.deleteMany(query)
	}

	public static async count<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
		options?: mongodb.MongoCountPreferences,
	): Promise<number> {
		return this.collection.countDocuments(query, options)
	}

	public static async find<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
		options?: FindOptions<T>,
	): Promise<T[]>

	public static async find<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		options: FindOptions<T>,
		select?: K,
	): Promise<Array<T[K]>>

	public static async find<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		options: FindOptions<T>,
		select?: K[],
	): Promise<Array<Result<T, K>>>

	public static async find<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		options: FindOptions<T> = {},
		select?: K | K[],
	): Promise<Array<T[K]> | Array<Result<T, K>>> {
		const arr = await this.collection
			.find(query, this.select(select))
			.sort(options.sort || {})
			.limit(options.limit || 0)
			.skip(options.skip || 0)
			.toArray()

		if (typeof select === 'string') {
			return arr.map((i) => i[select])
		}

		return arr
	}

	public static async findOne<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
	): Promise<T | null>

	public static async findOne<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		select: K,
	): Promise<T[K] | null>

	public static async findOne<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		select: K[],
	): Promise<Result<T, K> | null>

	public static async findOne<T extends Collection, K extends keyof T>(
		this: StaticThis<T>,
		query: Query<T>,
		select?: K | K[],
	): Promise<T[K] | Result<T, K> | null> {
		const object = await this.collection.findOne(query, {
			projection: this.select(select),
		})

		if (!object) {
			return null
		}

		if (typeof select === 'string') {
			return object[select]
		}

		return new this(object)
	}

	public static updateOne<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
		update: Update<T>,
		options?: mongodb.ReplaceOneOptions,
	): Promise<mongodb.UpdateWriteOpResult> {
		return this.collection.updateOne(query, update, options)
	}

	public static async findOneAndUpdate<T extends Collection>(
		this: StaticThis<T>,
		query: Query<T>,
		update: Update<T>,
		options?: mongodb.FindOneAndReplaceOption,
	): Promise<T | null> {
		const result = await this.collection.findOneAndUpdate(query, update, options)
		if (!result.value) {
			return null
		}
		return new this(result.value)
	}

	public static aggregate<T extends Collection>(
		this: StaticThis<T>,
		pipeline: Array<Pipeline<T>>,
		options?: mongodb.CollectionAggregationOptions,
	): Promise<Array<{[key: string]: any}>> {
		return this.collection.aggregate(pipeline, options).toArray()
	}

	public static async aggregateOne<T extends Collection>(
		this: StaticThis<T>,
		pipeline: Array<Pipeline<T>>,
		options?: mongodb.CollectionAggregationOptions,
	): Promise<{[key: string]: any}> {
		const result = await this.collection.aggregate(pipeline, options).toArray()
		return result[0]
	}

	private static select(select: any | any[]): object {
		const obj = {}
		if (typeof select === 'string') {
			obj[select] = 1
		} else if (select instanceof Array) {
			for (const field of select) {
				obj[field] = 1
			}
		}
		return obj
	}
}
