// ==UserScript==
// @name         Travian_TimedSend
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/build.php?gid=16&tt=2
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
        $("#rallyPointButtonsContainer").prepend("<input type=\"text\" id=\"SendTime\"  value=\"23:59:59\" size=\"6\" ></input>");
        function timedSend(stime) {
            setTimeout(function () {
                //console.log($(".at span").html());
                //console.log("stime is " + stime);
                if ($(".at span").html() == stime) {
                    //alert ("click!");
                    $("#btn_ok").click();
                    $("#Agendar").html("Foi...");
                } else {
                    timedSend(stime);
                }
            }, 200);
        };
        $("#rallyPointButtonsContainer").prepend("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"Agendar\" >Agendar</button>");
        $("#Agendar").click(function(){
            var sstime = $("#SendTime").val();
            console.log("stime is " + sstime);
            timedSend(sstime);
            $("#SendTime").prop("disabled", true);
            $("#Agendar").prop("disabled", true);
            $("#Agendar").html("Agendado");
        });
    });
}
// load jQuery and execute the main function
addJQuery(main);