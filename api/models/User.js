import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  isGoogleUser: { type: Boolean, default: false },
  dietPlans: [
    {
      title: String,
      goal: String,
      description: String,
      date: Date,
      data: mongoose.Schema.Types.Mixed,
    },
  ],
  
  
  latestDietPlan: {
    type: mongoose.Schema.Types.Mixed, 
    default: null,
  },
  age: Number,
  height: Number,
  weight: Number,
  gender: { type: String, enum: ['male', 'female'] },
  fitnessGoal: String,
  dietaryPreferences: String,
  
});

export const User = mongoose.model('User', userSchema);
