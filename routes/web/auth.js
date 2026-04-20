import express from 'express';
import * as webAuthController from '../../controllers/web/authController.js';
import registerRules from '../../middleware/validation/registerRules.js';
import guest from '../../middleware/guest.js';

const router = express.Router();
router.get('/register', guest, webAuthController.renderRegister);
router.post('/register', registerRules, webAuthController.postRegister);
router.get('/login', guest, webAuthController.renderLogin);
router.post('/login', webAuthController.postLogin);
router.post('/logout', webAuthController.logout);

export default router;
