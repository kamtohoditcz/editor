import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Waste, { schema } from './model'

const router = new Router()
const { _id, name, aliases, category, badges, description, notes, image, creation_date, last_edit_date } = schema.tree

/**
 * @api {post} /wastes Create waste
 * @apiName CreateWaste
 * @apiGroup Waste
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam _id Waste's _id.
 * @apiParam name Waste's name.
 * @apiParam aliases Waste's aliases.
 * @apiParam category Waste's category.
 * @apiParam badges Waste's badges.
 * @apiParam description Waste's description.
 * @apiParam notes Waste's notes.
 * @apiParam image Waste's image.
 * @apiParam creation_date Waste's creation_date.
 * @apiParam last_edit_date Waste's last_edit_date.
 * @apiSuccess {Object} waste Waste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Waste not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ _id, name, aliases, category, badges, description, notes, image, creation_date, last_edit_date }),
  create)

/**
 * @api {get} /wastes Retrieve wastes
 * @apiName RetrieveWastes
 * @apiGroup Waste
 * @apiUse listParams
 * @apiSuccess {Object[]} wastes List of wastes.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /wastes/:id Retrieve waste
 * @apiName RetrieveWaste
 * @apiGroup Waste
 * @apiSuccess {Object} waste Waste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Waste not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /wastes/:id Update waste
 * @apiName UpdateWaste
 * @apiGroup Waste
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam _id Waste's _id.
 * @apiParam name Waste's name.
 * @apiParam aliases Waste's aliases.
 * @apiParam category Waste's category.
 * @apiParam badges Waste's badges.
 * @apiParam description Waste's description.
 * @apiParam notes Waste's notes.
 * @apiParam image Waste's image.
 * @apiParam creation_date Waste's creation_date.
 * @apiParam last_edit_date Waste's last_edit_date.
 * @apiSuccess {Object} waste Waste's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Waste not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ _id, name, aliases, category, badges, description, notes, image, creation_date, last_edit_date }),
  update)

/**
 * @api {delete} /wastes/:id Delete waste
 * @apiName DeleteWaste
 * @apiGroup Waste
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Waste not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
