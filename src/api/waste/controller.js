import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Waste } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Waste.create({ ...body, user })
    .then((waste) => waste.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Waste.find(query, select, cursor)
    .populate('user')
    .then((wastes) => wastes.map((waste) => waste.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Waste.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((waste) => waste ? waste.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Waste.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((waste) => waste ? _.merge(waste, body).save() : null)
    .then((waste) => waste ? waste.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Waste.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((waste) => waste ? waste.remove() : null)
    .then(success(res, 204))
    .catch(next)
