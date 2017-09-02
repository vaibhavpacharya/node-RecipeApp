var mongoose = require("mongoose");
var Recipe   = require("./models/recipe");
var Comment  = require("./models/comment");
var data     = [
  {
    name: "Grilled Salmon",
    image: "https://farm9.staticflickr.com/8642/15755899147_e4c39c46dc.jpg",
    description: "Delicious Salmon!"
  },
  {
    name: "Grilled Chicken",
    image: "https://farm4.staticflickr.com/3201/2610556819_f79f18c3c9.jpg",
    description: "Juicy Chicken!"
  },
  {
    name: "Green beans",
    image: "https://farm4.staticflickr.com/3431/3209138696_cb50f0cfd2.jpg",
    description: "Healthy beans!"
  }

]
function seedDB(){
  // Remove Recipes
  Recipe.remove({}, function(err, removeRecipe){
    if(err){
      console.log(err);
    } else {
      console.log("removed Recipes!");
      // Add Recipes
      data.forEach(function(seed){
          Recipe.create(seed, function(err, recipe){
              if(err){
                console.log(err);
              } else{
                console.log("added recipe!");
                // Create Comment
                Comment.create(
                  {
                    text:"This recipe is great!",
                    author: "Vaibhav"
                  }, function(err, comment){
                    if(err){
                      console.log(err);
                    } else{
                      recipe.comments.push(comment);
                      recipe.save();
                      console.log("Created new comment!");
                    }
                  });
              }
          });
        });
      }
    });
}

module.exports = seedDB;
