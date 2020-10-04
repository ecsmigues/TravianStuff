// ==UserScript==
// @name         Travian_MarketSendHelper
// @version      0.1.1
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
        if($("#build.gid17").length == 1 && $("div.favorKey5 > a.active").length == 1){

            storage = {};
            if(localStorage.getItem('Storage') == null) {
                storage = {};
            }else{
                storage = JSON.parse(localStorage.getItem('Storage'));
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
                if (typeof storage[village] == "undefined") {
                    storage[village] = {};
                }else{
                    var updtAge = Date.now() - storage[village]["updated_at"];
                    var updtAge = updtAge/(1000 * 60); // age in minutes
                    if (updtAge > 7){
                        storage[village]["lumber"] = 0;
                        storage[village]["clay"] = 0;
                        storage[village]["iron"] = 0;
                        storage[village]["crop"] = 0;
                        localStorage.setItem('Storage', JSON.stringify(storage))
                    }

                    var cap1 = storage[village].warehouse;
                    var cap2 = storage[village].granary;
                    var lumber = storage[village].lumber;
                    var clay = storage[village].clay;
                    var iron = storage[village].iron;
                    var crop = storage[village].crop;
                    
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
                }
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
                window.onbeforeunload = function() {
                    return "";
                }

                $('.tovillage').css('background-color', '');
                $(this).css('background-color', 'gray');
                var village = $(this).data("village");
                var capArm = storage[village].warehaouse;
                var capCel = storage[village].granary;

                var lumberIn = storage[village].lumber;
                var clayIn = storage[village].clay;
                var ironIn = storage[village].iron;
                var cropIn = storage[village].crop;

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
                if(lumberIn==0 && clayIn==0 && ironIn==0 && cropIn==0){
                    allok = false;
                    alert("Atualizar dados da aldeia destino.")
                }

                if(allok){
                    var trips = $("#x2").val();

                    $("#enterVillageName").val(village.replace("-"," "));

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
                        $("#enterVillageName").val("Amber 02");
                    }

                    $("#r1").val(lumber.toFixed(0));
                    $("#r2").val(clay.toFixed(0));
                    $("#r3").val(iron.toFixed(0));
                    $("#r4").val(crop.toFixed(0));
                }
            });

            $(".armcap").click(function(){
                $(".armcap").css('background-color', '');
                $(this).css('background-color', 'gray');

                var village =$(this).parent().data("village");
                var capArm = storage[village].warehouse;
                var capCel = storage[village].granary;
                
                var spa = storage[village].perc_warehouse;
                var spc = storage[village].perc_granary;
                spa = parseInt(prompt("Perc. Armazem",spa));
                spc = parseInt(prompt("Perc. Celeiro",spc));
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

                storage[village].perc_warehouse = spa;
                storage[village].perc_granary = spc;
                localStorage.setItem('Storage', JSON.stringify(storage))
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
