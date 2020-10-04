// ==UserScript==
// @name         Travian_MarketRoutesMonitor
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
        if($("#build.gid17").length == 1 && $("div.favorKey0 > a.active").length == 1){
            // GET this Current village's name
            var village = $("input.villageInput").val();
            if (village == null){
                village = $("#villageName").html().trim();
            }
            village = village.replace(" ","-");
    
    
            // GET localStorage
            var routes = {};
            if(localStorage.getItem('Routes') == null) {
                routes = {};
                // alert("new route variable");
            }else{
                routes = JSON.parse(localStorage.getItem('Routes'));
            }
    
            // if (typeof routes[village] == "undefined") {
            // }
            // Clear any previus values in localStorage for current comp
            routes[village] = {};
    
            // Populate localStorage
            $('#trading_routes > tbody > tr').each(function(){
                var act = $(this).find('td > input').prop("checked");
                if(act && $(this).find('td.desc > a.name').length>0){
                    var toVillageAttr = $(this).find('td.desc > a.name').attr("href").split('?')[1].split('&new').pop();
                    var toVillage = $(this).find('td.desc > a.name').attr("href").split('?')[1].split('&new').pop();
                    if (typeof routes[village][toVillage] == "undefined") {
                        routes[village][toVillage] = {};
                        routes[village][toVillage].VillageName = $(this).find('td.desc > a.name').html();
                        routes[village][toVillage].r1 = 0;
                        routes[village][toVillage].r2 = 0;
                        routes[village][toVillage].r3 = 0;
                        routes[village][toVillage].r4 = 0;
                    }
                    var trips = $(this).find('td.trad').html().trim();
                    trips = trips.split("x").length == 2 ? parseInt(trips.split("x")[0]) : 1;
                    // routes[village][toVillage].r1 += Math.round(parseInt($(this).find('td.desc > div.res > div > i.r1').parent().find('span').html())*trips*10/24)/10;
                    // routes[village][toVillage].r2 += Math.round(parseInt($(this).find('td.desc > div.res > div > i.r2').parent().find('span').html())*trips*10/24)/10;
                    // routes[village][toVillage].r3 += Math.round(parseInt($(this).find('td.desc > div.res > div > i.r3').parent().find('span').html())*trips*10/24)/10;
                    // routes[village][toVillage].r4 += Math.round(parseInt($(this).find('td.desc > div.res > div > i.r4').parent().find('span').html())*trips*10/24)/10;
    
                    routes[village][toVillage].r1 += parseInt($(this).find('td.desc > div.res > div > i.r1').parent().find('span').html())*trips;
                    routes[village][toVillage].r2 += parseInt($(this).find('td.desc > div.res > div > i.r2').parent().find('span').html())*trips;
                    routes[village][toVillage].r3 += parseInt($(this).find('td.desc > div.res > div > i.r3').parent().find('span').html())*trips;
                    routes[village][toVillage].r4 += parseInt($(this).find('td.desc > div.res > div > i.r4').parent().find('span').html())*trips;
                }
            });


            //Print localStorage and Save
            console.log(village + " routes:");
            console.log(routes[village]);
    
            localStorage.setItem('Routes', JSON.stringify(routes))
            $("div.npcMerchant > button").css("color","blue");
        }
        
        if($("#content.village3").length == 1 && $("div.favorKeyoverview > a.active").length == 1){
            var newthing = $(".favorKeyoverview").clone();
            newthing.removeClass("favorKeyoverview").addClass("favorKeyRoutes");
            newthing.find("a").attr("href","##");
            $(".scrollingContainer").append(newthing);
            newthing.find("a").html("Rotas");

            newthing.click(function (){
                // $("table > thead > tr > td:contains('+res+')'")
                $("#content > table > thead > tr").remove();
                $("#content > table > tbody > tr").remove();
    
                var routes = JSON.parse(localStorage.getItem('Routes'));
                console.log(routes);
                
                // thead
                var tableHeader = "";
                for(var myVil in routes) {
                    // if (typeof routes[myVil][0][VillageName] !== "undefined"){
                        console.log(myVil);
                        for(var toVil in routes[myVil]) {
                            tableHeader += "<tr>";
                            tableHeader += "<td>Village</td>";
                            tableHeader += ("<td>to Coord</td>");
                            for(var prop in routes[myVil][toVil]) {
                                tableHeader += ("<td>" + prop + "</td>");
                            }
                            tableHeader += "</tr>";
                            break;
                        }
                        if(tableHeader.length > 0){
                            break;
                        }
                    // }
                }
                console.log("tableHeader");
                console.log(tableHeader);
                $("#content > table > thead").append(tableHeader);
    
                //tbody
                var tableBody = "";
                $("#sidebarBoxVillagelist").find("span.name").each(function(){
                    var myVil = $(this).html().replace(" ","-");
                    if (typeof routes[myVil] == "undefined") {
                        routes[myVil] = {};
                    }
                    for(var toVil in routes[myVil]) {
                        tableBody += "<tr class='hover'>";
                        tableBody += ("<td>" + myVil.replace("-"," ") + "</td>");
                        tableBody += ("<td>" + toVil + "</td>");
                        for(var prop in routes[myVil][toVil]) {
                            if(prop == "VillageName" ){
                                tableBody += ("<td>" + routes[myVil][toVil][prop] + "</td>");
                            }else{
                                tableBody += ("<td>" + Math.round(routes[myVil][toVil][prop]/24) + "</td>");
                            }
                        }
                        tableBody += "</tr>";
                    }
                })
                $("#content > table > tbody").append(tableBody);
                if (typeof(dTable) == "undefined"){
                    $("#content > table ").append("<tfoot><tr><th colspan='3' style=''>Total:</th><th></th><th></th><th></th><th></th></tr></tfoot>")
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
                                for(icol = 3; icol<= 6; icol++){
                                    // Total over all pages
                                    total = api
                                        .column( icol )
                                        .data()
                                        .reduce( function (a, b) {
                                            return intVal(a) + intVal(b);
                                        }, 0 );
                        
                                    // Total over this page
                                    pageTotal = api
                                        .column( icol, { page: 'current'} )
                                        .data()
                                        .reduce( function (a, b) {
                                            return intVal(a) + intVal(b);
                                        }, 0 );
                        
                                    // Update footer
                                    $( api.column( icol ).footer() ).html(
                                        ''+pageTotal //+' ('+ total +' total)'
                                    );
    
                                }
                            }
                        });
                    };
                    loadScript("https://cdn.datatables.net/1.10.22/js/jquery.dataTables.min.js", myPrettyCode);
                }
                
                return false;
            })

        }

        if($("div.villageList.production").length == 1){
            //--------------- GET this Current village's name ------------------------
            var village = $("input.villageInput").val();
            if (village == null){
                village = $("#villageName").html().trim();
            }
            village = village.replace(" ","-");
            
            //--------------------------- Search all out routes ----------------------
            // GET localStorage
            if(localStorage.getItem('Routes') == null) {
                // break;
            }
            var routes = JSON.parse(localStorage.getItem('Routes'));
            
            //Search all in routes
            var sum = {in : {r1:0, r2:0, r3:0, r4:0 },  out : { r1:0, r2:0, r3:0, r4:0 } };
            $("#sidebarBoxVillagelist").find("span.name").each(function(){
                var fromVil = $(this).html().replace(" ","-");
                if (typeof routes[fromVil] == "undefined") {
                    routes[fromVil] = {};
                }
                if(fromVil==village){
                    //get out routes
                    for(var toVil in routes[village]) {
                        console.log(routes[fromVil][toVil].VillageName);
                        for(i = 1; i <= 4; i++){
                            sum.out["r"+i] += routes[village][toVil]["r"+i];
                            console.log("r"+i + "+="+routes[village][toVil]["r"+i]);
                        }
                    }
                }else{
                    for(var toVil in routes[fromVil]) {
                        if (village == routes[fromVil][toVil].VillageName.replace(" ","-")){
                            console.log(routes[fromVil][toVil].VillageName);
                            for(i = 1; i <= 4; i++){
                                sum.in["r"+i] += routes[fromVil][toVil]["r"+i];
                                console.log("r"+i + "+="+routes[fromVil][toVil]["r"+i]);
                            }
                            // for(var toVil in routes[fromVil]) {
                            // }
                        };
                    }
                }
                // for(var fromVil in routes) {
                // }
            })
            for(i = 1; i <= 4; i++){
                sum.in["r"+i] = Math.round(sum.in["r"+i]/24) ;
                sum.out["r"+i] = Math.round(sum.out["r"+i]/24) ;
            }
            //populate table
            var newtd = "";
            var vilTotal = 0;
            for(i = 1; i <= 4; i++){
                var prod = $("#production").find("i.r"+i).closest("tr").find("td.num").html().trim();
                if (/[−-]/.test(prod)){
                    prod = -parseInt(prod.replace(/[^\x20-\x7E]/g, '').replace(/[-−]/g, ''));
                } else {
                    prod = +parseInt(prod.replace(/[^\x20-\x7E]/g, '').replace(/[-−]/g, ''));
                }
                /[−-]/.test($("#production").find("i.r3").closest("tr").find("td.num").html().replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim())
                newtd = "<td class='num' title='in:@in, out:@out, sum:@sum'>@res</td>"
                newtd = newtd.replace("@in",sum.in["r"+i]);
                newtd = newtd.replace("@out",sum.out["r"+i]);
                newtd = newtd.replace("@sum",sum.in["r"+i] - sum.out["r"+i]);
                newtd = newtd.replace("@res",prod + sum.in["r"+i] - sum.out["r"+i]);
                $("#production").find("i.r"+i).closest("tr").append(newtd)
                vilTotal += prod + sum.in["r"+i] - sum.out["r"+i] ;
            }
            $("#production").find("i.r"+i).closest("tr").append(newtd);
            $("#production > thead").attr("title","Village total: "+vilTotal);
            
        }
    });
}
// load jQuery and execute the main function
addJQuery(main);

