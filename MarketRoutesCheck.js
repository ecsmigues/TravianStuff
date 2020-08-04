// ==UserScript==
// @name         Travian_MarketRoutesCheck
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/build.php?*t=0*id=30*
// @match        https://ts5.lusobrasileiro.travian.com/build.php?*id=30*t=0*
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


        $(".tradeRouteActions").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"CheckItens\" >Check</button>");
        $(".tradeRouteActions").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"UncheckItens\" >Uncheck</button>");

        $("#CheckItens").click(function(){
            CheckBtnClick(true)
        });
        $("#UncheckItens").click(function(){
            CheckBtnClick(false)
        });

        function CheckBtnClick(val){
            var i = parseInt(prompt("começa do..?","1")) -1;
            var p = parseInt(prompt("a cada..?","1"));
            var itens = $('#trading_routes > tbody > tr > td > input').length;
            checkMark(i,p,itens,val);
        }

        function checkMark(i,p,last,val) {
            var to = 200 + 2 * Math.floor(Math.random() * 100);
            console.log(to);
            setTimeout(function () {
                if (i <= last) {
                    //var iten = $('#trading_routes > tbody > tr > td > input').eq(i);
                    //console.log(iten.prop( "checked"));
                    //console.log(val);
                    //console.log(iten.prop( "checked") == val);
                    //console.log(iten.prop( "checked") != val);
                    if ($('#trading_routes > tbody > tr > td > input').eq(i).prop( "checked") != val){
                        $('#trading_routes > tbody > tr > td > input').eq(i).trigger('click');
                        $('#trading_routes > tbody > tr > td > input').eq(i).prop( "checked", val );
                    }
                    checkMark(i+p,p,last,val);
                }else{
                    alert("done");
                }
            }, to);
        };


    });
}
// load jQuery and execute the main function
addJQuery(main);