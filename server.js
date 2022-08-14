//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/benhvien'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/benhvien/index.html'}),
);

// Start the app by listening on the default Heroku port
app.listen((process.env.PORT || 3000), function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });