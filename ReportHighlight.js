// ==UserScript==
// @name         Travian_ReportHighlight
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/berichte.php*
// @match        https://ts5.lusobrasileiro.travian.com/report/*
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
        $('#overview > tbody > tr > td > div > a').parent().append("<button type=\"button\" class=\"markit\" style=\"background-color: gray;color: white; padding: 0px 1px 0px 1px;\" >c</button>");
        $('#overview > tbody > tr > td > div > a').parent().append("<button type=\"button\" class=\"markall\" style=\"background-color: gray;color: white; padding: 0px 1px 0px 1px;float: right;\" >g</button>");

        // $('#overview > tbody > tr > td > div > a').mouseover(function(e){
        $('#overview > tbody > tr > td.sub').mouseover(function(e){
            e.stopPropagation();
            // var text = $(this).html();
            var text = $(this).find("div > a").html();
            var separ = " fornece "
            var text1 = "";
            var text2 = "";
            if(text.split(separ)[1].substr(2,5) == "Amber"){
                text2 = text;
                text1 = text.split(separ)[1] + separ + text.split(separ)[0];;
            }else{
                text1 = text;
                text2 = text.split(separ)[1] + separ + text.split(separ)[0];
            }
            var text3 = separ + text.split(separ)[1];

            var color0 = "white";
            var color1 = "purple";
            var color2 = "greenyellow";
            var color3 = "lightgray";
            $(".sub > div > a").each(function(){
                if ($(this).html() == text1 ){
                        $(this).parent().css("background-color", color1);
                }else if($(this).html() == text2){
                    $(this).parent().css("background-color", color2);
                }else {
                    if ($(this).html().endsWith(text3)){ 
                        $(this).parent().css("background-color", color3);
                        // $(this).parent().css("background-color", color1);
                    }else{
                        $(this).parent().css("background-color", "white");
                    }
                }
            });
            var c1 = $('#overview > tbody > tr > td.sub > div').filter(function () { 
                return this.style["background-color"] == color1 
            }).length;
            var c2 = $('#overview > tbody > tr > td.sub > div').filter(function () { 
                return this.style["background-color"] == color2 
            }).length;
            var c3 = $('#overview > tbody > tr > td.sub > div').filter(function () { 
                return this.style["background-color"] == color3 
            }).length;
            console.log("c1: " + c1);
            console.log("c2: " + c2);
            console.log("c3: " + c3);
            if(c1>c2 ){//&& c2!=0
                $(".markit").css("background-color", color1);
            }else if(c2>c1){
                $(".markit").css("background-color", color2);
            }else{
                $(".markit").css("background-color", color3);
            }
        })
        
        $('.markit').click(function(e){
            e.stopPropagation();
            var text = $(this).parent().find("a").html();
            var separ = " fornece "
            var text2 = text.split(separ)[1] + separ + text.split(separ)[0];
            $(".sub > div > a").each(function(){
                if ($(this).html() == text || $(this).html() == text2){
                    if ($(this).html().substr(2,5) == "Amber"){ //|| $(this).html() == text
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

        $('.markall').click(function(e){
            e.stopPropagation();
            var text = $(this).parent().find("a").html();
            var separ = " fornece "
            var text3 = separ + text.split(separ)[1];
            $(".sub > div > a").each(function(){
                if ($(this).html().endsWith(text3)){
                    $(this).closest("tr").find("input.check").prop( "checked", true );
                }
            });
        })

    });
}
// load jQuery and execute the main function
addJQuery(main);