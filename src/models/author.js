const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authorSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  username: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  registeredDate: { type: Number },
  status: { type: String, default: 'not approved' },
  displayName: { type: String },
  tokens: [{ token: { type: String } }],
});

authorSchema.methods.generateAuthToken = async function () {
  const user = this;
  const { SECRET_CODE } = process.env;
  const options = { _id: user._id.toString() };
  const token = jwt.sign(options, SECRET_CODE, { expiresIn: '7 days' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

authorSchema.pre('save', async function (next) {
  const author = this;
  if (author.isModified('password')) {
    author.password = await bcrypt.hash(author.password, 8);
  }
  next();
});

authorSchema.statics.findByCredentials = async function (username, password) {
  const author = await Author.findOne({ username });
  if (!author) throw new Error('Unable to login');
  const isMatch = await bcrypt.compare(password, author.password);
  if (!isMatch) throw new Error('Unable to login');
  return author;
};

authorSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

const Author = mongoose.model('Author', authorSchema);
module.exports = { Author };
