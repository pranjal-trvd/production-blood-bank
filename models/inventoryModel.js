const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, "inventory type is required"],
        enum: ['in', 'out'],
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood Group is required"],
        enum: ['O+', 'O-', 'AB+', 'AB-', 'A+', 'A-', 'B+', 'B-'],
    },
    quantity: {
        type: Number,
        required: [true, "Blood Quantity is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Organisation is required"],
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === 'out';
        }
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function (){
            return this.inventoryType === 'in';
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('Inventory', inventorySchema);