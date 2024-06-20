import idController from "../controllers/Identity.js" 
import express from 'express'
const router = express.Router();

router.get('/clientId', idController.getClientId);
router.get('noteId', idController.getNoteId);
export default router;
