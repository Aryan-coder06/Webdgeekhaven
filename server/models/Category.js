import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
});

export default mongoose.model('Category', categorySchema);