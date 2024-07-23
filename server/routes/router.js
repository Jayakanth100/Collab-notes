import idController from "../controllers/Identity.js" 
import {createNote, saveImage, getBlop} from "../controllers/notesData.js"
import express from 'express'
import passport from "passport"
import {checkNotAuthenticated} from "../controllers/checkAuth.js"
import multer from "multer"
const router = express.Router();
console.log("Hit api");
const upload = multer({})
router.post('/register', (req,res)=>{
    idController.register(req,res);
});
router.post('/login',
    checkNotAuthenticated,
    (req,res,next)=>{
        passport.authenticate('local',(e,user,info)=>{
            if(e)return next(e);
            if(info)return res.send(info);
            if(!user){
                req.flash('error', 'User not created. Cannot login.');
                return res.redirect('/login');
            }
            req.logIn(user,e=>{
                if(e)return nex(e);
                return res.send(user);
            });
        })(req, res, next);
    });

router.post('/noteId',createNote);
router.post('/image', saveImage);
router.get("/blop", getBlop);
export default router;
