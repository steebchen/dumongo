import { DB } from './require'

if (process.env.NODE_ENV === 'production') {
	throw new Error('tests are not allowed to run in production environments')
}

before('connect DB', async function () {
	this.timeout(40000)
	await DB.connect()
})

after('disconnect db', async function () {
	this.timeout(10000)
	await DB.disconnect()
})
