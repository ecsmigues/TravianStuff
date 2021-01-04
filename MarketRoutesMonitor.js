// ==UserScript==
// @name         Travian_MarketRoutesMonitor
// @version      0.2
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
        //******************************* if currently on the market *******************************
        if($("#build.gid17").length == 1 && $("div.favorKey0 > a.active").length == 1){
            // GET this Current village's name
            var village = $("input.villageInput").val();
            if (village == null){
                village = $("#villageName").html().trim();
            }
            // village = village.replace(" ","-");
    
    
            // Clear any previus values in localStorage for current comp
            var routes = {};
    
            // Populate localStorage
            $('#trading_routes > tbody > tr').each(function(){
                var act = $(this).find('td > input').prop("checked");
                if(act && $(this).find('td.desc > a.name').length>0){
                    var toVillage = $(this).find('td.desc > a.name').attr("href").split('?')[1].split('&new').pop();
                    if (typeof routes[toVillage] == "undefined") {
                        routes[toVillage] = {};
                        routes[toVillage].VillageName = $(this).find('td.desc > a.name').html();
                        routes[toVillage].r1 = 0;
                        routes[toVillage].r2 = 0;
                        routes[toVillage].r3 = 0;
                        routes[toVillage].r4 = 0;
                        routes[toVillage].update = Date.now();
                    }
                    var trips = $(this).find('td.trad').html().trim();
                    trips = trips.split("x").length == 2 ? parseInt(trips.split("x")[0]) : 1;
                    routes[toVillage].r1 += parseInt($(this).find('td.desc > div.res > div > i.r1').parent().find('span').html())*trips;
                    routes[toVillage].r2 += parseInt($(this).find('td.desc > div.res > div > i.r2').parent().find('span').html())*trips;
                    routes[toVillage].r3 += parseInt($(this).find('td.desc > div.res > div > i.r3').parent().find('span').html())*trips;
                    routes[toVillage].r4 += parseInt($(this).find('td.desc > div.res > div > i.r4').parent().find('span').html())*trips;
                }
            });
            
            // GET localStorage
            var objVil = {};
            if(localStorage.getItem(village) != null) {
                objVil = JSON.parse(localStorage.getItem(village));
            }else{
                objVil = {}
            }
            if (typeof objVil.routes == "undefined") {
                objVil.routes = {}
            }
            objVil.routes = routes;

            //Print localStorage
            console.log(village + " routes:");
            console.log(objVil);

            // SET localStorage
            localStorage.setItem(village, JSON.stringify(objVil))
            $("div.npcMerchant > button").css("color","blue");
        }

        //******************************* if currently on the overview *******************************
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
                
                // thead
                var tableHeader = "";
                tableHeader += "<tr>";
                tableHeader += "<td>Village</td>";
                tableHeader += ("<td>to Coord</td>");
                tableHeader += ("<td>ToVillage</td>");
                tableHeader += ("<td>r1</td>");
                tableHeader += ("<td>r2</td>");
                tableHeader += ("<td>r3</td>");
                tableHeader += ("<td>r4</td>");
                tableHeader += ("<td title='Age of this update in minutes'>upd</td>");
                tableHeader += "</tr>";
                
                // console.log("tableHeader");
                // console.log(tableHeader);
                $("#content > table > thead").append(tableHeader);
    
                //tbody
                var tableBody = "";
                $("#sidebarBoxVillagelist").find("span.name").each(function(){
                    
                    var myVil = $(this).html();//.replace(" ","-");

                    var objVil = {};
                    if(localStorage.getItem(myVil) != null) {
                        objVil = JSON.parse(localStorage.getItem(myVil));
                    }else{
                        console.log("no "+myVil )
                        return;
                    }
                    if (typeof objVil.routes == "undefined") {
                        return;
                    }
                    routes = objVil.routes;
                    // console.log(routes);

                    // if (typeof routes[myVil] == "undefined") {
                    //     routes[myVil] = {};
                    // }
                    for(var toVil in routes) {
                        tableBody += "<tr class='hover'>";
                        tableBody += ("<td>" + myVil + "</td>");
                        tableBody += ("<td>" + toVil + "</td>");
                        for(var prop in routes[toVil]) {
                            if(prop == "VillageName" ){
                                tableBody += ("<td>" + routes[toVil][prop] + "</td>");
                            }else if(prop == "update" ){
                                tableBody += ("<td>" + ((Date.now() - routes[toVil][prop])/1000/60).toFixed(1) + "</td>");
                            }else{
                                tableBody += ("<td>" + Math.round(routes[toVil][prop]/24) + "</td>");
                            }
                        }
                        
                        tableBody += "</tr>";
                    }
                })
                $("#content > table > tbody").append(tableBody);

                // Apply DataTables
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
        // ******************************* if currently on the dorf1 page *******************************
        if($("div.villageList.production").length == 1){
            //--------------- GET this Current village's name ------------------------
            var village = $("input.villageInput").val();
            if (village == null){
                village = $("#villageName").html().trim();
            }
            // village = village.replace(" ","-");
            
            //--------------------------- Search all in/out routes ----------------------
            $("#sidebarBoxVillagelist").find("span.name").each(function(){
                var myVil = $(this).html();//.replace(" ","-");
                var objVil = {};
                if(localStorage.getItem(myVil) != null) {
                    objVil = JSON.parse(localStorage.getItem(myVil));
                }else{
                    console.log("no "+myVil )
                    return;
                }
                if (typeof objVil.routes == "undefined") {
                    return;
                }
                routes = objVil.routes;
                // console.log(routes);

                // if (typeof routes[myVil] == "undefined") {
                //     routes[myVil] = {};
                // }
                // for(var toVil in routes) {
                //     tableBody += "<tr class='hover'>";
                //     tableBody += ("<td>" + myVil.replace("-"," ") + "</td>");
                //     tableBody += ("<td>" + toVil + "</td>");
                //     for(var prop in routes[toVil]) {
                //         if(prop == "VillageName" ){
                //             tableBody += ("<td>" + routes[toVil][prop] + "</td>");
                //         }else{
                //             tableBody += ("<td>" + Math.round(routes[toVil][prop]/24) + "</td>");
                //         }
                //     }
                //     tableBody += "</tr>";
                // }
            })


            var sum = {in : {r1:0, r2:0, r3:0, r4:0 },  out : { r1:0, r2:0, r3:0, r4:0 } };
            // --- for each item on the villgae list
            $("#sidebarBoxVillagelist").find("span.name").each(function(){
                // get routes for current item 
                var curVil = $(this).html();//.replace(" ","-");
                var objVil = {};
                if(localStorage.getItem(curVil) != null) {
                    objVil = JSON.parse(localStorage.getItem(curVil));
                }else{
                    console.log("no " + curVil );
                    objVil = {}
                    // return;
                }
                if (typeof objVil.routes == "undefined") {
                    routes = {};
                    // return;
                }
                routes = objVil.routes;
                
                if(curVil==village){
                    //get out routes
                    for(var toVil in routes) {
                        console.log(routes[toVil].VillageName);
                        for(i = 1; i <= 4; i++){
                            sum.out["r"+i] += routes[toVil]["r"+i];
                            console.log("r"+i + "+="+routes[toVil]["r"+i]);
                        }
                    }
                }else{
                    //get in routes
                    for(var toVil in routes) {
                        if (village == routes[toVil].VillageName){
                            console.log(routes[toVil].VillageName);
                            for(i = 1; i <= 4; i++){
                                sum.in["r"+i] += routes[toVil]["r"+i];
                                console.log("r"+i + "+="+routes[toVil]["r"+i]);
                            }
                            // for(var toVil in routes) {
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
        //******************************* if currently on the market *******************************
        if($("#build.gid17").length == 1 && $("div.favorKey0 > a.active").length == 1){
            // $(".buildingDescription > .description").append("<div id='timeline' style='height: 180px;'></div>")
            $("body").append("<a href='#timeline' id='drwtimeline'>Draw Chart</div>")
            $("body").append("<div id='timeline' style='height: 900px; margin: 30px;'></div>")

            // $(".tip-contents > div.text").html();
            $("#drwtimeline").click(function(){
                var times = [];
                var day = 1;
                $('#trading_routes > tbody > tr').each(function(){
                    var act = $(this).find('td > input').prop("checked");
                    if(act && $(this).find('td.desc > a.name').length>0){
                        var toVillage = $(this).find('td.desc > a.name').attr("href").split('?')[1].split('&new').pop();
                        var VillageName = $(this).find('td.desc > a.name').html();
                        // var desc = VillageName + " (" + toVillage + ")"
                        var strps = $(this).find('td.trad').html().trim();
                        var trips = strps.split("x").length == 2 ? parseInt(strps.split("x")[0]) : 1;
                        var mercads = strps.split("x").length == 2 ? parseInt(strps.split("x")[1]) : 1;
    
                        var start = $(this).find(".start > span");
                        hr1 = parseInt(start[0].innerHTML.split(":")[0]);
                        mn1 = parseInt(start[0].innerHTML.split(":")[1]);
                        var beg = new Date(0,0,0,hr1,mn1,0);
                        hr2 = parseInt(start[1].innerHTML.split(":")[0]);
                        mn2 = parseInt(start[1].innerHTML.split(":")[1]);
                        day = hr1>hr2?1:0;
                        var end = new Date(0,0,day,hr2,mn2 + 1,0);
                        var dur = (end - beg) * 2;
                        var end = new Date(beg.getTime() + dur);
                        day = 1;
                        if(end.getDay()>beg.getDay()){
                            // var end = new Date(0,0,1,hr2,mn2 + 1,0);
                            // var dur = (end - beg) * 2;
                            end = new Date(end-(1000*24*60*60));
                            for(var mi = 1; mi<= mercads; mi++){
                                times.push(["Day" + day,VillageName,beg,new Date(0,0,1,0,0,0)]);
                                times.push(["Day" + (day + 1) ,VillageName,new Date(0,0,0,0,0,0),end]);
                            }
                        }else{
                            // var end = new Date(0,0,0,hr2,mn2 + 1,0);
                            // var dur = (end - beg) * 2;
                            // var end = new Date(beg.getTime() + dur);
                            for(var mi = 1; mi<= mercads; mi++){
                                times.push(["Day" + day,VillageName,beg,end]);
                            }
                        }
                        var beg2 = beg;
                        var end2 = end;
                        for(var tr = 1; tr<trips;tr++ ){
                            console.log(tr + " :tr/trips: " + trips);
                            // for(var mi = 1; mi<= mercads; mi++){
                            //     times.push(["Day" + day,VillageName,new Date(beg.getTime()+dur*tr),new Date(end.getTime()+dur*tr)]);
                            // }
                            beg2 = new Date(beg2.getTime()+dur);
                            end2 = new Date(end2.getTime()+dur);
                            if (beg2.getDay() > beg.getDay() ){
                                beg2 = new Date(beg2-(1000*24*60*60));
                                day= day+1
                            }
                            if (end2.getDay() > end.getDay() ){
                                end2 = new Date(end2-(1000*24*60*60));
                            }
                            if(end2.getDay()>beg2.getDay()){
                                end2 = new Date(end2-(1000*24*60*60));
                                for(var mi = 1; mi<= mercads; mi++){
                                    times.push(["Day" + day,VillageName,beg2,new Date(0,0,1,0,0,0)]);
                                    times.push(["Day" + (day + 1) ,VillageName,new Date(0,0,0,0,0,0),end2]);
                                }
                            }else{
                                for(var mi = 1; mi<= mercads; mi++){
                                    times.push(["Day" + day,VillageName,beg2,end2]);
                                }
                            }
                        }
                    }
                });
                console.log(times);
    
    
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
                    google.charts.load('current', {'packages':['timeline']});
                    google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {
                        var container = document.getElementById('timeline');
                        var chart = new google.visualization.Timeline(container);
                        var dataTable = new google.visualization.DataTable();
                
                        dataTable.addColumn({ type: 'string', id: 'Lab' });
                        dataTable.addColumn({ type: 'string', id: 'Name' });
                        dataTable.addColumn({ type: 'date', id: 'Start' });
                        dataTable.addColumn({ type: 'date', id: 'End' });
                        dataTable.addRows(times);
                                var options = {
                        timeline: { groupByRowLabel: true }
                        };
                        chart.draw(dataTable);
                    }
    
                };
                loadScript("https://www.gstatic.com/charts/loader.js", myPrettyCode);
            });
        }
    });
}
// load jQuery and execute the main function
addJQuery(main);

