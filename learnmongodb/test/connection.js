const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost/testaroo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// create a db called testaroo

// 'once' is the evenlistener,
mongoose.connection
  .once('open', () => {
    console.log('Connection has been made, now make the fireworks...');
  })
  .on('error', (error) => {
    console.log('error', error);
  });
