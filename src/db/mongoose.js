
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Connected with database');
}).catch((error)=>{
    console.log(error);
})