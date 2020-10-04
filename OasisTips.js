// ==UserScript==
// @name         Travian_OasisTips
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://*.travian.com/position_details.php*
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
        var villageName = $("h1.titleInHeader").html().substring(0, 16);

        if (villageName == "Oásis desocupado"){
            var nature = {
                Rato : {defInf: 25, defCav: 20, come: 1},
                Aranha : {defInf: 35, defCav:40, come:1},
                Serpente : {defInf: 40, defCav:60, come:1},
                Morcego : {defInf: 65, defCav:50, come:1},
                Javali : {defInf:70, defCav:33, come:2},
                Lobo : {defInf:80, defCav:70, come:2},
                Urso : {defInf:140, defCav:200, come:3},
                Crocodilo : {defInf: 380, defCav:240, come:3},
                Tigre : {defInf:170, defCav:250, come:3}
            };
            //console.log("Rato: " + nature["Rato"]["come"].toString());
            var animal = "";
            var defInftotal = 0;
            var defCavtotal = 0;
            var cometotal = 0;
            $("#troop_info").find("tr").each(function(){
                animal = $(this).find(".desc").html();
                if (animal != null) {
                    if (animal.slice(-1) == "s"){
                        animal = animal.slice(0,-1);
                    }
                    qtd = $(this).find(".val").html();
                    console.log($(this).find(".val").html());
                    console.log($(this).find(".desc").html());
                    console.log($(this).find(".desc").prop('title',"DefInf:"+nature[animal].defInf.toString()+", DefCav:"+nature[animal].defCav.toString()+", Cons:"+nature[animal].come.toString()));
                    defInftotal += nature[animal].defInf * qtd;
                    defCavtotal += nature[animal].defCav * qtd;
                    cometotal += nature[animal].come * qtd;
                }
            })
            var prtDefInf = "<tr><td colspan=\"2\">"+defInftotal.toString()+"</td><td>Def Inf ("+(defInftotal/cometotal).toFixed(1)+")</td></tr>";
            var prtDefcav = "<tr><td colspan=\"2\">"+defCavtotal.toString()+"</td><td>Def Cav ("+(defCavtotal/cometotal).toFixed(1)+")</td></tr>";
            var prtCome = "<tr><td colspan=\"2\">"+cometotal.toString()+"</td><td>Consumo</td></tr>";
            console.log(prtDefInf);
            console.log(prtDefcav);
            console.log(prtCome);
            $("#troop_info tbody").eq(0).append(prtDefInf);
            $("#troop_info tbody").eq(0).append(prtDefcav);
            $("#troop_info tbody").eq(0).append(prtCome);
        }

        // Rato	Rato	10	25	20	1	20
        // Aranha	Aranha	20	35	40	1	20
        // Cobra	Cobra	60	40	60	1	20
        // Morcego	Morcego	80	66	50	1	20
        // Javali	Javali	50	70	33	2	20
        // Lobo	Lobo	100	80	70	2	20
        // Urso	Urso	250	140	200	3	20
        // Crocodilo	Crocodilp	450	380	240	3	20
        // Tigre	Tigre	200	170	250	3	20
        // Elefante	Elefante	600	440	520	5	20
    });
}
// load jQuery and execute the main function
addJQuery(main);
