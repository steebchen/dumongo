import { ObjectID } from 'mongodb'
import { Collection } from '../../..'

export class Project extends Collection {
	public name: string
	public created: Date
	public user: ObjectID
}
