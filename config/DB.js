const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        const db = mongoose.connection
        db.once('open', ()=>{
            console.log(`MongoDB connected`);
        })
       
    } catch(error) {
        console.log('error',error);
        process.exit(1) 
    }
}

module.exports = connectDB