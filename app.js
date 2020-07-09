require('dotenv').config(); // for .env files

/* require all neccesary packages*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

/* connect to mongodb atlas*/
mongoose.connect("mongodb+srv://admin-kamakshi:Kamakshi@00@cluster0-n08gz.mongodb.net/bookDB",{useNewUrlParser: true});


// create database schema
const bookSchema=mongoose.Schema(
  {
    booktitle : String,
    bookdescription : String,
    imageURL:String,
    bookcost:Number,
    sellermail:String
  }
);

// create model
const Book=mongoose.model("Book",bookSchema);


// set path for ejs file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));

// to access static style pages eg;styles.css
app.use(express.static("public"));


// file upload using cloudinary
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "demo",
allowedFormats: ["jpg", "png"],
transformation: [{ width: 200, height: 200, crop: "limit" }]
});
const parser = multer({ storage: storage });


//content for home,about and contact ejs file
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//display all book information in home page
app.get('/',function(req,res)
{
  Book.find({},function(err,founditems)
{
  if(!err)
  {
    res.render('home',{homecontent:homeStartingContent, printcontent:founditems});
  }
});
});


//display selected book information in a seperate single product page
app.get('/singleproduct/:parameter', function (req, res) {

  const bookid=req.params.parameter;
  Book.findOne({_id: bookid},function(err,foundvalues)
{
  res.render('singleproduct',{booktitle : foundvalues.booktitle, bookdescription: foundvalues.bookdescription , imageURL: foundvalues.imageURL, bookcost: foundvalues.bookcost, sellermail: foundvalues.sellermail});
});
});

//render about,contact and sell pages
app.get('/about',function(req,res)
{
  res.render('about',{aboutcontent:aboutContent});

});
app.get('/contact',function(req,res)
{
  res.render('contact',{contactcontent:contactContent});

});
app.get('/sell',function(req,res)
{
  res.render('sell');

});


//store book information in database
app.post('/sell', parser.single("image"), (req, res) => {
  console.log(req.file) // to see what is returned to you
  const book = new Book( //javascript object
    {
      booktitle : req.body.booktitle,
      bookdescription : req.body.bookdescription,
      imageURL : req.file.url,
      bookcost: req.body.bookcost,
      sellermail: req.body.sellermail
    }
  );
  console.log(book);
book.save(function(err) //store data
{
  res.redirect('/');
});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
