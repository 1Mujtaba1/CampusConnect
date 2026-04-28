const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// --- MODELS ---

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer', 'admin'], default: 'student' },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});
const User = mongoose.model('User', userSchema);

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: String,
  time: String,
  venue: String,
  capacity: Number,
  spotsLeft: Number,
  description: String,
  image: String,
  isApproved: { type: Boolean, default: false }
});
const Event = mongoose.model('Event', eventSchema);

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', messageSchema);

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, 'SUPER_SECRET_KEY_123', (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded; 
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) { res.status(400).json({ error: "Email already exists" }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, 'SUPER_SECRET_KEY_123', { expiresIn: '1d' });
  res.json({ token, role: user.role, name: user.name, email: user.email });
});

// --- EVENT ROUTES ---

app.get('/api/events', async (req, res) => {
  const events = await Event.find({ isApproved: true }).sort({ date: 1 });
  res.json(events);
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) { res.status(404).json({ message: "Event not found" }); }
});

app.post('/api/events', authenticate, async (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ message: "Unauthorized" });
  const newEvent = new Event({ ...req.body, spotsLeft: req.body.capacity });
  await newEvent.save();
  res.status(201).json(newEvent);
});

app.delete('/api/events/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'student') return res.status(403).json({ message: "Unauthorized" });
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: "Delete failed" }); }
});

app.post('/api/events/:id/register', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    if (user.registeredEvents.includes(event._id)) {
        return res.status(400).json({ message: "Already registered" });
    }

    if (event.spotsLeft > 0) {
      event.spotsLeft -= 1;
      user.registeredEvents.push(event._id);
      await event.save();
      await user.save();
      res.json({ message: "Registered" });
    } else {
      res.status(400).json({ message: "Event Full" });
    }
  } catch (err) { res.status(500).json({ error: "Registration failed" }); }
});

// --- USER SPECIFIC ROUTES ---

app.get('/api/users/me/events', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('registeredEvents');
    res.json(user.registeredEvents);
  } catch (err) { res.status(500).json({ error: "Could not fetch events" }); }
});

// --- CONTACT ROUTES ---

app.post('/api/contact', async (req, res) => {
  try {
    const newMessage = new ContactMessage(req.body);
    await newMessage.save();
    res.status(201).json({ message: "Sent" });
  } catch (err) { res.status(500).json({ error: "Failed" }); }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/events/pending', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });
  const events = await Event.find({ isApproved: false });
  res.json(events);
});

app.get('/api/admin/messages', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

app.patch('/api/admin/events/:id/approve', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.json(updatedEvent);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 CEMS Backend running on http://localhost:${PORT}`));