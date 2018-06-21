import register from 'ignore-styles';
register(['.sass', '.scss'])

import express from 'express';
import mongoose from "mongoose";
const ObjectId = require('mongodb').ObjectID;
import React from'React';
import ReactDOMServer from "react-dom/server"
import bodyParser from "body-parser"
import fs from "fs";
import Home from './src/components/Home';
import { Company, Child } from "./models/company";
import { mongoURI as db } from "./config/config"

const app = express();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose
    .connect(db)
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err));


app.post("/company", (req,res) => {
    const company = {
        _id: new mongoose.Types.ObjectId(),
        companyName: req.body.companyName,
        estimatedEarnings: req.body.estimatedEarnings
    }

    const newCompany = new Company(company);
    newCompany.save(
        (err) => {
            if(err) res.send(err);
            console.log('Save!')
    })  
})

app.put("/company",(req, res) => {
    const company = {
        oldCompanyName: req.body.oldCompanyName,
        companyName: req.body.companyName,
        estimatedEarnings: req.body.estimatedEarnings
    }

    Company.findOneAndUpdate({companyName: company.oldCompanyName}, 
        {$set: {companyName: company.companyName, estimatedEarnings: company.estimatedEarnings}} ,{ new : true})
            .then(res => console.log(res.companyName))
            .catch(err => console.log(err));
})


app.delete("/company", (req,res) => {
    const company = {
        CompanyName: req.body.CompanyName
    }

    Company.findOneAndRemove({companyName: company.CompanyName})
        .then(res => console.log('Company Delete'))
        .catch(err => console.log(err));
})

const child_recursive = (item) => {
    Child.findById({_id: item._id}, (err, res) => {
            if(res){
                Child.findByIdAndUpdate({_id: item._id},{$inc: {estimatedEarnings: 13}},{ new : true})
                    .then(res => console.log(res.companyName))
                    .catch(err => console.log(err));
                child_recursive(res.parent)
            } else {
                Company.findByIdAndUpdate({_id: item._id},{$inc: {estimatedEarnings: 13}},{ new : true})
                .then( res => console.log(res.companyName))
                .catch( err  => console.log(err));
            }
    })
}


app.post("/child", (req,res) => {

    const parent = req.body.parent;
    Child.findOne({companyName: parent}, (err, company) => {
        if(err) throw err;
        if(company){
            const child = {
                parent: company._id,
                companyName: req.body.companyName,
                estimatedEarnings: req.body.estimatedEarnings
            }

            const newChild = new Child(child);

            Child.findOneAndUpdate({companyName: parent}, {$push: { children: newChild}},
                function (error, success) {
                    if (error) {
                        // console.log(error);
                    } else {
                        // console.log(success);
                    }
                }
            )

            child_recursive(company)

            newChild.save();

        }
    })

    Company.findOne({companyName: parent}, (err, company) => {
        if(err) throw err

        if(company)
        {
            const child = {
                parent: company._id,
                companyName: req.body.companyName,
                estimatedEarnings: req.body.estimatedEarnings
            }
    
            const newChild = new Child(child);
    
            Company.findOneAndUpdate({companyName: parent}, {
                $push: { children: newChild}, 
                $inc : {estimatedEarnings: 13}
            }, {new: true},
                function (error, success) {
                    if (error) {
                        // console.log(error);
                    } else {
                        // console.log(success);
                    }
                }
            );
    
            newChild.save((err) => {
            })
        }
    })
})

app.put("/child", (req,res) => {
    const company = {
        oldChildCompanyName: req.body.oldChildCompanyName,
        companyName: req.body.companyName,
        estimatedEarnings: req.body.estimatedEarnings
    }

    Child.findOneAndUpdate({companyName: company.oldChildCompanyName}, 
        {$set: {companyName: company.companyName, estimatedEarnings: company.estimatedEarnings}} ,{ new : true})
            .then(res => console.log(res.companyName))
            .catch(err => console.log(err));
})

app.delete("/child", (req,res) => {
    const company = {
        CompanyName: req.body.CompanyName
    }
    
    Child.findOneAndRemove({companyName: company.CompanyName})
        .then(res => console.log('Company Delete'))
        .catch(err => console.log(err));
})

app.get("/companies", (req, res) => {
    
    Company.find({}).deepPopulate("children.".repeat(100))
        .exec((err,child) => res.status(200).send(child))

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