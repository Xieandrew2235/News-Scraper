// Require mongoose
var mongoose = require("mongoose");

// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // Title is required
  title: {
    type: String,
    unique: true,
    required: true
  },
  // Link is required
  link: {
    type: String,
    unique: true,
    required: true
  },
  // Saves the ObjectId of a note, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;