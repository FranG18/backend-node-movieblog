
const fs=require('fs');
const path=require('path');
const User=require('../models/user');
const Movie=require('../models/movie');
const Comment=require('../models/comment');
const passport=require('passport');
const controller={
    test:(req,res)=>res.status(200).send({message:'Prueba Api'}),
    
    Signup:(req,res,next)=>{
        const {username,email,password}=req.body;
        const nuevoUsuario=new User({
            username:username,
            email:email,
            password:password,
            profile:null,
            favoritesMovies:[],
            favoritesActor:[]
        });

        User.findOne({email},(err,usuario)=>{
            if(usuario) {
                res.send('Este cuenta de email ya existe') 
            }else{
                nuevoUsuario.save((err)=>{
                    if(err) next(err);
        
                    req.logIn(nuevoUsuario,(err)=>{
                        if (err) next(err);
        
                        res.send('Usuario creado exitosamente');
                    })
                });
            }
        });
      
    },
    Login:(req,res,next)=>{
        passport.authenticate('local',(err,usuario,info)=>{
            if (err) next(err);
            if (!usuario) return res.status(400).send('Email o contraseña no validos')
            req.logIn(usuario,(err)=>{
                if (err) next(err);

                res.send('Login exitoso');
            })
        })(req,res,next);
    },
    Logout:(req,res)=>{
        req.logout();
        res.send('Logout exitoso');
    },
    addFavoriteMovie:(req,res)=>{
        const {params}=req;
        const idUser=params._iduser;
        const id=params._id;

        Movie.findOne({'idDataBase':id},(err,movie)=>{
            err && console.log(err);

            if(!movie){
                let newMovie=new Movie({
                    idDataBase:id,
                    userLiked:[
                        idUser
                    ],
                    comments:[]
                });

                newMovie.save((err)=>{
                    err && console.log(err);
                });
            }else{
                movie.userLiked=[...movie.userLiked,idUser];
                movie.save(true);
            }
        });

        User.findById(idUser,(err,user)=>{
            err && console.log(err);

            Movie.findOne({'idDataBase':id},(err,movie)=>{
                err && console.log(err);
                user.favoritesmovie=[...user.favoritesmovie,movie._id.toString()];
                user.save(true);
            });
            return res.status(200).send({message:'Like Guardado'});
        });
    },
    eraseFavoriteMovie:(req,res)=>{
        const idUser=req.params._iduser;
        const idMovie=req.params._idmovie;

        User.findById(idUser,(err,user)=>{
            if(err) return res.status(404).send({message:err});

            if(!user) return res.status(400).send({message:'El usuario no existe'});

            let lista=user.favoritesmovie;

            let i = lista.indexOf( idMovie );
            (i !== -1) && user.favoritesmovie.splice( i, 1 );

            user.save(true);

           
        });

        Movie.findById(idMovie,(err,movie)=>{
            if(err) console.log(err);
            console.log(movie);
            let lista=movie.userLiked;

            let i=lista.indexOf(idUser);
            (i!==-1) && movie.userLiked.splice(i,1);

            movie.save(true);

            return res.status(200).send({message:'Like eliminado con exito'});
        })
    },
    isLiked:(req,res)=>{
        const{_iduser,_idmovie}=req.params;

        User.findById(_iduser,(err,user)=>{
            err && console.log(err);

            const {favoritesmovie}=user;
            for(let i=0;i<favoritesmovie.length;i++){
                const movie=favoritesmovie[i];
                if(movie===_idmovie){
                    return res.status(200).send({isLiked:true});
                }
            }
            return res.status(200).send({isLiked:false});
        })
    },

    getMovie:(req,res)=>{
        const id=req.params._id;
        var nMovie;

        Movie.findOne({'idDataBase':id},(err,movie)=>{
            if(err) console.log(err);
            let newMovie;
            if(!movie) {
        
                 newMovie=new Movie({
                    idDataBase:id,
                    userLiked:[],
                    comments:[]
                });

                newMovie.save((err)=>{
                    err && console.log(err);

                    return res.status(200).send({movie:newMovie});
                });

            
            }else{
                return res.status(200).send({movie:movie});
            }
            
            
        });
    },
    getTopMovies:(req,res)=>{
        const cant=req.params._cant;

        Movie.find({},(err,movies)=>{

            let lista=[];

            for(let i=0;i<movies.length;i++){
                if(i==0){
                    lista.push(movies[i]);
                }else{
                    if(movies[i].userLiked.length>movies[i-1].userLiked.length){
                        lista=[movies[i],...lista];
                    }else{
                        lista.push(movies[i]);
                    }
                }
            }

       

            lista.splice(cant);

            return res.status(200).send({topMovies:lista});
        });

       
    },
    comment:(req,res)=>{
        const {params,body}=req;
        const {_iduser,_idmovie}=params;
        const {content}=body;

        let comment=new Comment({
            content:content,
            movie:_idmovie,
            user:_iduser
        });

        comment.save((err)=>{
            err && console.log(err);

            Movie.findById(_idmovie,(err,movie)=>{
                err && console.log(err);

                movie.comments=[...movie.comments,comment._id.toString()];
                movie.save(true);

                res.status(200).send({
                    comment:comment,
                    movie:movie
                });
            })
        });

        
    },
    getCommentsMovie:(req,res)=>{

        const {_idmovie}=req.params;

        Comment.find({'movie':_idmovie},(err,movies)=>{
            err && console.log(err);
            return (movies.length===0) ? res.status(200).send({message:'Esta pelicula no tiene comentarios'}) : res.status(200).send({movies:movies});
           
        });

    }

    
    
}



module.exports=controller;