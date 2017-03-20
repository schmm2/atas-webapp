const express = require('express');
const port = process.env.PORT || 8080
const path = require("path");
var app = express();

app.use(express.static(__dirname + "/src/build"));

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'src/build', 'index.html'))
})

app.listen(port, function () {
    console.log('trainDashboard-ui started on port '+ port);
});