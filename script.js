$(document).ready(function() {

    function getData(pathName) {
        return $.ajax({
            type: 'get',
            url: 'http://solace.ist.rit.edu/~plgics/proxy.php',
            dataType: 'json',
            data: pathName,
            cache: false,
            async: true
        })
    }

    function myXhr(t, d, id) {
        return $.ajax({
            type: t,
            url: 'http://solace.ist.rit.edu/~plgics/proxy.php',
            dataType: 'json',
            data: d,
            cache: false,
            async: true
        }).fail(function() {
            //handle failure
        });
    }

    $("#toTop").click(function() {
        //1 second of animation time
        //body works for Chrome but not FFX
        //This strange selector seems to work universally
        $("html, body").animate({ scrollTop: 0 }, 1000);
    });


    getData({ path: '/about/' }).done(function(about) {


        $("#about").append(
            "<h2> " + about.title + " </h2><br> "
        )
        $("#about").append(
            "<p> " + about.description + " </p><br> "

        )
        $("#about").append(
            '<p> "' + about.quote + ' "</p> <br>' + "<p style = 'text-align:right'> -" + about.quoteAuthor + "</p>"
        )
    });


    let getDegree;
    getData({ path: '/degrees/undergraduate/' }).done(function(degrees) {
        $.each(degrees.undergraduate, function(index1, undergraduate) {
            getDegree = "<div class='column'>" +
                "<h4><b></b> " + undergraduate.title + "</h4>" +
                "<p><b>Degree Name:" + undergraduate.degreeName + "</b> </p>" +
                "<p><b>Description:</b> " + undergraduate.description + "</p>" +
                "<p><b>Concentrations:</b> " + undergraduate.concentrations + "</p>";

            $("#undergraduate").append(getDegree);

        });

    });

    let getGraduate;
    getData({ path: '/degrees/graduate/' }).done(function(degrees) {

        $.each(degrees.graduate, function(index1, graduate) {
            if (graduate.title != null) {
                getGraduate = "<div class='column'>" +
                    "<h4><b></b> " + graduate.title + "</h4>" +
                    "<p><b>Degree Name:" + graduate.degreeName + "</b> </p>" +
                    "<p><b>Description:</b> " + graduate.description + "</p>" +
                    "<p><b>Concentrations:</b> " + graduate.concentrations + "</p>";

                $("#graduate").append(getGraduate);

            } else if (graduate.availableCertificates != null) {
                getGraduate = "";
                getGraduate = "<div class='column'><h4>Degree Name: " + graduate.degreeName + "</h4>" +
                    "<p> Available Certificates: " + graduate.availableCertificates + "</p>";

                $("#graduate").append(getGraduate);
            }

        });

    });



    $(document).ready(function() {
        let degreeDetails;
        myXhr('get', { path: '/minors/' }, '#minors').done(function(json) {
            $.each(json, function(index, value) {

                for (let i = 0; i < value.length; i++) {
                    $("#minors").append("<h3>" + value[i].name + "</h3>")
                    degreeDetails = "<div>" +
                        "Title: " + value[i].title + "<br><br>" +
                        "Courses: " + value[i].courses + "<br><br>" +
                        "Description: " + value[i].description + "<br><br>" +
                        "Note: " + value[i].note + "<br>";

                    $("#minors").append(
                        degreeDetails
                    )

                }

            });


            $("#minors").accordion({
                collapsible: true,
                active: false,
                heightStyle: "content"
            });


        })
    })





    getData({ path: '/employment/' }).done(function(employment) {


        $("#introduction").append("<h2>Employment Information</h2>");

        $.each(employment.introduction.content, function(index1, value1) {
            $.each(value1, function(index2, value2) {
                if (index2 === 'title') {
                    $("#introduction").append('<h3>' + value2 + "</h3><br>");
                } else {
                    $("#introduction").append('<p>' + value2 + "</p><br>");
                }

            })
        });




        $.each(employment.degreeStatistics.statistics, function(index1, value1) {
            $("#degreeStatistics").append('<div id= "stat' + index1 + '">');

            $.each(value1, function(index2, value2) {

                if (index2 === 'value') {
                    $("#stat" + index1).append('<h4 id="value">' + value2 + "</h4><br>");
                } else {
                    $("#stat" + index1).append('<p>' + value2 + "</p>");
                }
            })
        });

        $("#employers").append("<h2>Employers</h2>");

        $.each(employment.employers.employerNames, function(index1, value1) {
            $("#employers").append(value1 + "</br>")
        });


        $("#careers").append("<h2>Careers</h2>");

        $.each(employment.careers.careerNames, function(index1, value1) {
            $("#careers").append(value1 + "</br>")
        });


        let coopInformation = employment.coopTable.coopInformation;

        $("#coopTable").jsGrid({
            width: "80%",
            height: "400px",

            inserting: false,
            editing: false,
            sorting: true,
            paging: true,

            data: coopInformation,

            fields: [
                { name: "employer", type: "text", width: 20, validate: "required" },
                { name: "degree", type: "text", width: 20 },
                { name: "city", type: "text", width: 20 },
                { name: "term", type: "text", width: 10 }
            ]
        });



        let employmentTable = employment.employmentTable.professionalEmploymentInformation;

        $("#employmentTable").jsGrid({
            width: "80%",
            height: "400px",

            inserting: false,
            editing: false,
            sorting: true,
            paging: true,

            data: employmentTable,

            fields: [
                { name: "employer", type: "text", width: 75, validate: "required" },
                { name: "degree", type: "text", width: 50 },
                { name: "city", type: "text", width: 50 },
                { name: "title", type: "text", width: 75 },
                { name: "startDate", type: "text", width: 50 }

            ]
        });


    });
    // chart
    //get data from professionalEmploymentInformation
    getData({
        path: '/employment/employmentTable/professionalEmploymentInformation/'
    }).done(function(output) {
        var names = [];
        for (let i = 0; i < output.professionalEmploymentInformation.length; i++) {
            names.push(output.professionalEmploymentInformation[i].degree);
        }
        /*
        var uniqueNames = [];
        $.each(names, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });*/
        var wmcbs = 1;
        var cmitbs = 1;
        var hcinms = 1;
        var netsysms = 1;
        var infotecbs = 1;
        var ansabs = 1;
        var netsysbs = 1;
        var infotecms = 1;
        var medinfobs = 1;
        var medinfoms = 1;
        var uniqueNames = [];
        $.each(names, function(i, el) {
            if ($.inArray(el, uniqueNames) === -1) {
                uniqueNames.push(el);
            } else {
                if (el === 'WMC-BS') {
                    wmcbs += 1;
                } else if (el === 'CMIT-BS') {
                    cmitbs += 1;
                } else if (el === 'HCIN-MS') {
                    hcinms += 1;
                } else if (el === 'NETSYS-MS') {
                    netsysms += 1;
                } else if (el === 'INFOTEC-BS') {
                    infotecbs += 1;
                } else if (el === 'ANSA-BS') {
                    ansabs += 1;
                } else if (el === 'NETSYS-BS') {
                    netsysbs += 1;
                } else if (el === 'INFOTEC-MS') {
                    infotecms += 1;
                } else if (el === 'MEDINFO-BS') {
                    medinfobs += 1;
                } else if (el === 'MEDINFO-MS') {
                    medinfoms += 1;
                }
            }
        });
        var dataNum = [wmcbs, cmitbs, hcinms, netsysms, infotecbs, ansabs,
            netsysbs, infotecms, medinfobs, medinfoms
        ];

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: uniqueNames,
                datasets: [{
                    label: 'Number of Student',
                    data: dataNum,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        $("#bar").click(function(event) {
            $("#myChart").remove();
            $("#char").append('<canvas id="myChart"></canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: uniqueNames,
                    datasets: [{
                        label: 'Number of Student',
                        data: dataNum,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 0, 0)',
                            'rgba(255, 51, 153 )',
                            'rgba(153, 102, 255)',
                            'rgba(0, 204, 255)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 0, 0)',
                            'rgba(255, 51, 153)',
                            'rgba(153, 102, 255)',
                            'rgba(0, 204, 255)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
        $("#pie").click(function(event) {
            $("#myChart").remove();
            $("#char").append('<canvas id="myChart" ></canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: uniqueNames,
                    datasets: [{
                        label: 'Number of Student',
                        data: dataNum,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 0, 0)',
                            'rgba(255, 51, 153)',
                            'rgba(153, 102, 255)',
                            'rgba(0, 204, 255)'
                        ],
                        hoverOffset: 2
                    }]
                },
            });
        });
        $("#doughnut").click(function(event) {
            $("#myChart").remove();
            $("#char").append('<canvas id="myChart" ></canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: uniqueNames,
                    datasets: [{
                        label: 'Number of Student',
                        data: dataNum,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 0, 0)',
                            'rgba(255, 51, 153)',
                            'rgba(153, 102, 255)',
                            'rgba(0, 204, 255)'
                        ],
                        hoverOffset: 2
                    }]
                },
            });
        });
    });




    let details;
    getData({ path: '/people/faculty/' }).done(function(data) {
        $.each(data.faculty, function(i, item) {

            details = "<div id='" + data.faculty[i].username + "'>" + "<img id='" + data.faculty[i].username + "' src=" + data.faculty[i].imagePath + " width='200' height='200'>" +
                "<p> Name: " + item.name + "</p>";
            $("#content").append(details);
        })

        // Add a "click" Event Listener for each <li> in the Faculty <ul>
        $("div").click(function() {

            // Get name of faculty member selected
            let liText = $(this).attr("id");

            // use data from "data.faculty" to get data for
            // selected faculty memberm and "build"
            for (let i = 0; i < data.faculty.length; i++) {
                if (data.faculty[i].username == liText) {

                    var divContent = "<div><ul>";

                    divContent += "<li ><font color='black'><b><u>Title:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.faculty[i].title + "</b></<li>"
                    divContent += "<li><font color='black'><b><u>Email:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.faculty[i].email + "</b></<li>"
                    divContent += "<li><font color='black'><b><u>Interest Area:</u>&nbsp;&nbsp;&nbsp;</font>" + data.faculty[i].interestArea + "</b></<li>"
                    divContent += "<li><font color='black'><b><u>Office:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.faculty[i].office + "</b></<li><br><br>"
                    divContent += "<img src =" + data.faculty[i].imagePath + " width='200' height='200'>";

                    divContent += "</ul></div>";

                    $("#dialog").html(divContent);
                    $("#dialog").dialog("option", "title", liText);
                    $("#dialog").dialog("open")
                    break;
                }
            }

        })


    }).fail(function(jqXHR) {
        // Consider using the jQueryUI "Dialog" widget to display errors
        $('#content').append(jqXHR.responseText);
    });

    $("#dialog").dialog({
        autoOpen: false,
        width: 600,
        buttons: [{
            text: "OK",
            icons: {
                primary: "ui-icon-heart"
            },
            click: function() {
                $("#dialog").dialog("close");
            }
        }]
    });



    let setValue;
    getData({ path: '/people/staff/' }).done(function(data) {
        $.each(data.staff, function(i, item) {
            setValue = "<div id='" + data.staff[i].username + "'>" + "<img id='" + data.staff[i].username + "' src=" + data.staff[i].imagePath + " width='200' height='200'>" +
                "<p> Name: " + item.name + "</p>";
            $("#content2").append(setValue);
        })

        // Add a "click" Event Listener for each <li> in the staff <ul>
        $("div").click(function() {
            // Get name of staffUL member selected
            let liText = $(this).attr("id");

            // use data from "data.Staff" to get data for
            // selected staff memberm and "build"
            for (let i = 0; i < data.staff.length; i++) {
                if (data.staff[i].username == liText) {

                    var divContent = "<div><ul>";

                    divContent += "<li><font color='black'><b><u>Title:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.staff[i].title + "</b></<li>"
                    divContent += "<li><font color='black'><b><u>Email:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.staff[i].email + "</b></<li>"
                    divContent += "<li><font color='black'><b><u>Office:</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>" + data.staff[i].office + "</b></<li><br><br>"
                    divContent += "<img src =" + data.staff[i].imagePath + " width='200' height='200'>";

                    divContent += "</ul></div>";

                    $("#dialog2").html(divContent);
                    $("#dialog2").dialog("option", "title", liText);
                    $("#dialog2").dialog("open")
                    break;
                }
            }

        })


    }).fail(function(jqXHR) {
        // Consider using the jQueryUI "Dialog" widget to display errors
        $('#content2').append(jqXHR.responseText);
    });

    $("#dialog2").dialog({
        autoOpen: false,
        width: 600,
        buttons: [{
            text: "OK",
            icons: {
                primary: "ui-icon-heart"
            },
            click: function() {
                $("#dialog2").dialog("close");
            }
        }]
    });





    getData({ path: '/research/byInterestArea/' }).done(function(data) {


        let unordList = "<ul>";
        unordList.id = "unorderList";

        $.each(data.byInterestArea, function(index, value) {


            unordList = unordList + "<li><a href=#div" + index + ">" + value.areaName + "</a></li>"

        });


        unordList = unordList + "</ul>"


        $("#research_byInterestArea").append(unordList);

        let divs = '';
        $.each(data.byInterestArea, function(index, value) {

            divs = divs + '<div id=div' + index + '>' + value.citations + '</div>';

        });

        $("#research_byInterestArea").append(divs);
        $("#research_byInterestArea").tabs({ heightStyle: "fill" });


    });


    getData({ path: '/research/byFaculty/' }).done(function(data) {
        let unordListFa = "<ul>";
        unordListFa.id = "unorderListFa";
        $.each(data.byFaculty, function(index, value) {
            unordListFa = unordListFa + "<li><a href=#divdd" + index + ">" + value.facultyName + "</a></li>"
        });

        unordListFa = unordListFa + "</ul>"
        $("#research_byFaculty").append(unordListFa);

        let divsF = '';
        $.each(data.byFaculty, function(index, value) {
            divsF = divsF + '<div id=divdd' + index + '>' + value.citations + '</div>';
        });

        $("#research_byFaculty").append(divsF);
        $("#research_byFaculty").tabs({ heightStyle: "fill" });

    });


    getData({ path: '/resources/coopEnrollment/' }).done(function(data) {

        $.each(data.coopEnrollment, function(index1, value1) {

            if (typeof value1 === 'object' && value1 !== null) {

                $.each(value1, function(index2, value2) {

                    if (typeof value2 === 'object' && value2 !== null) {

                        $.each(value2, function(index3, value3) {
                            if (index3 === "title") {
                                $('#resources_coopEnrollment').append('<h3>' + value3 + '</h3');


                            } else if (index3 === "description") {
                                $('#resources_coopEnrollment').append('<div><p>' + value3 + '</p></div>');

                            }
                        });

                    }

                });
            }
        });

        $("#resources_coopEnrollment").append("<br>");
        $("#resources_coopEnrollment").accordion({
            collapsible: true,
            heightStyle: "content"
        });




    });




    let setAboard;
    getData({ path: '/resources/studyAbroad/' }).done(function(data) {
        $("#resources_studyAbroad").append('<h2>' + data.studyAbroad.title + '</h2>');
        $("#resources_studyAbroad").append('<p>' + data.studyAbroad.description + '</p><br>');
        $.each(data.studyAbroad.places, function(index1, place) {
            setAboard = "<div class = 'aboardDiv'><h3> Name of Place: " + data.studyAbroad.places[index1].nameOfPlace + "</h3>" +
                "<p>" + data.studyAbroad.places[index1].description + "</p><br>";

            $("#studyAbroad").append(setAboard);

        });


    });

    getData({ path: '/resources/studentServices/' }).done(function(data) {

        $.each(data.studentServices, function(index1, value1) {
            if (value1.title == 'Academic Advisors') {
                $.each(data.studentServices.academicAdvisors, function(index2, value2) {
                    if (typeof value2 === 'object' && value2 !== null) {
                        $('#acad').append('<a href=\"' + data.studentServices.academicAdvisors.faq.contentHref + '\"> ' + data.studentServices.academicAdvisors.faq.title);
                    } else {
                        if (index2 === 'description') {
                            $('#resources_studentServices').append('<div id= "acad"><p>' + value2 + "</p><br>");
                        } else {
                            $('#resources_studentServices').append('<h3>' + value2 + "</h3>");
                        }

                    }

                });
            } else if (value1.title == 'Professonal Advisors') {
                $.each(data.studentServices.professonalAdvisors, function(index2, value2) {
                    if (typeof value2 === 'object' && value2 !== null) {
                        $.each(value2, function(index3, value3) {
                            if (typeof value3 === 'object' && value3 !== null) {

                                $.each(value3, function(index4, value4) {
                                    $('#profa').append('<b>' + index4 + ': </b>' + value4 + "<br>");

                                });
                                $('#profa').append('<br>');

                            } else {
                                $('#profa').append(value3 + '<br>');

                            }

                        });


                    } else {
                        if (index2 === 'description') {
                            $('#profa').append('<p><b>' + index2 + ': </b>' + value2 + "</p><br>");
                        } else {
                            $('#resources_studentServices').append('<h3>' + value2 + "</h3> <div id='profa'>");
                        }

                    }

                });
            } else if (value1.title == 'Faculty Advisors') {
                $.each(data.studentServices.facultyAdvisors, function(index2, value2) {

                    if (index2 === 'description') {
                        $('#fafa').append('<p>' + value2 + "</p><br>");
                    } else {
                        $('#resources_studentServices').append('<h3>' + value2 + "</h3> <div id='fafa'>");
                    }


                });
            } else if (value1.title == 'IST Minor Advising') {
                $.each(data.studentServices.istMinorAdvising, function(index2, value2) {
                    if (typeof value2 === 'object' && value2 !== null) {
                        $.each(value2, function(index3, value3) {
                            if (typeof value3 === 'object' && value3 !== null) {
                                $.each(value3, function(index4, value4) {
                                    $('#istfa').append('<b>' + index4 + ': </b>' + value4 + "<br>");

                                });
                                $('#istfa').append('<br>');
                            } else {
                                $('#istfa').append(value3 + '<br>');

                            }

                        });


                    } else {
                        if (index2 === 'description') {
                            $('#istfa').append('<p><b>' + index2 + ': </b>' + value2 + "</p><br>");
                        } else {
                            $('#resources_studentServices').append('<h3>' + value2 + "</h3> <div id='istfa'>");
                        }

                    }

                });
            }


        });

        $("#resources_studentServices").append("<br>");
        $("#resources_studentServices").accordion({
            collapsible: true,
            heightStyle: "content"
        });




    });

    getData({ path: '/resources/studentAmbassadors/' }).done(function(data) {

        $.each(data.studentAmbassadors, function(index1, value1) {

            if (typeof value1 === 'object' && value1 !== null) {

                $.each(value1, function(index2, value2) {

                    if (typeof value2 === 'object' && value2 !== null) {

                        $.each(value2, function(index3, value3) {
                            if (index3 === "title") {
                                $('#resources_tutorsAndLabInformation').append('<h3>' + value3 + '</h3');


                            } else if (index3 === "description") {
                                $('#resources_tutorsAndLabInformation').append('<div><p>' + value3 + '</p></div>');

                            }
                        });

                    }

                });
            }
        });

        $("#resources_tutorsAndLabInformation").append("<br>");
        $("#resources_tutorsAndLabInformation").accordion({
            collapsible: true,
            heightStyle: "content"
        });





    });






    getData({ path: '/footer/' }).done(function(footer) {


        $.each(footer, function(index1, value1) {

            if (index1 == 'social') {
                $.each(footer.social, function(index2, value2) {
                    if (index2 == "twitter") {
                        $("#social").append('<b> <a style = "color:white" href = "' + value2 + '"><i class="fa fa-twitter"><br>twitter</i></a>');
                    }
                    if (index2 == "facebook") {
                        $("#social").append('</b> <a style = "color:white" href = "' + value2 + '"> <i class="fa fa-facebook"><br>Facebook</i></a>');
                    }
                });
            }

            if (index1 == 'quickLinks') {
                $.each(footer.quickLinks, function(index2, value2) {
                    $("#quickLinks").append('<a style = "color:white" href = "' + value2.href + '"> ' + value2.title + '</a><br>');
                });
            }


            if (index1 == 'copyright') {
                $("#copyright").append('<p>' + footer.copyright.html + '</p>');
            }




        });
    });



    $(document).ready(function() {
        let degreeDetails;
        myXhr('get', { path: '/courses/' }, '#courses').done(function(json) {
            $.each(json, function(index, value) {

                $("#courses").append("<h3>" + value.degreeName + "</h3>")
                degreeDetails = "<div>" +
                    "semester: " + value.semester + "<br><br>" +
                    "courses: " + value.courses + "<br>";

                $("#courses").append(
                    degreeDetails
                )



            });


            $("#courses").accordion({
                collapsible: true,
                active: false,
                heightStyle: "content"
            });


        })
    })



    $("#maps").append(" <iframe src='http://ist.rit.edu/api/map.php' allowfullscreen > </iframe>  ");




});