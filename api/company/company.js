import express from "express";
import { Company } from "../../models/company";

const router = express.Router();

router.post('/company', (req, res) => {
    const company = {
    companyName: req.body.companyName,
    estimatedEarnings: req.body.estimatedEarnings
    }

const newCompany = new Company(company);
newCompany.save()
    .then( res => console.log("Save!"))
    .catch(err => console.log(err))
});

router.put("/company",(req, res) => {
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

router.delete("/company", (req,res,next) => {
    const company = {
        CompanyName: req.body.CompanyName
    }

    Company.findOneAndRemove({companyName: company.CompanyName})
        .then(res => console.log('Company Delete'))
        .catch(next);
})

export default router;