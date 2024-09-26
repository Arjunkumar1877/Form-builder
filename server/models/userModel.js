const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    forms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form' 
    }]
}, { timestamps: true });




export const UserModel = mongoose.model('User', userSchema);