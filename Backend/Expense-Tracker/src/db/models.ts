// Mongodb collection schemas all in one place

import { Schema, model, Types } from 'mongoose';
import { emailValidator } from '../utils/email';


// USER Schema/Collection
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidator,
            message: (props: { value: String }) => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export const User = model('User', userSchema);



//
