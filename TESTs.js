
                
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
                    $('#overview').DataTable({
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