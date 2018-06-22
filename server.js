import register from 'ignore-styles';
register(['.sass', '.scss'])

import express from 'express';
import mongoose from "mongoose";
import React from'React';
import ReactDOMServer from "react-dom/server"
import bodyParser from "body-parser"
import fs from "fs";

import Home from './src/components/Home';
import { Company, Child } from "./models/company";
import { mongoURI as db } from "./config/config"

import company from "./api/company/company";
import child from "./api/child/child";

const app = express();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose
    .connect(db)
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err));

app.use(company);
app.use(child);

app.get("/companies", (req, res) => {
    
    Company.find({}).deepPopulate("children.".repeat(100))
        .then(companies => res.status(200).send(companies))
        .catch(err => console.log(err));

    // Company.find({})
    //     .populate({
    //         path: "children", select:'companyName',
    //         populate: { path: "children",
    //         populate: { path: "children", 
    //         populate: { path: "children", 
    //         populate: { path: "children", select: 'companyName'}
    //                 }
    //             }
    //         }
    //     })
    //     .exec((err, story) => {
    //         if(err) throw err;
    //         return res.status(200).send(story);
    //     })
})

app.get('*', (req,res) => {
    const content = ReactDOMServer.renderToString(
       <Home/>
    )

    fs.readFile('./public/index.html','utf8', (err,data) => {
        if(err) throw err;
            const document =  data.replace(/<div id="app"><\/div>/, `<div id="app">${content}</div>`);
            res.send(document);
        })   
})

app.listen(3300, function(){
    console.log("app listening on port localhost:3300")
});