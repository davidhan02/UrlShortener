//Get Requirements and instantiates express for app
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
const app = express();
const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/, 'gi');

app.use(bodyParser.json());
app.use(cors());
//Connect to the database
//'ShortUrl' is name of collection but mongoose pluralizes it for collections
mongoose.connect(process.env.MONGODB_URI || 'mongodb://davidhan:egan25@ds042729.mlab.com:42729/fccprojects', { useNewUrlParser: true });

//Allows node to find static content in public folder
app.use(express.static(__dirname + '/public'));

//Creates the database entry
// * helps formatting helps the double backslash not going to folder
app.get('/api/shorturl/new/:urlToShorten(*)', (req, res, next) => {
    //ES5 var urlToShorten = req.params.urlToShorten
    let { urlToShorten } = req.params;
    //Regex for url
    if(regex.test(urlToShorten)) {
        // creates whole number between 0 and 100000
        let short = Math.floor(Math.random()*100000).toString();

        let data = new shortUrl({
            originalUrl: urlToShorten,
            shorterUrl: short
        });

        data.save((err) => {if(err) throw err;});

        return res.json({
            'originalUrl': urlToShorten,
            'shorterUrl': short
        });
    }
    else {
        let data = new shortUrl({
            originalUrl: 'urlToShorten does not match standard format',
            shorterUrl: 'InvalidURL'
        });

        return res.json({"error": "invalid URL"});
    }
});

//Query database and forward to originalUrl
app.get('/api/shorturl/:urlToForward', (req, res, next) => {
    //Stores value of param
    let { urlToForward } = req.params;
    shortUrl.findOne({'shorterUrl': urlToForward}, (err, data) => {
        if (err) throw err;
        let re = new RegExp("^(http|https)://", "i");
        let strToCheck = data.originalUrl;
        if(re.test(strToCheck)){
            res.redirect(301, data.originalUrl);
        }
        else{
            res.redirect(301, 'http://' + data.originalUrl);
        }
    })
});

//Listen to see if everything is working
//Process is for if it's on glitch or heroku
app.listen(process.env.PORT || 3000, () => {
    console.log('It is working!');
});
