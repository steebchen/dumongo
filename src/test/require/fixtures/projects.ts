import { ObjectID } from 'mongodb'
import { Project } from '..'
import { user1 } from './users'

export const project1 = new ObjectID('5b9fad25c512104c9c1212b2')

export const projects: Project[] = [{
	_id: new ObjectID('5b9fad25c512104c9c1212b2'),
	created: new Date('2018-09-12T14:32:12.141Z'),
	name: 'My first project',
	user: user1,
}, {
	_id: new ObjectID('5b9faed8c512104c9c1212b3'),
	created: new Date('2018-09-13T14:32:19.638Z'),
	name: 'My second project',
	user: user1,
}, {
	_id: new ObjectID('5b9faef0c512104c9c1212b4'),
	created: new Date('2018-09-15T14:32:19.638Z'),
	name: 'Another project',
	user: user1,
}]
