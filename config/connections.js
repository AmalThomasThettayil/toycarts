const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://toycart:amal1234@cluster0.l2ceq.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true
}).then(()=>{
    console.log('connection is Successfull')
}).catch((e)=>{
    console.log('No Connection'+e);
})
