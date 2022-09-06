const express = require("express")
const bodyParser = require("body-parser")
const https = require("node:https")
const request = require("request");
const { Http2ServerRequest } = require("node:http2");
const app = express();
const port = 3005;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// this is used to pass static documents like css and images to the local host.
app.get("/" , (req,res)=>{
    res.sendFile("index.html",{root:__dirname});
});

app.post("/",(req,res)=>{
    const firstName=req.body.fName
    const lastName=req.body.lName
    const email=req.body.Email

    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/d5e41958c4"
    const options = {
        method: "POST",
        auth: "rahul:3ded65ceaae0e7a952360e4c0dd8516b-us10"
    }
    const request = https.request(url,options,(response)=>{
        if(response.statusCode === 200){
            res.sendFile("success.html",{root:__dirname})

        }
        else{
            res.sendFile("failure.html",{root:__dirname})

        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    
    

});

// there is another http function called https.request which not only takes url and function but also takes option. what this option does is that it has a component called method which specifies the http request method . the default is get but if we want to post stuff in an external server then we can change it to post 

// api key for mailchimp --> 3ded65ceaae0e7a952360e4c0dd8516b-us10
// audience id for mailchimp --> d5e41958c4

// for running it on heroku ... we need to change the port to process.env.PORT --> this is the dynamic port. || tells to listen to port when we are running it in the local host.

// Then we need to create a procfile.
app.listen(process.env.PORT || port,()=>{
    console.log("Server running at http://localhost:"+port);
})