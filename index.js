


const app=require('./app');
const port=4000;

const mongoose=require('mongoose');

mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/movieblog')
                .then(()=>{
                    console.log('Conexion a la base de datos exitosa');

                    app.listen(port,()=>{
                        console.log('Servidor corriendo correctamente en : localhost:'+port);
                    })
                    
                })
                .catch((error)=>{
                    console.log(error);
                });
                
