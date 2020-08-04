// ==UserScript==
// @name         Travian_ReportHighlight
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/berichte.php*
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
        $('#overview > tbody > tr > td > div > a').parent().append("<button type=\"button\" class=\"markit\" style=\"background-color: gray\" >mark</button>");

        $('#overview > tbody > tr > td > div > a').mouseover(function(e){
            e.stopPropagation();
            var text = $(this).html();
            var separ = " fornece "
            var text2 = text.split(separ)[1] + separ + text.split(separ)[0];
            $(".sub > div > a").each(function(){
                if ($(this).html() == text || $(this).html() == text2){
                    if ($(this).html().substr(0,5) == "Amber"){ //|| $(this).html() == text
                        //$(this).parent().css("background-color", "gray");
                        $(this).parent().css("background-color", "purple");
                    }else{
                        //$(this).parent().css("background-color", "gray");
                        $(this).parent().css("background-color", "GreenYellow");
                    }
                }else {
                    $(this).parent().css("background-color", "white");
                }
            });
        })
        
        $('.markit').click(function(e){
            e.stopPropagation();
            var text = $(this).parent().find("a").html();
            var separ = " fornece "
            var text2 = text.split(separ)[1] + separ + text.split(separ)[0];
            $(".sub > div > a").each(function(){
                if ($(this).html() == text || $(this).html() == text2){
                    if ($(this).html().substr(0,5) == "Amber"){ //|| $(this).html() == text
                        //$(this).parent().css("background-color", "gray");
                        $(this).closest("tr").find("input.check").prop( "checked", true );
                    }else{
                        //$(this).parent().css("background-color", "gray");
                        $(this).closest("tr").find("input.check").prop( "checked", true );
                    }
                }else {
                    $(this).parent().css("background-color", "white");
                }
            });
        })
    });
}
// load jQuery and execute the main function
addJQuery(main);