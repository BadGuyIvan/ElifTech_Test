import mongoose,{ Schema } from "mongoose";
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const companySchema = new Schema({
        companyName: {
            type: String,
            required: true,
            unique: true
        },
        estimatedEarnings: {
            type: Number,
            required: true
        },
        children: [{ type: Schema.Types.ObjectId, ref: 'Child' }]
  });

const childSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    estimatedEarnings: {
        type: Number,
        required: true
    },
    parent: { type: Schema.Types.ObjectId, ref: 'Company' },
    children: [{ type: Schema.Types.ObjectId, ref: 'Child' }]
  });


companySchema.plugin(deepPopulate);

export const Company =  mongoose.model('Company', companySchema)
export const Child =  mongoose.model('Child', childSchema);