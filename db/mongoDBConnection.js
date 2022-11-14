const mongoose = require("mongoose");

const DB_NAME = process.env.DB_NAME;
const DB_LINK = process.env.DB_LINK;
const mongoURI = DB_LINK + DB_NAME;

// config connection: CReation
const connection = new mongoose.createConnection(
  mongoURI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  async (err, client) => {
    if (err) {
      console.log("mongoose.createConnection(...FAILED !!!", err);
    } else if (client) {
      console.log("mongoose.createConnection(... was successful");
    }
  }
);

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((err, client) => {
    if (err) {
      console.log("mongoose.connect(... FAILED !!! ", mongoose.Error);
    } else if (client) {
      console.log("mongoose.connect(... was successful");
    } else {
      console.log("neither err or client ");
    }
  });

// config database
const db = connection.client.db(DB_NAME); //error code because client is not yet established
//the same as mongoose.connections[0].client.db(DB_NAME);

//config Bucket for file handling
const bucket = new mongoose.mongo.GridFSBucket(db, {
  bucketName: "uploads",
});
connection.once("connected", async (err, client) => {
  if (err) {
    console.log("error with connection.once('connected',... ) function ");
  }
  if (client) {
    console.log("connected to the DB");
    const cursor = bucket.find({});
  }
});

module.exports = { bucket };
