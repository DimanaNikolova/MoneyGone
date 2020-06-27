const mongoose = require('mongoose');
const Model = mongoose.model

const expenseSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Merchant is required!'],
        minlength: [4, 'Merchant must be at lease 4 characters long']
    },
    date: {
        type: String,
        required:true
    },
    total: {
         type: mongoose.SchemaTypes.Number,
        required: [true, 'Total amount is required!'],
        min: [0, 'Total should be positive number!']
    },
    category: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Category is required!']
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Description is required!'],
        maxlength: [50, 'Description is too long!'],
        minlength: [10,'Description is too short!']
    },
    report: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
        required: [true, 'Total amount is required!']
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'User'
    },
})
module.exports = new Model('Expense', expenseSchema)