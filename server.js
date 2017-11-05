const express = require('express');
const port = process.env.PORT || 8001
const path = require("path");
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var BUILD_DIR = path.join(__dirname, "build")


app.use(express.static(BUILD_DIR));

app.get('*', function (request, response){
    response.sendFile(path.join(BUILD_DIR, "index.html"));
})

app.listen(port, function () {
    console.log('atas-web started on port '+ port);
});
