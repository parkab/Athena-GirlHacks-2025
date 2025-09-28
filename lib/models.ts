import mongoose from 'mongoose';

export interface IUserProfile extends mongoose.Document {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    questions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: [true, 'Please provide your life purpose'],
    maxlength: [1000, 'Purpose cannot exceed 1000 characters']
  },
  vision: {
    type: String,
    required: [true, 'Please provide your life vision'],
    maxlength: [1000, 'Vision cannot exceed 1000 characters']
  },
  values: [{
    type: String,
    required: true,
    maxlength: [100, 'Each value cannot exceed 100 characters']
  }],
  selfAssessment: {
    questions: [{
      type: String,
      required: true,
      maxlength: [1000, 'Each response cannot exceed 1000 characters']
    }]
  }
}, {
  timestamps: true
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);