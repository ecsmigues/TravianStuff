// ==UserScript==
// @name         Travian_PrmMonitor
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
        //if currently on the market
        if($("#build.gid16").length == 1 && $("div.favorKey1 > a.active").length == 1){
            // GET this Current village's name
            var village = $("input.villageInput").val();
            if (village == null){
                village = $("#villageName").html().trim();
            }
            village = village.replace(" ","-");
    
            // GET localStorage
            var prm = {};
            if(localStorage.getItem('prm') == null) {
                prm = {};
                // alert("new route variable");
            }else{
                prm = JSON.parse(localStorage.getItem('prm'));
            }
    
            // Clear any previus values in localStorage for current comp
            prm[village] = {};
    
            console.log(village + " prm:");
            console.log(JSON.stringify(prm[village]));
    
            // Populate localStorage
            $(".troop_details").each(function(){
                var desc = $(this).find(".troopHeadline > a").eq(0).html().replace(/<[^>]*>/g, "").trim();
                var desc = desc + " (" + $(this).find(".role > a").eq(0).html().replace(/<[^>]*>/g, "").trim() + ")";
                var desp = $(this).find(".resources > span.value").eq(0).html();//.trim();
                // if (desp == undefined ){
                // }
                desp = parseInt(desp) ?? 0;
                
                if (typeof prm[village] == "undefined") {
                    prm[village]= {};
                }
                if (typeof prm[village][desc] == "undefined") {
                    prm[village][desc] = 0;
                }
                prm[village][desc] += desp
                // console.log(desc + desp);
            })

            //Print localStorage and Save
            console.log(village + " prm:");
            console.log(prm);
    
            localStorage.setItem('prm', JSON.stringify(prm))
        }
        
        if($("#content.village3").length == 1 && $("div.favorKeyoverview > a.active").length == 1){
            var prmTab = $(".favorKeyoverview").clone();
            prmTab.removeClass("favorKeyoverview").addClass("favorKeyPRM");
            prmTab.find("a").attr("href","#");
            $(".scrollingContainer").append(prmTab);
            prmTab.find("a").html("PRM");

            prmTab.click(function (){
                $("#content > table > thead > tr").remove();
                $("#content > table > tbody > tr").remove();
                
                var prm = JSON.parse(localStorage.getItem('prm'));
                console.log(prm);

                // thead
                var tableHeader = "";
                tableHeader += "<tr>";
                tableHeader += "<td>Village</td>";
                tableHeader += ("<td>dest</td>");
                tableHeader += ("<td>Consumo</td>");
                tableHeader += "</tr>";
                $("#content > table > thead").append(tableHeader);
    
                //tbody
                var tableBody = "";
                var tableRow = "";
                $("#sidebarBoxVillagelist").find("span.name").each(function(){
                    var myVil = $(this).html().replace(" ","-");
                    if (typeof prm[myVil] == "undefined") {
                        prm[myVil] = {};
                    }
                    for(var toVil in prm[myVil]) {
                        if(prm[myVil][toVil]>=50 || prm[myVil][toVil]==null){
                            tableBody += "<tr class='hover'>";
                            tableBody += ("<td>" + myVil + "</td>");
                            // console.log(toVil);
                            tableBody += ("<td>" + toVil + "</td>");
                            tableBody += ("<td>" + prm[myVil][toVil] + "</td>");
                            tableBody += "</tr>";
                        }
                    }
                })
                $("#content > table > tbody").append(tableBody);
                
                if (typeof(dTable) == "undefined"){
                    $("#content > table ").append("<tfoot><tr><th colspan='2' style=''>Total:</th><th></th></tr></tfoot>")
                    function loadScript(url, callback)
                    {
                        // adding the script tag to the head as suggested before
                        var head = document.getElementsByTagName('head')[0];
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = url;
    
                        // then bind the event to the callback function 
                        // there are several events for cross browser compatibility
                        script.onreadystatechange = callback;
                        script.onload = callback;
    
                        // fire the loading
                        head.appendChild(script);
                    }
                    var myPrettyCode = function() {
                        // here, do what ever you want
                        dTable = $('#overview').DataTable({
                            "paging":   false,
                            "footerCallback": function ( row, data, start, end, display ) {
                                var api = this.api(), data;
                    
                                // Remove the formatting to get integer data for summation
                                var intVal = function ( i ) {
                                    return typeof i === 'string' ?
                                        i.replace(/[\$,]/g, '').replace(/null/g, '')*1 :
                                        typeof i === 'number' ?
                                            i : 0;
                                };
                    
                                // Total over all pages
                                total = api
                                    .column( 2 )
                                    .data()
                                    .reduce( function (a, b) {
                                        return intVal(a) + intVal(b);
                                    }, 0 );
                    
                                // Total over this page
                                pageTotal = api
                                    .column( 2, { page: 'current'} )
                                    .data()
                                    .reduce( function (a, b) {
                                        return intVal(a) + intVal(b);
                                    }, 0 );
                    
                                // Update footer
                                $( api.column( 2 ).footer() ).html(
                                    ''+pageTotal //+' ('+ total +' total)'
                                );
                            }
                        });
                    };
                    loadScript("https://cdn.datatables.net/1.10.22/js/jquery.dataTables.min.js", myPrettyCode);
                }

                return false;
            })

        }
    });
}
// load jQuery and execute the main function
addJQuery(main);



