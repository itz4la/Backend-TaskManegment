const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'name is required']
    },
    description: {
        type: String,
        require: [false]
    },
    completed: {
        type: Boolean, default : false
    },
}, {
    timestamps: true,
})


module.exports = mongoose.model('Project', projectSchema)