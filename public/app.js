// Grab articles as JSON
$.getJSON("/articles", function (data) {
    // For each one display the information (ID, title, link) on the page
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});
$(document).on("click", "p", function() {
    // Empty the notes from the note section when "p" tag is clicked
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    // AJAX call to get article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    //  Append information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article, place the title in the title input and body of the note in body text area
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  // On click that captures the "savenote" button
$(document).on("click", "#savenote", function() {
    // Declaring variable that grabs the ID associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // POST request that changse the note based on what user inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note
        body: $("#bodyinput").val()
      }
    })
      .done(function(data) {
        // Console log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  });