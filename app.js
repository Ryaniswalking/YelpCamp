var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash");
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campgrounds"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");




mongoose.connect("mongodb://localhost/yelp_camp_v9", { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash()); 

// seedDB();  //seed the database


//PASSPORT CONFIGUIRATION
app.use(require("express-session")({
    secret: "I want to be a Web Dev",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//puts currentUser into every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user,
    res.locals.error =  req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



//ROUTES
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000,function(){
    console.log("YelpCamp server has started.")
});