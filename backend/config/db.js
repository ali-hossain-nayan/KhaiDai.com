import mongoose from "mongoose";
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://aliNayan:01690205129@cluster0.rzcnd.mongodb.net/khaiDai').then(() => {
        console.log('DB Connected Successfully...')
    })
}