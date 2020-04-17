
const express=require('express');
const Controller=require('../controllers/controller');
const passport=require('../config/passport');
const router=express.Router();

const multipart=require('connect-multiparty');
const multipartMiddleware=multipart({uploadDir:'./uploads'});

router.get('/test',Controller.test);
router.get('/logout',passport.estaAutenticado,Controller.Logout);
router.get('/movie/:_id',Controller.getMovie);
router.get('/topmovies/:_cant',Controller.getTopMovies);
router.get('/isliked/:_iduser/:_idmovie',passport.estaAutenticado,Controller.isLiked);
router.get('/comment/:_idmovie',passport.estaAutenticado,Controller.getCommentsMovie);
router.post('/signup',Controller.Signup);
router.post('/login',Controller.Login);
router.post('/addfavorite/:_id/:_iduser',passport.estaAutenticado,Controller.addFavoriteMovie);
router.post('/erasefavorite/:_idmovie/:_iduser',passport.estaAutenticado,Controller.eraseFavoriteMovie);
router.post('/comment/:_idmovie/:_iduser',passport.estaAutenticado,Controller.comment);
module.exports=router;