import express from 'express';
import { Company, Child} from "../../models/company";

const router = express.Router();

const child_recursive = (item) => {
    Child.findById({_id: item._id}, (err, res) => {
            if(res){
                Child.findByIdAndUpdate({_id: item._id},{$inc: {estimatedEarnings: 3}},{ new : true})
                    .then(res => console.log(res.companyName))
                    .catch(err => console.log(err));
                child_recursive(res.parent)
            } else {
                Company.findByIdAndUpdate({_id: item._id},{$inc: {estimatedEarnings: 3}},{ new : true})
                .then( res => console.log(res.companyName))
                .catch( err  => console.log(err));
            }
    })
}


router.post("/child", (req,res) => {

    const parent = req.body.parent;

    Child.findOne({companyName: parent})
        .then(company => {
            if(company){
                const child = {
                    parent: company._id,
                    companyName: req.body.companyName,
                    estimatedEarnings: req.body.estimatedEarnings
                }

                const newChild = new Child(child);

                Child.findOneAndUpdate({companyName: parent}, {$push: { children: newChild}})
                    .then(res => console.log("Add new Child Company"))
                    .catch(err => console.log(err))

                child_recursive(company)

                newChild.save();
            }
        })
        .catch(err => console.log(err))

    Company.findOne({companyName: parent})
        .then(company => {
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
                    $inc : {estimatedEarnings: 3}
                }, {new: true})
                    .then(res => console.log(company.companyName))
                    .catch(err => console.log(err))
        
                newChild.save()
                    .then(res => console.log("Add new Company"))
                    .catch(err => console.log(err));
            }
        })
})

router.put("/child", (req,res) => {
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

router.delete("/child", (req,res) => {
    const company = {
        CompanyName: req.body.CompanyName
    }
    
    Child.findOneAndRemove({companyName: company.CompanyName})
        .then(res => console.log('Company Delete'))
        .catch(err => console.log(err));
})

export default router;