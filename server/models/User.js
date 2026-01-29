import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Can be Google ID or generated for email/pass
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    isSubscribed: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    myList: [{ type: String }], // Array of movie/content IDs
    googleId: { type: String },
    picture: { type: String },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date }
});

const User = mongoose.model('User', userSchema);

export default User;
