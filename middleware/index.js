var Recipe = require("../models/recipe");
var Comments = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
  //is user logged in
 if(req.isAuthenticated()){
        Recipe.findById(req.params.id, function(err, foundRecipe){
           if(err){
             req.flash("error","Recipe not found.");
               res.redirect("back");
           }  else {
               // does user own the recipe?
            if(foundRecipe.author.id.equals(req.user._id)) {
                next();
            } else {
              req.flash("error","You dont have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
      req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  //is the user logged in
 if(req.isAuthenticated()){
        Comments.findById(req.params.comment_id, function(err, foundComment){
           if(err){
             req.flash("error","Comment not found!");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
              req.flash("error","You dont have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
      req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;
