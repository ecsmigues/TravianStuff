// ==UserScript==
// @name         Travian_Btns
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://*.travian.com/*
// @grant        none
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}
function main(){
    $(document).ready(function(){
        $("#sidebarBoxActiveVillage").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"build.php?t=5&id=30\"><br>_Send</a>");
        $("#sidebarBoxActiveVillage").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"build.php?tt=1&id=39\"><br>_PRM</a>");


        $("#sidebarBoxVillagelist").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"dorf3.php?s=5\"><br>_Trop</a>");
        $("#sidebarBoxVillagelist").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"dorf3.php?s=4\"><br>_PC</a>");
        $("#sidebarBoxVillagelist").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"dorf3.php?s=3\"><br>_Arm</a>");
        $("#sidebarBoxVillagelist").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"dorf3.php?s=2\"><br>_Rec</a>");
        //$("#sidebarBoxVillagelist").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"dorf3.php?s=1\"><br>_Cons</a>");

        $("#sidebarBoxAlliance").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"allianz.php?s=3\"><br>_Rels</a>");
        $("#sidebarBoxAlliance").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"allianz.php?s=1\"><br>_Perf</a>");
        $("#sidebarBoxAlliance").find(".buttonsWrapper").prepend("<a class=\"buttonFramed withIcon round\" href=\"allianz.php?s=7\"><br>_Evs</a>");

    });
}
// load jQuery and execute the main function
addJQuery(main);
