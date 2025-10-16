import mongoose from 'mongoose';

export interface IUserProfile extends mongoose.Document {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    questions: string[];
  };
  userId: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  // analysis caching
  analysisCache?: {
    dataHash: string; // hash of profile data
    radarScores: {
      Habits: number;
      Mindset: number;
      Relationships: number;
      Health: number;
      Creativity: number;
      Purpose: number;
      Learning: number;
    };
    threadsToWeave: string[];
    lastAnalyzed: Date;
  };
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  selfAssessment: {
    questions: [{
      type: String,
      required: false,
      maxlength: [1000, 'Each response cannot exceed 1000 characters']
    }]
  },
  analysisCache: {
    type: {
      dataHash: {
        type: String,
        required: false
      },
      radarScores: {
        type: mongoose.Schema.Types.Mixed,
        required: false
      },
      threadsToWeave: {
        type: [String],
        required: false
      },
      lastAnalyzed: {
        type: Date,
        required: false
      }
    },
    required: false,
    default: undefined
  }
}, {
  timestamps: true
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);