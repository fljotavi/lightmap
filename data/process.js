'use strict';


var http = require('http');
var fs = require('fs');
var before = undefined;

var server = http.createServer(function (request, response) {
    console.log("- DETECTED REQUEST -")

    if (request.method == 'POST') {

        request.addListener("data", function(postDataChunk) {
            var postData = JSON.parse(postDataChunk.toString());
            var coord1 = postData[0];
            var coord2 = postData[1];
            fs.readFile('dataSeries.json', 'utf-8', function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    before = JSON.parse(data);
                    before.push([coord1, coord2]);
                    var after = JSON.stringify(before);
                    fs.writeFile('dataSeries.json', after, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Pushed.")
                        }
                    });
                }
            });
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end('Map Lighten Up');
        });
    }

    response.end('END');
});

server.listen(8080);
