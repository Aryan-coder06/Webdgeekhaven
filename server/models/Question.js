import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    yt_link: { type: String, trim: true },
    p1_link: { type: String, trim: true },
    p2_link: { type: String, trim: true },
  }, // Made optional by removing 'required: true'
  tags: [String]
});

export default mongoose.model('Question', questionSchema);