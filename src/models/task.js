const mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Must provide the name of Task'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
  },
  { timestamps: true }
);


const taskModel = mongoose.model('Task', taskSchema);
module.exports = taskModel;