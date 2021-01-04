// ==UserScript==
// @name         Travian_MarketRoutesCheck
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/build.php?*
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
        if($("#build.gid17").length == 1 && $("div.favorKey0 > a.active").length == 1){
            $(".tradeRouteActions").append("<div id=\"MoreActions1\"></div>");
            $(".tradeRouteActions").append("<div id=\"MoreActions2\"></div>");
            $("#MoreActions1").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"CheckItens\">Check</button>");
            $("#MoreActions1").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"UncheckItens\">Uncheck</button>");
            $("#MoreActions2").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"clearfilter\">clear filter</button>");
            $("#MoreActions2").append("<button type=\"button\" class=\"textButtonV1 green\" style=\"background-color: blue\" id=\"DeleteItens\">Delete innactive</button>");
    
            $("#CheckItens").click(function(){
                CheckBtnClick(true)
            });
            $("#UncheckItens").click(function(){
                CheckBtnClick(false)
            });
            $("#DeleteItens").click(function(){
                // alert("a1");
                var itens = $('#trading_routes > tbody > tr > td > input').length;
                // alert("itens: " + itens);
                DeleteInnactiveRoutes(0,itens)
            });
            $("#clearfilter").click(function(){
                $('#trading_routes > tbody > tr').each(function(){
                        $(this).removeAttr("hidden");
            });
    
            function CheckBtnClick(val){
                var i = parseInt(prompt("começa do..?","1")) -1;
                var p = parseInt(prompt("a cada..?","1"));
                var itens = $('#trading_routes > tbody > tr > td > input').length;
                checkMark(i,p,itens,val);
            }
            function DeleteInnactiveRoutes(i,last) {
                var to = 100 + 2 * Math.floor(Math.random() * 100);
                // console.log(to);
                setTimeout(function () {
                    if (i <= last) {
                        // alert("i<last, yes");
                        if ($('#trading_routes > tbody > tr > td > input').eq(i).prop( "checked") == false){
                            // alert("will trigger click.." + i);
                            // $('#trading_routes > tbody > tr > td > button.icon').eq(i).click();
                            $('#trading_routes > tbody > tr > td.sel > button.icon').eq(i).trigger('click');
                        }
                        DeleteInnactiveRoutes(i+1,last);
                    }else{
                        alert("done");
                    }
                }, to);
            };
            function checkMark(i,p,last,val) {
                var to = 100 + 2 * Math.floor(Math.random() * 100);
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
            $('#trading_routes > tbody > tr > td.desc').click(function () {
                //$('#trading_routes > tbody > tr > td.desc > a:not(:contains(>'+name+'<))').closest("tr").remove();
    
                var name = $(this).find("a").html();
                $('#trading_routes > tbody > tr > td.desc > a').each(function(){
                    if ($(this).html() != name){
                        $(this).closest("tr").attr("hidden");
                    }
                });
    
                // window.onbeforeunload = function() {
                //     return "";
                // }
                $('#trading_routes > tbody > tr > td.sel > button').each(function () {
                    linkt = $(this).attr("onclick");
                    linkt = linkt.replace('location.href = ','open(').replace('; return false','); return false');
                    $(this).attr("onclick",linkt);
                })
    
            });
    
            $('#trading_routes > tbody > tr > td.desc > div.res > div > span').click(function () {
                var res = $(this).html();
                //console.log(res);
                //$('#trading_routes > tbody > tr > td.desc > a:not(:contains(>'+res+'<))').closest("tr").remove();
                $('#trading_routes > tbody > tr').each(function(){
                    if ($(this).find('td.desc > div.res > div > span:contains('+res+')').length == 0){
                        $(this).remove();
                    }
                });
            });
        }
    });
}
// load jQuery and execute the main function
addJQuery(main);


// window.onbeforeunload = function() {
//     return "";
// }
// $('#trading_routes > tbody > tr > td.sell > button').click(function () {
//     var name = $(this).find("a").html();
//     $('#trading_routes > tbody > tr > td.desc > a:not(:contains('+name+'))').closest("tr").remove();
// });



