// Grab articles as JSON
$.getJSON("/articles", function (data) {
    // For each one display the information (ID, title, link) on the page
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});
