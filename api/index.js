
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Server listener
const PORT = process.env.PORT || 4000;


  app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        if (existingUser.isGoogleUser) {
          return res.status(400).json({
            message: 'This email is already registered via Google. Please log in with Google.',
          });
        } else {
          return res.status(400).json({
            message: 'This email is already registered. Please log in.',
          });
        }
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const user = new User({ username, email, password: hashedPassword, isGoogleUser: false });
      await user.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (error) {
      console.error("❌ Error during registration:", error);
      res.status(500).json({ message: 'Registration failed', error });
    }
  });
  

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign({ username: user.username, email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    })
    .json({id:user._id,
      username:user.username,
      message: 'Login successful' });
});



app.get('/profile', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      latestDietPlan: user.latestDietPlan,
      age: user.age || '',
      height: user.height || '',
      weight: user.weight || '',
      gender: user.gender || 'female',
      fitnessGoal: user.fitnessGoal || '',
      dietaryPreferences: user.dietaryPreferences || '', 
    });
  });
});



app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production', // ✅ dynamic based on environment
  });
  

  res.json({ message: 'Logged out successfully' });
  
  
});

app.delete('/delete-diet-plan/:planId', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const planId = req.params.planId;

    // Remove the plan with matching _id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { dietPlans: { _id: planId } } },
      { new: true }
    );

    res.json({ message: 'Plan deleted successfully', plans: updatedUser.dietPlans });
  } catch (err) {
    console.error("❌ Error deleting plan:", err);
    res.status(500).json({ message: 'Failed to delete plan' });
  }
});



app.post('/createDietPlan', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // ✅ Save the diet plan in user's latestDietPlan field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { latestDietPlan: req.body },
      { new: true }
    );

    console.log("✅ Latest diet plan saved to user:", updatedUser._id);
    res.status(200).json({ message: "Diet plan saved", latestDietPlan: updatedUser.latestDietPlan });
  } catch (error) {
    console.error("❌ Failed to save diet plan:", error);
    res.status(500).json({ message: "Error saving diet plan", error });
  }
});

app.get('/latestDietPlan', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.latestDietPlan) {
      return res.status(404).json({ message: "No diet plan found" });
    }

    res.status(200).json(user.latestDietPlan);
  } catch (error) {
    console.error("❌ Error fetching diet plan:", error);
    res.status(500).json({ message: "Error fetching diet plan" });
  }
});

app.post('/google-login', async (req, res) => {
  const { email, username } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        username,
        password: 'google-auth', // still a placeholder
        isGoogleUser: true
      });
    }
    
    

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
    

    // ✅ Immediately fetch full user profile
    const freshUser = await User.findById(user._id);

    res.json({
      username: freshUser.username,
      email: freshUser.email,
      latestDietPlan: freshUser.latestDietPlan || null,
      age: freshUser.age || '',
      height: freshUser.height || '',
      weight: freshUser.weight || '',
      gender: freshUser.gender || 'female',
      fitnessGoal: freshUser.fitnessGoal || '',
      dietaryPreferences: freshUser.dietaryPreferences || '',
    });

  } catch (err) {
    console.error('Google Login Failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/update-profile', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email; // ✅ Use email from token

    const updates = {
      age: req.body.age,
      height: req.body.height,
      weight: req.body.weight,
      gender: req.body.gender,
      fitnessGoal: req.body.fitnessGoal,
      dietaryPreferences: req.body.dietaryPreferences,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },     // ✅ Find by email
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      gender: updatedUser.gender,
      fitnessGoal: updatedUser.fitnessGoal,
      dietaryPreferences: updatedUser.dietaryPreferences,
    });

  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

app.post('/publish-diet-plan', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { title, goal, description, data } = req.body;

    const newPlan = {
      title,
      goal,
      description,
      data,
      date: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { dietPlans: newPlan } }, // this is critical
      { new: true }                      // ensures we get updated user back
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Plan published successfully', plans: updatedUser.dietPlans });
  } catch (err) {
    console.error("❌ Error saving plan:", err);
    res.status(500).json({ message: 'Failed to save plan' });
  }
});

app.get('/my-diet-plans', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json(user.dietPlans || []);
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    res.status(500).json({ message: 'Failed to load plans' });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});