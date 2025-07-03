const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../model/listing');

async function main() {
    const mongoURL = "mongodb://127.0.0.1:27017/Voyagio";
    const ATLAS_URL = "mongodb+srv://harshmahajansk8:VqV7ExMHTWMHDs2n@cluster0.qqnsync.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(ATLAS_URL);
};

main()
    .then(() => console.log('Db is connected'))
    .catch(() => { console.log('There is an error in db connection') });

const initDb = async () => {
    await Listing.deleteMany();
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "685f89dc279da19026acec3b" }));
    await Listing.insertMany(initData.data);
    console.log('Data is saved');
}
initDb();