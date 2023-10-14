import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

export const PostSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },

    altitudes: [Number],
        
    rating: {
        type: Number,
        required: true,
        min: 0, // Minimum rating value (0 or greater)
        max: 5   // Maximum rating value (5 or less)
    },

    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{
        comment:{type: String},
        postedBy: { type: ObjectId, ref: "User" }
    }],
    
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
}, { timestamps: true });


export default mongoose.model.Posts || mongoose.model('Post', PostSchema);
