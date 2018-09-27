import { ObjectID } from 'mongodb'
import { User } from '..'

export const user1 = new ObjectID('5b9fc24b4a04397815bd258e')

export const users: User[] = [{
	_id: user1,
	created: new Date('2018-09-11T14:32:04.530Z'),
	name: 'John Doe',
}]
