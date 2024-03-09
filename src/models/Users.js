const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({

    User_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        trim: true,
    },
    UserName: {
        type: String,
        required: true,
    },
    email_id:{
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    Phone_no: {
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    current_Balance: {
        type: Number,
        default: 100000,
        required: true
    },
    account_status:{
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
},{
    timestamps : true,
    collection: 'Users'
})


module.exports = mongoose.model('Users', UserModel)