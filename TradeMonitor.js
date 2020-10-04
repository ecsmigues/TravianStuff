// ==UserScript==
// @name         Travian_TradeMonitor
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://*.travian.com/berichte.php*
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
        //https://ts5.lusobrasileiro.travian.com/position_details.php?x=51&y=-41
        if ($("img.trade").length == 0 ){
            return 0;
        }
        
        var remName = $("div.from").find("a.player").html();
        var remAlly = $("div.from").find("a.alliance").html();
        var desName = $("div.from").find("a.player").html();
        var desAlly = $("div.from").find("a.alliance").html();
        $("#trade").find("div.resources > span.value").each(function() {
            // alert(String(this.innerText));
            //localStorage.lastname = "Smith";

        });
    });
}
// load jQuery and execute the main function
addJQuery(main);
