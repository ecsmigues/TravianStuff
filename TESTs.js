
                // $(".buildingDescription > .description").append("<div id='timeline' style='height: 180px;'></div>")
                $("#bodyWrapper").append("<div id='timeline' style='height: 900px;'></div>")

                // $(".tip-contents > div.text").html();
                var times = [];
                $('#trading_routes > tbody > tr').each(function(){
                    var act = $(this).find('td > input').prop("checked");
                    if(act && $(this).find('td.desc > a.name').length>0){
                        var toVillage = $(this).find('td.desc > a.name').attr("href").split('?')[1].split('&new').pop();
                        var VillageName = $(this).find('td.desc > a.name').html();
                        // var desc = VillageName + " (" + toVillage + ")"
                        var trips = $(this).find('td.trad').html().trim();
                        trips = trips.split("x").length == 2 ? parseInt(trips.split("x")[0]) : 1;

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
                        if(end.getDay()>beg.getDay()){
                            // var end = new Date(0,0,1,hr2,mn2 + 1,0);
                            // var dur = (end - beg) * 2;
                            end = new Date(end-(1000*24*60*60));
                            times.push(["Merc",VillageName,beg,new Date(0,0,1,0,0,0)]);
                            times.push(["Merc",VillageName,new Date(0,0,0,0,0,0),end]);
                        }else{
                            // var end = new Date(0,0,0,hr2,mn2 + 1,0);
                            // var dur = (end - beg) * 2;
                            // var end = new Date(beg.getTime() + dur);
                            times.push(["Merc",VillageName,beg,end]);
                        }
                        for(var tr = 1; tr<trips;tr++ ){
                            console.log(tr + " :tr/trips: " + trips);
                           times.push(["Merc",VillageName,new Date(beg.getTime()+dur*tr),new Date(end.getTime()+dur*tr)]);
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

