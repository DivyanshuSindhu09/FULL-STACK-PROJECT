import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    from_user_id : {
        type : String,
        ref : 'User',
        required: true
    },
    to_user_id : {
        type : String,
        ref : 'User',
        required: true
    },
    status:{
        type : String,
        enum : ['pending', 'accepted'],
        default: 'pending',
        required: true
    }
}, {timestamps: true});

export const Connection = mongoose.model('Connection', connectionSchema);