export interface DefaultQuery<T> {
	$or?: Array<QueryTypes<T>>
	$nor?: Array<QueryTypes<T>>
	$and?: Array<QueryTypes<T>>

	$not?: QueryTypes<T>
}

export interface DefaultTypes<Type> {
	$exists?: boolean

	$not?: DefaultTypes<Type>

	$elemMatch?: object

	$gt?: number | Date
	$gte?: number | Date
	$lt?: number | Date
	$lte?: number | Date

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
