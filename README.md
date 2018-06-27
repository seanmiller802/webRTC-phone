# Plivo webRTC phone
Simple softphone made with Plivo's webRTC browser SDK. Calls can be made to PSTN numbers and SIP addresses.

Two ways to make a call

1. Call via the browser (uses <a href="http://opus-codec.org/" target="_blank">OPUS Codec</a>)
2. Click-to-call

     User enters their phone number in the settings. When a call is placed, the user's handset will be called first and then        the call will be connected to the destination # 

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/32422458/40951940-18cd6908-682e-11e8-8e13-787de45b1a90.gif)

## Deploying the application
```

git clone https://github.com/seanmiller802/webRTC-phone.git

cd webRTC-phone

npm install 

npm run start

```

## Application setup
Some initial setup is required before using this application (< 10 minutes). Let's get started!

1. Register for a Plivo account here <a href="https://console.plivo.com/accounts/register/">https://console.plivo.com/accounts/register/</a> 

2. Create a PHLO. This will handle all of the call logic behind the scenes once a call is initiated.  

See _Creating a PHLO_ below
     
3. Create a new Plivo application and assign it to our PHLO.
  
  ![ezgif com-video-to-gif 4](https://user-images.githubusercontent.com/32422458/40952267-71e27078-682f-11e8-8c9b-8f113ed0f76d.gif)
  
4. Create a new Plivo endpoint and assign it to the application created in Step 3. (_Note: your endpoint username and password will be used for signing in_)

 ![ezgif com-video-to-gif 5](https://user-images.githubusercontent.com/32422458/40952362-d756d872-682f-11e8-9fa7-a3f83e8e140b.gif)
  
5. Purchase a new Plivo phone number and assign this to our application.

![ezgif com-video-to-gif 3](https://user-images.githubusercontent.com/32422458/40952112-e41bed8c-682e-11e8-9108-b09d788d0a2a.gif)

## Creating a PHLO
PHLO stands for Plivo High Level Objects. This product was built with the goal of reducing Voice and SMS application development time from weeks to minutes. The drag & drop UI allows both developers and non-technical people to quickly build and test apps without writing any code or managing a server. _In the future this product will have full parity with our developer APIs._

### How this PHLO works:

Every PHLO begins with a _start node_ that can be triggered by an HTTP request or an incoming call (incoming SMS if it is an SMS PHLO). Since our phone can make calls in more than one way, we'll utilize both trigger events here. 

Let's start with an incoming call. 

When the phone is configured to make calls from the browser, all we have to do is use the browser SDK's call() method to initiate a call from our application endpoint to our destination #. In this case our PHLO is the endpoint, so our outbound call is actually treated as an _inbound_ call to our PHLO. Once we hit the endpoint we just forward the call to our destination number.

our code should look like this:
```
  const customCallerId = 14154830302;
  const extraHeaders = {'X-PH-Test1': 'test1', 'X-PH-callerId': customCallerId};
  this.plivoBrowserSdk.client.call(dest, extraHeaders);
```

Now for the click-to-call. This is is a slightly more complicated use case because it requires us to actually send an HTTP request with a payload to our PHLO endpoint. Remember that we will be making a call to our user's handset first, and then connecting to the destination once the first call is answered. We'll need to get both phone numbers from our application and send it to our server. Our code should look something like this:

```
let XMLReq = new XMLHttpRequest();
XMLReq.open("POST", "/makeCall");
XMLReq.setRequestHeader("Content-Type", "application/json");
XMLReq.onreadystatechange = function() {
     console.log('response text', XMLReq.responseText);
}
XMLReq.send(JSON.stringify({"src": this.state.phoneMeNumber, "dst": dest}));
```

We'll need to listen for this request on our server. Once we receive this request and get the numbers from the payload, we will set up another HTTP request that sends this data to our PHLO. Here's our code: 

```
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
    "Authorization": "Basic " + btoa("AuthID:AuthToken")
  };

  // set the post options
  let postOptions = {
    port   : 443,
    host   : 'phlo-runner-service.plivo.com',
    path   : '/account/MAMMJLN2YWZJFMMME5YZ/phlo/cc636f87-4212-46a9-b7a6-fc540aed1a8e', // our PHLO endpoint
    method : 'POST',
    headers: postHeaders,
  };

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
```

We should now have access to both numbers when our PHLO receives the HTTP request. We can use these numbers to control our call. Refer to the two GIFs below to see how to create a new PHLO and set up our call flows.


![ezgif com-video-to-gif 7](https://user-images.githubusercontent.com/32422458/40958848-9c68188c-684f-11e8-9fc7-ac5baf791d6e.gif)


![ezgif com-video-to-gif 6](https://user-images.githubusercontent.com/32422458/40958398-fb10c516-684d-11e8-9bf4-38e3708121d7.gif)


## Basic Authentication
You will need to provide your Plivo Auth ID and Auth Token in /server/index.js in the HTTP request headers. Store these as environment variable
```
  let postHeaders = {
    'Content-Type' : 'application/json',
    "Authorization": "Basic " + btoa("process.env.AuthID:process.env.AuthToken")
  };
  
```

## Features

* Make calls (Browser, Click-to-call)
* Receive calls
* Log calls
* Live call quality metrics (displayed in real time during network events during the call)
* Send feedback to Plivo

## Built With

* [React](https://reactjs.org/) - Javascript framework for building UIs
* [Material-UI](https://material-ui.com/) - React components that implement Google's material design standards
* [Plivo](https://www.plivo.com/) - Making and receiving calls

## Authors

* **Sean Miller** - *Initial work* - [seanmiller802](https://github.com/)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

## Acknowledgments

* Joe Leaver - *Mentor* - [joeleaver](https://github.com/joeleaver)
* The entire team at Plivo, Inc. 


