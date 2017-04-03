import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Waste } from '.'

const app = () => express(routes)

let userSession, anotherSession, waste

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  waste = await Waste.create({ user })
})

test('POST /wastes 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, _id: 'test', name: 'test', aliases: 'test', category: 'test', badges: 'test', description: 'test', notes: 'test', image: 'test', creation_date: 'test', last_edit_date: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body._id).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.aliases).toEqual('test')
  expect(body.category).toEqual('test')
  expect(body.badges).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.notes).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.creation_date).toEqual('test')
  expect(body.last_edit_date).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /wastes 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /wastes 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /wastes/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${waste.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(waste.id)
})

test('GET /wastes/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /wastes/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${waste.id}`)
    .send({ access_token: userSession, _id: 'test', name: 'test', aliases: 'test', category: 'test', badges: 'test', description: 'test', notes: 'test', image: 'test', creation_date: 'test', last_edit_date: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(waste.id)
  expect(body._id).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.aliases).toEqual('test')
  expect(body.category).toEqual('test')
  expect(body.badges).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.notes).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.creation_date).toEqual('test')
  expect(body.last_edit_date).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /wastes/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${waste.id}`)
    .send({ access_token: anotherSession, _id: 'test', name: 'test', aliases: 'test', category: 'test', badges: 'test', description: 'test', notes: 'test', image: 'test', creation_date: 'test', last_edit_date: 'test' })
  expect(status).toBe(401)
})

test('PUT /wastes/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${waste.id}`)
  expect(status).toBe(401)
})

test('PUT /wastes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, _id: 'test', name: 'test', aliases: 'test', category: 'test', badges: 'test', description: 'test', notes: 'test', image: 'test', creation_date: 'test', last_edit_date: 'test' })
  expect(status).toBe(404)
})

test('DELETE /wastes/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${waste.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /wastes/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${waste.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /wastes/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${waste.id}`)
  expect(status).toBe(401)
})

test('DELETE /wastes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
