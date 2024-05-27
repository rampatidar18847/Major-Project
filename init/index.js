const { default: mongoose } = require('mongoose');
const mongodb = require('mongoose');
const listSchema = mongoose.Schema;
const Datainit = require('./data.js');
const listing = require('../models/listing.js');

main().then(()=>
{
    console.log("connection of DB successfully established");
}).catch((err)=>
{
    console.log(err);
})
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderland");
}

async function initialize()
{
    await listing.deleteMany();
    Datainit.data = Datainit.data.map((obj)=>
    ({
        ...obj,
        owner : "6628db561208b09642ac66fb",

    }));
    await listing.insertMany(Datainit.data);
    console.log("data initialized");
}

initialize();