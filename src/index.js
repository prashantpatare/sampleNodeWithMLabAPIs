var http = require("http");
var urlPkg = require("url");
var mongoose = require("mongoose");

var url = "mongodb://pappu:pappu123@ds349065.mlab.com:49065/user";
mongoose.connect(
  url,
  { useNewUrlParser: true },
  err => {
    if (err) console.log("Error in connecting to db" + err);
    else console.log("connected to database");
  }
);

var Schema = mongoose.Schema;
mongoose.model(
  "accountData",
  new Schema(
    { id: Number, name: String, balance: String },
    { collection: "accountData" }
  )
);

var accountData = mongoose.model("accountData");
accountData.find({}, function(err, data) {
  console.log(err, data, data.length);
  userData = data;
});

var processRequest = function(req, res) {
  res.writeHead(200, { "Content-Type": "text/json" }); // http header
  var url = req.url;

  var queryData = urlPkg.parse(req.url, true).query;
  var user =
    "id" in queryData ? userData.find(x => x.id == queryData.id) : userData;

  console.log("found user is =" + user);
  if (url === "/") {
    res.write("Welcome to my imaginary web service...");
  } else if (url.includes("/user") && user) {
    res.write(JSON.stringify(user));
  } else {
    res.write(JSON.stringify({ responce: "user not found" }));
  }
  res.end();
};

//create a server object:
http.createServer(processRequest).listen(8080); //the server object listens on port 8080
