const mongoose=require('mongoose');

var Schema=mongoose.Schema;

var MovieSchema=Schema({
    idDataBase:Number,
    userLiked:[
        
    ],
    comments:[

    ]
});

module.exports=mongoose.model('Movie',MovieSchema);

