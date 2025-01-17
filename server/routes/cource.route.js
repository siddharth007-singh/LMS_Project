import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, createLecture, editCourse, editLecture, getCourceById, getCourceLecture, getCreatorCourses, getLectureById, getPublishedCource, publishUnpublish, removeCource, RemoveLecture } from '../controllers/cource.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route('/').post(isAuthenticated, createCourse);
router.route('/').get(isAuthenticated, getCreatorCourses);
router.route('/published-cources').get(isAuthenticated, getPublishedCource);
router.route('/:courceId').put(isAuthenticated, upload.single("courceThumbnail"), editCourse);
router.route('/:courceId').get(isAuthenticated, getCourceById);
router.route('/:courceId').delete(isAuthenticated, removeCource);
router.route('/:courceId/lecture').post(isAuthenticated, createLecture);
router.route("/:courceId/lecture").get(isAuthenticated, getCourceLecture);
router.route("/:courceId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, RemoveLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courceId").patch(isAuthenticated, publishUnpublish);





export default router;