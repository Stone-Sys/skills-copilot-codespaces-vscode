function skillsMember() {
    // Path: member.js
    var skills = document.getElementById("skills").value;
    var skillsArray = skills.split(",");
    var skillsList = document.getElementById("skillsList");
    var skillsListHTML = "";
    for (var i = 0; i < skillsArray.length; i++) {
        skillsListHTML += "<li>" + skillsArray[i] + "</li>";
    }
    skillsList.innerHTML = skillsListHTML;
}