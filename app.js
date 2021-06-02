const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const PORT = 9229;
const postsRouter = require('./routes');
app.use('/posts', postsRouter);
app.listen(PORT, async () => {
    await mongoose.connect('mongodb://localhost:27017/brand-total',{useNewUrlParser: true});
    console.log('server listenning on http://localhost:' + PORT);
});