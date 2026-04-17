import express from 'express';
import * as webAuthController from '../controllers/web/authController.js';
import registerRules from '../middleware/validation/registerRules.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.get('/register', webAuthController.renderRegister);
router.post('/register', registerRules, validate(), webAuthController.postRegister);
router.get('/login', webAuthController.renderLogin);
router.post('/login', webAuthController.postLogin);
router.post('/logout', webAuthController.logout);

export default router;
