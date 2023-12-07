import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { sendVerificationEmail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';

/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/sendVerificationEmail').post(sendVerificationEmail); // send verification email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app

/** GET Methods */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/profile/:username').get(controller.getUserInfo); // user with username
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route('/verifyEmail/:userId').get(controller.verifyEmail); // reset all the variables

/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is used to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password

export default router;
