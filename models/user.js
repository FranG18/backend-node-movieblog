const bycript=require('bcrypt-nodejs');
const mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=Schema({
    username:String,
    email:String,
    password:String,
    profile:String,
    favoritesmovie:Array,
    favoritesactor:Array,
},{
    timestap:true
});

UserSchema.pre('save',function(next){
    const usuario=this;
    if(!usuario.isModified('password')){
        return next();
    }

    bycript.genSalt(10,(err,salt)=>{
        if(err) next(err);
        bycript.hash(usuario.password,salt,null,(err,hash)=>{
             if(err) next(err);

             usuario.password=hash;
             next();
        })
    });
});

UserSchema.methods.compararPassword=function(password,cb){
    bycript.compare(password,this.password,(err,sonIguales)=>{
        if(err) return cb(err);
        
        cb(null,sonIguales);
    });
}

module.exports=mongoose.model('User',UserSchema);

