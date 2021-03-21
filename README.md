Run project from terminal:
npm run dev

zipcodeapi.com
Application Key: "FQi3iJfbRfEtU4BdXlZ7lcPpvz1DojTVrX0x5dl2BzR7ilRVIYjEd2CvzWhkjjwX"

Creating Microservices with Node.js
In this example, we’re going to create a microservice using Node.js which connects to an external API.

The requirement for this service is to accept two Zip Codes of two Lego stores and return the distance between them in miles.

Initial Steps
Have Node.js installed
Run npm init in the root folder for the project. This will create a package.json file that will prompt some questions about the package, if you are not sure how to answer you can use the default.
We are going to use two packages, Express and Require that can be installed like this:
$ npm install express request --save
Let’s look at the structure of the folders. There are two files and a folder created by the npm init command. These are package.json, package-lock.json, and node_modules. When we installed the express and request packages, their dependencies were downloaded and saved in node_modules.

Screen Shot 2019-08-01 at 3.54.03 PM

The primary file in our project is named server.js. And your package.json should look similar to this ☝️.

Then we create two folders, api for files that will support the API, and service for the logic to connect to a third-party API.

Screen Shot 2019-08-01 at 3.58.17 PM

Let’s build our service!

Creating a Server to Accept Requests
Create a file in the root folder for your project called server.js which will be our primary file. This file contains the code below.

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./api/routes');
routes(app);
app.listen(port, function() {
   console.log('Server started on port: ' + port);
});
This file is creating our server and assigns routes to process all requests.

We first require express into the file, and use it to create a new app object const app = express(); then we specify the port, in this case, we use the environment variable called PORT, and if the variable isn’t defined, it will use the default port: 3000.

Then we bring the routes object from the routes.js file in the api folder. We’ll pass the app to the routes object, and that sets the routes for our application. Finally, we’ll tell the app to start listening on the port we defined and to display a message to the console when this process is complete.

Defining the routes
The next step is to define the routes for the microservices and then assign each to a target in the controller object (that will control the flow of data in the application). We’ll build the controller in the next step. We’ll have two endpoints. One endpoint called “about” that returns information about the application. And a “distance” endpoint that includes two path parameters, both Zip Codes of the Lego store. This endpoint returns the distance, in miles, between these two Zip Codes.

'use strict';

const controller = require('./controller');

module.exports = function(app) {
   app.route('/about')
       .get(controller.about);
   app.route('/distance/:zipcode1/:zipcode2')
       .get(controller.getDistance);
};
The ‘use strict’ directive at the top of the file is used by new versions of Javascript to enforce secure coding practices. The first thing we’ll do is to create a controller object which we’ll define in the next step. Module.exports allows us to declare functions inside a module, and have them available for use in another file. This file constitutes the routes module, which we imported into our primary server.js file and used it to define the routes for our express app. This function adds two routes to the app. The first route listens for GET requests on the /about endpoint. These requests are handled by the about function in the controller. The second route listens for GET requests on the /distance endpoint. The getDistance function in the controller handles these requests. Two parameters are also specified. These are labeled zipcode1 and zipcode2 respectively. Let’s build the controller to handle those requests.

Adding Controller Logic
Within the controller file, we’re going to create a controller object with two properties. Those properties are the functions to handle the requests we defined in the routes module.

'use strict';

var properties = require('../package.json')
var distance = require('../service/distance');

var controllers = {
   about: function(req, res) {
       var aboutInfo = {
           name: properties.name,
           version: properties.version
       }
       res.json(aboutInfo);
   },
   getDistance: function(req, res) {
           distance.find(req, res, function(err, dist) {
               if (err)
                   res.send(err);
               res.json(dist);
           });
       },
};

module.exports = controllers;
We have two distinct parts to our controller. We’ll go through the code for the about functionality first. At the top, we create an object called properties which references the package.json file which npm created when it bootstrapped the project. This file is in JavaScript Object Notation or JSON for short. This format affords us the ability to import and use the information it contains.

Within the controllers object, we define a property called about. This property is a function which accepts request and response objects. We’ll only use the response object for this function. Using the name and version information from the package.json file, we’ll build a new object and return it as the response.

For the getDistance functionality, we’ll start by bringing in the distance module. We’ll pass the request and response objects to the find function within this module. This function also includes a callback function. This function accepts an error object (err) and a distance object (dist). If there is an error in the response, we return that with our response; otherwise, we send back the results of the find function.

Making the External Call
We’re ready for the final piece of the puzzle. This file handles the call to a third-party API. We’ll use the distance API provided by ZipCodeAPI.com. (You need an API key to use this, and it is free if you register. You can also use the key from the example if you want to test your service, but this key frequently expires during the day).

I set my key as an environment variable on my system and named it ZIPCODE_API_KEY. The default key in the code is an expired test key from the ZipCodeAPI website.

var request = require('request');

const apiKey = process.env.ZIPCODE_API_KEY || "hkCt1nW1wF1rppaEmoor7T9G4ta7R5wFSu8l1dokNz8y53gGZHDneWWVosbEYirC";
const zipCodeURL = 'https://www.zipcodeapi.com/rest/';

var distance = {
   find: function(req, res, next) {
       request(zipCodeURL + apiKey 
               + '/distance.json/' + req.params.zipcode1 + '/' 
               + req.params.zipcode2 + '/mile',
       function (error, response, body) {
           if (!error && response.statusCode == 200) {
               response = JSON.parse(body);
               res.send(response);
           } else {
               console.log(response.statusCode + response.body);
               res.send({distance: -1});
           }
       });

   }
};

module.exports = distance;
We’re using the request package to execute the external HTTP request, and we already discussed the api Key above. Ensure that you update it unless you want to start by testing the error conditions.

The find function accepts request, response and next objects as parameters. The request object accepts the URL of the service we’re calling and then defines a callback function to handle the response.

If there are no errors, and the status of the response is HTTP Status code 200, then the function parses out the body of the response into an object called response and returns it on the resp object. Since the ZipCodeAPI returns with a JSON response, we could forward this directly. Parsing it out allows us the option of doing more with the response if we choose to.

We log failures to the console, and then a result of -1 is sent on the response object. You may opt to create an error object to return as well.

Finally, we export the distance object, which allows the controller to instantiate it and call its functions as needed.

Execution
Assuming there aren’t any typos, your application should be ready to execute. Open a console window and run the following command:

npm start
Assuming it starts correctly, and the port you define is 3000, you can now open your browser and navigate to:

http://localhost:3000/about when you will see the name of the app and the version.

Screen Shot 2019-08-01 at 7.17.37 PM

Now if you add two parameters, the two zip codes, you will see something like this:

http://localhost:3000/distance/84010/97229

Screen Shot 2019-08-01 at 7.18.55 PM

And that’s it! Using microservices to know the distance between two zip codes!

Conclusion
In microservices, every single service is independently deployable, scalable and updatable, this is what makes microservices such an appealing architectural approach to the industry.

A microservice is loosely coupled and interacts with other microservices for well-defined interfaces using protocols like http, they remain consistent and available in the presence of failure, meaning even if the machine goes down that host a microservice, the functionality provided by the service should still be offered by the application.

While microservices are great, there is quite some work involved to build a scalable microservice application on a platform as you need to consider things like cluster management, service orchestration, inter-service communication and so on, and you also need to put a lot of effort into following DevOpsbest practices.

Not to mention that microservices can also require increased testing complexity and possibly increased memory/computing resources. Thus, despite the abundant potential benefits, those knowledgeable in the field caution that microservices are not automatically the right solution for every project.

https://nodesource.com/blog/microservices-in-nodejs
