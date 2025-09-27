import mongoose from 'mongoose';

export interface IUserProfile extends mongoose.Document {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    currentLevel: number;
    goals: string[];
    challenges: string[];
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
    currentLevel: {
      type: Number,
      required: [true, 'Please provide your current level assessment'],
      min: [1, 'Level must be between 1-10'],
      max: [10, 'Level must be between 1-10']
    },
    goals: [{
      type: String,
      required: true,
      maxlength: [200, 'Each goal cannot exceed 200 characters']
    }],
    challenges: [{
      type: String,
      required: true,
      maxlength: [200, 'Each challenge cannot exceed 200 characters']
    }]
  }
}, {
  timestamps: true
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);