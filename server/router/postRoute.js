import { Router } from "express";
const router = Router();
import * as postController from '../controllers/postController.js';
import Auth from '../middleware/auth.js';
import multer from "multer";

const upload = multer ({ dest: 'uploads/' })

/** POST */
router.route('/post').post(Auth, upload.single('image'), postController.createPost)


/** GET */
router.route('/allpost').get(Auth,   postController.allPost)
router.route('/getsubpost').get(Auth,postController.getSubPost)
router.route('/mypost').get(Auth,postController.allPost)
router.route('/averageRating/:location').get(Auth, postController.calculateAverageRating);
router.route('/averageRatings').get(Auth, postController.calculateAverageRatingForAllLocations);
router.route('/postsByLocation/:location').get(Auth, postController.getPostsByLocation);




/**PUT */
router.route('/like').put(Auth, postController.likePost)
router.route('/unlike').put(Auth, postController.unlikePost)
router.route('/comment').put(Auth, postController.commentPost)
router.route('/follow').put(Auth, postController.follow)
router.route('/unfollow').put(Auth, postController.unfollow)


/**DELETE */
router.route('/deletepost/:postId').delete(Auth, postController.deletePost)


export default router;