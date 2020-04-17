const passport=require('passport');
const User=require('../models/user');
const localStrategy=require('passport-local').Strategy;

passport.serializeUser((usuario,done)=>{
    done(null,usuario._id);

});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,usuario)=>{
        done(err,usuario);
    });
});

passport.use(new localStrategy(
    {usernameField:'email'},
    (email,password,done)=>{
        User.findOne({email},(err,usuario)=>{
            if(!usuario){
                return done(null,false,{message:`Este email ${email} no esta registado`});
            }else{
                usuario.compararPassword(password,(err,sonIguales)=>{
                    (sonIguales) ? done(null,usuario) : done(null,false,{message:'La contraseña no es valida'})
                });
            }
        });
    }
));

exports.estaAutenticado=(req,res,next)=>{
    (req.isAuthenticated()) ? next() : res.status(401).send('Tienes que hacer login para acceder a este recurso')
}