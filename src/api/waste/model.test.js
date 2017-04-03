import { Waste } from '.'
import { User } from '../user'

let user, waste

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  waste = await Waste.create({ user, _id: 'test', name: 'test', aliases: 'test', category: 'test', badges: 'test', description: 'test', notes: 'test', image: 'test', creation_date: 'test', last_edit_date: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = waste.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(waste.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view._id).toBe(waste._id)
    expect(view.name).toBe(waste.name)
    expect(view.aliases).toBe(waste.aliases)
    expect(view.category).toBe(waste.category)
    expect(view.badges).toBe(waste.badges)
    expect(view.description).toBe(waste.description)
    expect(view.notes).toBe(waste.notes)
    expect(view.image).toBe(waste.image)
    expect(view.creation_date).toBe(waste.creation_date)
    expect(view.last_edit_date).toBe(waste.last_edit_date)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = waste.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(waste.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view._id).toBe(waste._id)
    expect(view.name).toBe(waste.name)
    expect(view.aliases).toBe(waste.aliases)
    expect(view.category).toBe(waste.category)
    expect(view.badges).toBe(waste.badges)
    expect(view.description).toBe(waste.description)
    expect(view.notes).toBe(waste.notes)
    expect(view.image).toBe(waste.image)
    expect(view.creation_date).toBe(waste.creation_date)
    expect(view.last_edit_date).toBe(waste.last_edit_date)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
