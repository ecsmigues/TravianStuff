// ==UserScript==
// @name         Travian_WhareHouseSetter
// @version      0.1
// @description  try to take over the world!
// @author       Lola
// @match        https://ts5.lusobrasileiro.travian.com/*
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
        // function setCookie(cname,cvalue,exdays=365) {
        //     var d = new Date();
        //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
        //     var expires = "expires=" + d.toGMTString();
        //     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        // }

        // function getCookie(cname) {
        //     var name = cname + "=";
        //     var decodedCookie = decodeURIComponent(document.cookie);
        //     var ca = decodedCookie.split(';');
        //     for(var i = 0; i < ca.length; i++) {
        //     var c = ca[i];
        //     while (c.charAt(0) == ' ') {
        //         c = c.substring(1);
        //     }
        //     if (c.indexOf(name) == 0) {
        //         return c.substring(name.length, c.length);
        //     }
        //     }
        //     return "";
        // }

        var village = $("input.villageInput").val();
        if (village == null){
            village = $("#villageName").html().trim();
        }
        village = village.replace(" ","-");
        var cap1 = parseInt($("div.warehouse > div.capacity > div.value").html().replace(".","").replace(/[^\x20-\x7E]/g, ''));
        var cap2 = parseInt($("div.granary > div.capacity > div.value").html().replace(".","").replace(/[^\x20-\x7E]/g, ''));
        var lumber = parseInt($("#l1").html().replace(".",""));
        var clay = parseInt($("#l2").html().replace(".",""));
        var iron = parseInt($("#l3").html().replace(".",""));
        var crop = parseInt($("#l4").html().replace(".",""));

        //setCookie("village", village, (10/(60*24))));
        // setCookie(village+"_cap1", cap1, 1);
        // setCookie(village+"_cap2", cap2, 1);
        // setCookie(village+"_lumber", lumber, (10/(60*24)));
        // setCookie(village+"_clay", clay, (10/(60*24)));
        // setCookie(village+"_iron", iron, (10/(60*24)));
        // setCookie(village+"_crop", crop, (10/(60*24)));
        
        var storage = {};
        if(localStorage.getItem('Storage') == null) {
            storage = {};
        }else{
            storage = JSON.parse(localStorage.getItem('Storage'));
        }

        // storage.each(function( index ) {
        //     var updtAge = Date.now() - this[village]["updated_at"];
        //     var updtAge = updtAge/(1000 * 60); // age in minutes
        //     if (updtAge >5){
        //         storage[village]["lumber"] = 0;
        //         storage[village]["clay"] = 0;
        //         storage[village]["iron"] = 0;
        //         storage[village]["crop"] = 0;
        //     }
        // });

        if (typeof storage[village] == "undefined") {
            storage[village] = {};
        }
        storage[village]["warehouse"] = cap1;
        storage[village]["granary"] = cap2;
        storage[village]["lumber"] = lumber;
        storage[village]["clay"] = clay;
        storage[village]["iron"] = iron;
        storage[village]["crop"] = crop;
        storage[village]["updated_at"] = Date.now();
        storage[village]["perc_warehouse"] = 50;
        storage[village]["perc_granary"] = 50;

        console.log("storage:");
        console.log(storage);

        localStorage.setItem('Storage', JSON.stringify(storage))
    });
}
// load jQuery and execute the main function
addJQuery(main);
