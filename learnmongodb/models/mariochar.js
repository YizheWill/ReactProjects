const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarioCharSchema = new Schema({
  name: String,
  weight: Number,
});

export default MarioChar = mongoose.model('mariochar', MarioCharSchema);
