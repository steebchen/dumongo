import { ObjectID } from 'mongodb'

export interface DefaultQuery<T> {
	$or?: Array<QueryTypes<T>>
	$nor?: Array<QueryTypes<T>>
	$and?: Array<QueryTypes<T>>

	$not?: QueryTypes<T>
}

export interface DefaultTypes<
	Type,
	Compare =
		Type extends ObjectID
			? ObjectID
			: Type extends Date
				? Date
				: Type extends number
					? number
					: Type extends string
						? string
						: void
> {
	$exists?: boolean

	$not?: DefaultTypes<Type>

	$elemMatch?: Type extends any[] ? Query<Type[0]> : void

	$gt?: Compare
	$gte?: Compare
	$lt?: Compare
	$lte?: Compare

	$in?: Type[]
	$nin?: Type[]

	$text?: {
		$search: string,
		$language?: string,
		$caseSensitive?: boolean,
		$diacriticSensitive?: boolean
	}
}

export type QueryTypes<T> = {
	[item in keyof T]?: T[item] | DefaultTypes<T[item]>
}

export type Query<T> = DefaultQuery<T> & QueryTypes<T>

export type Result<T, K extends keyof T> = {[name in K]: T[name]}
export type Sort<T> = { [item in keyof T]?: -1 | 1 }
export type Boolean<T> = { [item in keyof T]?: boolean }

export interface Update<T> {
	$set?: Query<T> | object
	$inc?: Query<T> | object
	$push?: Query<T> | object
	$addToSet?: Query<T> | object
	$pull?: Query<T> | object
	$unset?: Boolean<T>
}

export interface FindOptions<T> {
	sort?: Sort<T>
	limit?: number
	skip?: number
}

export interface Pipeline<T> {
	$match?: Query<T>
	$sort?: { [name: string]: 1 | -1 }
	$group?: object
	$project?: object
	$unwind?: string
}

export type Index<T> = {
	[item in keyof T]?: 1 | -1 | 'hashed'
}

/**
 * The values allowed in $gt or $lt queries which are often used for cursors.
 * In general, you should rely on the direct values when using $gt, this type
 * is only used when referencing the type before the actual query.
 * @example
 * const query: DefaultTypes<CursorValue> = {}
 * query.$gt = new Date()
 * await User.findOne(query)
 */
export type CursorValue = string | number | Date | ObjectID
