const express    = require("express");
const formidable = require("express-formidable");
const request    = require("request");
const PORT       = process.env.PORT || 8080;
const btoa       = require('btoa'); // use this for basic authentication
const https      = require('https');

const app = express();

app.use(formidable());
app.use(express.static(__dirname + '/../client/'));

// when we receive an http post request
app.post('/makeCall/', function(req, res) {
  console.log(req.fields);

  jsonObject = JSON.stringify({
      "phoneMeNumber"     : req.fields.src,
      "destinationNumber" : req.fields.dst,
  });

  // prepare the header
  let postHeaders = {
    'Content-Type' : 'application/json',
    "Authorization": "Basic " + btoa(process.env.PLIVO_AUTH_ID,process.env.PLIVO_AUTH_TOKEN),
  };

  // set the post options
  let postOptions = {
    port   : 443,
    host   : 'phlo-runner-service.plivo.com',
    path   : '/account/MAMMJLN2YWZJFMMME5YZ/phlo/cc636f87-4212-46a9-b7a6-fc540aed1a8e', // our PHLO endpoint
    method : 'POST',
    headers: postHeaders,
  };

  console.info('Options prepared:');
  console.info(postOptions);
  console.info('Do the POST call');

  // do the POST request
  let reqPost = https.request(postOptions, function(response) {
    console.log("statusCode: ", response.statusCode);
    response.on('data', function(d) {
      console.info('POST result:\n');
      process.stdout.write(d);
      console.info('\n\nPOST completed');
      res.send(d);
    });
  });

  // write the json data
  console.log(jsonObject);
  reqPost.write(jsonObject);
  reqPost.end();
  reqPost.on('error', function(e) {  // log any errors
    console.error(e);
  });
})

app.listen(PORT, function() {
  console.log("listening on port", PORT);
});
