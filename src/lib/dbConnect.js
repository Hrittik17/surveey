import mongoose from "mongoose";

export async function connectDatabase(){
    try {
        await mongoose.connect(process.env.MONGO_URL);

        mongoose.connection.once('open',()=>{
            console.log('Mongoose connection is ready');
        })

        mongoose.connection.on('connected',()=>{
            console.log('Mongodb connected successfully.');
        })

        mongoose.connection.on('error',(error)=>{
            console.error(error);
            process.exit(1);
        })

    } catch (error) {
        console.error('Something went wrong while connecting to the database');
        console.error(error.message);
        
    }
}