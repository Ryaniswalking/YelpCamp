var Campground = require("../models/campgrounds");
var Comment = require("../models/comment")
//All the middleware

var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){     
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found.")
                res.redirect("back");
            }else{
                //does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("You don't have permission to do that.")
                    res.redirect("back")
                }               
            }
        }); 
    }else{
        req.flash("error", "You must be logged in to do that.")
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                //does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("You don't have permission to do that.")
                    res.redirect("back")
                }      
            }
        }); 
    }else{
        req.flash("error", "You must be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //flash messages "you need to login"
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}


module.exports = middlewareObj