var express    = require("express");
var router     = express.Router();
var Recipe     = require("../models/recipe");
var middleware = require("../middleware");

// Index
router.get("/",function(req,res){
// Get all recipes ffrom the DB
Recipe.find({},function(err,allRecipes){
  if(err){
    console.log("SOMETHING GOT WRONG!");
    console.log(err);
  }
  else {
    // THen render them to the page
        res.render("recipes/index",{recipes:allRecipes, page: 'recipes'});
      }
    });
});

// CREATE Add new recipes
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form
  var name        =  req.body.name;
  var price       =  req.body.price;
  var image       =  req.body.image;
  var description =  req.body.description;
  var author      = {
    id:       req.user._id,
    username: req.user.username
  };
  var newRecipe = {name:name, price: price, image:image, description:description, author:author};

  // Create a new campground and save to the DB
  Recipe.create(newRecipe,function(err,newlyCreated){
    if(err){
      console.log(err);
    }
    else{
        //redirect to recipes page
        // console.log(newlyCreated);
        res.redirect("/recipes");
        }
    });
  });

// NEW-Show form to create new recipes
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("recipes/form");
});

//SHOW- Show info about one recipe
router.get("/:id",function(req,res){
  //find the recipe with provided ID
  // FindById(id,callback)
  Recipe.findById(req.params.id).populate("comments").exec(function(err,foundRecipe){
    if(err){
      console.log(err);
    }else{
      //render the show page
      res.render("recipes/show",{recipe: foundRecipe});
        }
  });
});

//EDIT recipe routes
router.get("/:id/edit",middleware.checkRecipeOwnership,function(req,res){
    Recipe.findById(req.params.id,function(err, foundRecipe){
          res.render("recipes/edit",{recipe: foundRecipe});
    });
});

//UPDATE recipe route
router.put("/:id",middleware.checkRecipeOwnership,function(req,res){
    var newData   = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price};
  //find the correct recipe
  Recipe.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedRecipe){
    if(err){
      req.flash("error", err.message);
      res.redirect("/recipes");
    } else {
      req.flash("success", "Successfully updated!");
      res.redirect("/recipes/" +updatedRecipe._id);
          }
    });
});

//DESTROY recipe route
router.delete("/:id",middleware.checkRecipeOwnership,function(req,res){
  Recipe.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/recipes");
    } else{
    res.redirect("/recipes");
  }
  });
});
module.exports = router;
