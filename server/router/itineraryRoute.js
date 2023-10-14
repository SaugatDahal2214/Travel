import { Router } from "express";
const router = Router()
import * as itineraryController from '../controllers/itineraryController.js'
import Auth from '../middleware/auth.js'

/**POST ROUTE */
router.route('/items').post(Auth, itineraryController.postItem)
/**GET ROUTE */
router.route('/items').get(Auth, itineraryController.getItem)
/*DELETE ROUTE*/
router.route('/deleteItem').delete(Auth, itineraryController.deleteItem)

export default router