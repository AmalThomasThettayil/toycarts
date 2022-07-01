const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://toycart:amal1234@cluster0.l2ceq.mongodb.net/toycart",{
    useNewUrlParser:true
}).then(()=>{
    console.log('connection Successfull')
}).catch((e)=>{
    console.log('No Connection'+e);
})
// mongodb://127.0.0.1:27017/toycart