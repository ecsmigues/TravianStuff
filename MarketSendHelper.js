// ==UserScript==
// @name         Travian_MarketSendHelper
// @version      0.1.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/build.php?*t=5*id=30*
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
        if($("h1.titleInHeader").html().substring(0,7)=="Mercado"){
            function setCookie(cname,cvalue,exdays=365) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            }
            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
                }
                return "";
            }

            //$("#marketSend").after( "<table id=\"cap-data\" style=\"width:100%\"><tr><th>Ald</th><th>Armazem</th><th>Madeira</th><th>Barro</th><th>Ferro</th><th>Celeiro</th><th>Cereal</th></tr></table>" )
            $("#marketSend").after( "<table id=\"cap-data\" style=\"width:100%;white-space: nowrap;\"><tr id=\"cap-data-header\"></tr></table>" );
            $("#cap-data-header").append("<th>Aldeia<br><input type=\"text\" id=\"Need\" value=\"\" size=\"2\"></input></th>");
            $("#cap-data-header").append("<th>Arm.</th>");
            $("#cap-data-header").append("<th>Madeira<br><input type=\"text\" id=\"NeedLumber\" value=\"0\" size=\"4\"></input></th>");
            $("#cap-data-header").append("<th>Barro<br><input type=\"text\" id=\"NeedClay\" value=\"0\" size=\"4\"></input></th");
            $("#cap-data-header").append("<th>Ferro<br><input type=\"text\" id=\"NeedIron\" value=\"0\" size=\"4\"></input></th");
            $("#cap-data-header").append("<th>Cel.</th>");
            $("#cap-data-header").append("<th>Cereal<br><input type=\"text\" id=\"NeedCrop\" value=\"0\" size=\"4\" ></input></th>");
            //$("#cap-data").append( "<tr><td>AmberX</td><td>1000</td><td>1000</td><td>1000</td><td>1000</td><td>1000</td><td>1000</td></tr>" )
            var trModel = "<tr data-village=\"@village@\"><td class=\"tovillage\" data-village=\"@village@\">@village@</td><td class=\"armcap\" >@cap1@</td><td>@lumber@</td><td>@clay@</td><td>@iron@</td><td>@cap2@</td><td>@crop@</td></tr>";
            $("#sidebarBoxVillagelist").find("span.name").each(function(){
                var village = $(this).html().replace(" ","-");
                //var village = $("input.villageInput").val().replace(" ","-");
                var cap1 = parseInt(getCookie(village+"_cap1"));
                var cap2 = parseInt(getCookie(village+"_cap2"));
                var lumber = parseInt(getCookie(village+"_lumber"));
                var clay = parseInt(getCookie(village+"_clay"));
                var iron = parseInt(getCookie(village+"_iron"));
                var crop = parseInt(getCookie(village+"_crop"));
                $("#cap-data").append(trModel
                    .replace(/@village@/g,village)
                    .replace("@cap1@",cap1.toString())
                    .replace("@lumber@",lumber.toString() + " (" + ((lumber/cap1)*100).toFixed(0) + "%)")
                    .replace("@clay@",clay.toString() + " (" + ((clay/cap1)*100).toFixed(0) + "%)")
                    .replace("@iron@",iron.toString() + " (" + ((iron/cap1)*100).toFixed(0) + "%)")
                    .replace("@cap2@",cap2.toString())
                    .replace("@crop@",crop.toString() + " (" + ((crop/cap2)*100).toFixed(0) + "%)")
                    .replace(/NaN/g,"")
                );
            })
            $('#cap-data').find('td').css('padding', '0');

            var thisvillage = $("input.villageInput").val();
            if (thisvillage == null){
                thisvillage = $("#villageName").html().trim();
            }
            thisvillage = thisvillage.replace(" ","-");


            $("#Need").change(function(){
                var StuffNedded = $("#Need").val().split(" ");
                $("#NeedLumber").val(StuffNedded[0]);
                $("#NeedClay").val(StuffNedded[1]);
                $("#NeedIron").val(StuffNedded[2]);
                $("#NeedCrop").val(StuffNedded[3]);
            });


            $(".tovillage").click(function(){
                $('.tovillage').css('background-color', '');
                $(this).css('background-color', 'gray');
                var village = $(this).data("village");
                var capArm = parseInt(getCookie(village+"_cap1"));
                var capCel = parseInt(getCookie(village+"_cap2"));

                var lumberIn = parseInt(getCookie(village+"_lumber"));
                var clayIn = parseInt(getCookie(village+"_clay"));
                var ironIn = parseInt(getCookie(village+"_iron"));
                var cropIn = parseInt(getCookie(village+"_crop"));

                var lumberNeed = parseInt($("#NeedLumber").val());
                var clayNeed =  parseInt($("#NeedClay").val());
                var ironNeed = parseInt($("#NeedIron").val());
                var cropNeed = parseInt($("#NeedCrop").val());

                var allok = true;
                if(lumberNeed>capArm || clayNeed>=capArm || ironNeed>=capArm){
                    allok = false;
                    alert("Armazem nao comporta!")
                }
                if(cropNeed>capCel){
                    allok = false;
                    alert("Celeiro nao comporta!")
                }

                if(allok){
                    var trips = $("#x2").val();

                    if (thisvillage != village){
                        var lumber =  lumberNeed > lumberIn ? (lumberNeed - lumberIn)/trips : 0;
                        var clay = clayNeed > clayIn ? (clayNeed - clayIn)/trips : 0;
                        var iron = ironNeed > ironIn ? (ironNeed - ironIn)/trips : 0;
                        var crop = cropNeed > cropIn ? (cropNeed - cropIn)/trips : 0;
                    }else{
                        var lumber =  lumberNeed < lumberIn ? (lumberIn - lumberNeed)/trips : 0;
                        var clay = clayNeed < clayIn ? (clayIn - clayNeed)/trips : 0;
                        var iron = ironNeed < ironIn ? (ironIn - ironNeed)/trips : 0;
                        var crop = cropNeed < cropIn ? (cropIn - cropNeed)/trips : 0;

                    }

                    $("#enterVillageName").val(village.replace("-"," "));
                    $("#r1").val(lumber.toFixed(0));
                    $("#r2").val(clay.toFixed(0));
                    $("#r3").val(iron.toFixed(0));
                    $("#r4").val(crop.toFixed(0));
                }
            });

            $(".armcap").click(function(){
                var village =$(this).parent().data("village");
                var capArm = parseInt(getCookie(village+"_cap1"));
                var capCel = parseInt(getCookie(village+"_cap2"));
                
                var spa = getCookie(village+"_perc_arm");
                var spc = getCookie(village+"_perc_cel");
                spa = prompt("Perc. Armazem",spa);
                spc = prompt("Perc. Celeiro",spc);
                pa = parseInt(spa)/100;
                pc = parseInt(spc)/100;
                
                var lumberNeed = (capArm * pa);
                var clayNeed =  (capArm * pa);
                var ironNeed = (capArm * pa);
                var cropNeed = (capCel * pc);
                
                $("#NeedLumber").val(lumberNeed);
                $("#NeedClay").val(clayNeed);
                $("#NeedIron").val(ironNeed);
                $("#NeedCrop").val(cropNeed);

                setCookie(village+"_perc_arm", spa, 30)
                setCookie(village+"_perc_cel", spc, 30)
            });
            //
            function kkk(){
                $("#r1").val($("#NeedLumber").val());
                $("#r2").val($("#NeedClay").val());
                $("#r3").val($("#NeedIron").val());
                $("#r4").val($("#NeedCrop").val());
            }
        }
    });
}
// load jQuery and execute the main function
addJQuery(main);
