import { MongoClient } from 'mongodb'
import { Project, User } from '.'

export class DB {
	private static connection: MongoClient

	public static async connect() {
		this.connection = await MongoClient.connect('mongodb://mongo:27017', { useNewUrlParser: true })

		const db = this.connection.db('test')

		User.init(db, 'users')
		Project.init(db, 'projects')

		await this.setIndexes()
	}

	public static async setIndexes() {
		await User.createIndex({
			created: 1,
		})

		await Project.createIndex({
			created: 1,
		})
	}

	public static async disconnect() {
		await this.connection.close()
	}
}
