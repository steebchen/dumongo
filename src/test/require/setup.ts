import { Project, User } from '.'
import { projects, users } from './fixtures'

export async function setFixtures() {
	await Promise.all([
		Project.removeMany({
			_id: {
				$in: projects.map((i) => i._id),
			},
		}),
		User.removeMany({
			_id: {
				$in: users.map((i) => i._id),
			},
		}),
	])

	await Promise.all([
		Project.insertMany(projects),
		User.insertMany(users),
	])
}
