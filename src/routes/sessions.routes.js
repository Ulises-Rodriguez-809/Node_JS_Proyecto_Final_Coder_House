import { Router } from 'express';
import passport from 'passport';

import { SessionControler } from '../controlador/sessions.controllers.js';

const router = Router();

// register passport
router.post("/register", passport.authenticate("register", { passReqToCallback: true, failureRedirect: "/api/sessions/failregister", session: false }), SessionControler.register);

router.get('/failregister', SessionControler.failregister);

// login passport
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin", session: false }), SessionControler.login);

router.get('/faillogin', SessionControler.faillogin);

// github passport
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/", session: false }), SessionControler.githubcallback);

// logout
router.get('/logout', SessionControler.logout);

// current passport
router.get("/current", passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/failcurret" }), SessionControler.current)

router.get('/failcurret', SessionControler.failcurret);

//recoverPass
router.post('/recoverPassword', SessionControler.revocerPassword);

// resetPass
router.post('/resetPassword', SessionControler.resetPassword);

export default router;