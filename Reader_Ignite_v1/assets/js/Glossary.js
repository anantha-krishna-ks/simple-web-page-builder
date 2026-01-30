var bookTxt = "";
$(document).ready(function () {

    var currentPage = Number(AudConfig.CurrPageNo + 1);
    var startPage = Number(AudConfig.BookStartPrintPageNo);
    var totalPages = Number(AudConfig.BookLastPrintPageNo); //AudConfig.BookLastPrintPageNo - AudConfig.BookStartPrintPageNo;

    // console.log(AudConfig.CurrPageNo+"----"+startPage+"---"+totalPages)

    $.ajax({
        url: 'assets/data/bookText.json',
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            bookTxt = response;
        },
        error: function (xhr) {
            //xhr.responseText
            alert("You need to host this application on server. Thanks");
        }
    });

    $('.closeGlossaryTab').click(function (e) {
        $('.blackback').css('display', 'none');
        $('.GlossaryDetails').css('display', 'none');
        EnableAllTool();
        DeselectAllTool();
    })

    enableGlossary = function () {
        $('.blackback').css('display', 'block');
        $('.gamePopup, .panelBG, .GlossaryDetails').css('display', 'block');
        $('.GlossaryResult').html('');

        for (var j = 0; j < bookTxt.glossary.length; j++) {
            var glossaryMeaning = bookTxt.glossary[j].description;
            var glossaryWords = bookTxt.glossary[j].text;
            $(".GlossaryResult").append("<p class='glossaryText'><span class='glossarywords'>" + glossaryWords + "</span>: " + glossaryMeaning + "</p>");
        }
        SelectTool("IcGlossary");
        UnbindNoteEventFromPage(); //remove note crosshair cursor
    }

    glossarySearch = function () {
        var input, filter, div, ptag, a, i, txtValue;
        input = document.getElementById("searchBox_glo");
        filter = input.value.toUpperCase();
        div = document.getElementById("GlossaryResult");
        ptag = div.getElementsByTagName("P");
        for (i = 0; i < bookTxt.glossary.length; i++) {
            var glcont = bookTxt.glossary[i].text;
            if (glcont.toUpperCase().indexOf(filter) > -1) {
                ptag[i].style.display = "";
            } else {
                ptag[i].style.display = "none";
            }
        }
    }









    /* Read mode popup start*/
    var textzoom = false;
    var color = 0;

    zoompopup = function () {
        startPage = Number(AudConfig.BookStartPrintPageNo);
        // currentPage = Number(AudConfig.CurrPageNo + 1);       
        // var pagenum = AudConfig.BookStartPrintPageNo;
        // pagenum = Number(pagenum + currentPage);
        // currentPage = pagenum;

        //var view = "double";

        // if (view == "single") {
        //     document.getElementById('slidecontainer1').contentWindow.audioStop();
        // } else {
        //     document.getElementById('slidecontainer1').contentWindow.audioStop();
        //     document.getElementById('slidecontainer2').contentWindow.audioStop();
        // }
        if (textzoom == true) {
            return;
        }
        if (AudConfig.BookLayout === "magazine") {
            currentPage = Number(AudConfig.CurrPageNo + 1);       
            var pagenum = AudConfig.BookStartPrintPageNo;
            pagenum = Number(pagenum + currentPage);
            currentPage = pagenum;
            //console.log("double");
            textzoom = true;
            $('.popup').css('display', 'block');
            $('.singleviewcont').css('display', 'none');
            //console.log("currentPage--" + currentPage);


            var pagecont = bookTxt['page' + currentPage].text;
            var bgcolor = bookTxt['page' + currentPage].bgcolor;
            for (var j = 0; j < pagecont.length; j++) {
                $(".rightpagecont").append("<p class='a " + bgcolor[j] + "'>" + pagecont[j] + "</p><p class='lineBreak'> </p>");
            }
            var pageno = currentPage - 1;
            if (startPage <= pageno) {
                var pagecont = bookTxt['page' + pageno].text;
                var bgcolor = bookTxt['page' + pageno].bgcolor;
                for (var j = 0; j < pagecont.length; j++) {
                    $(".leftpagecont").append("<p class='a " + bgcolor[j] + "'>" + pagecont[j] + "</p><p class='lineBreak'> </p>");
                }
            }
            SelectTool("IcReadmode");

        } 
        else {
            //console.log("single");
            currentPage = Number(AudConfig.CurrPageNo);
            var pagenum = AudConfig.BookStartPrintPageNo;
            pagenum = Number(pagenum + currentPage);
            currentPage = pagenum;

            //console.log(currentPage, pagenum)

            if (startPage <= currentPage) {
                if (currentPage == AudConfig.BookStartPrintPageNo) {
                    currentPage = Number(AudConfig.CurrPageNo);

                    var pagenum = AudConfig.BookStartPrintPageNo;
                    pagenum = Number(pagenum + currentPage);
                    currentPage = pagenum;

                    $('.popup').css('display', 'block');
                    $('.singleviewcont').css('display', 'block');
                    textzoom = true;
                    var pagecont = bookTxt['page' + currentPage].text;
                    var bgcolor = bookTxt['page' + currentPage].bgcolor;
                    for (var j = 0; j < pagecont.length; j++) {
                        $(".singleviewcont").append("<p class='a " + bgcolor[j] + "'>" + pagecont[j] + "</p><p class='lineBreak'> </p>");
                        $('.line').css('width', '878px');
                    }

                    //console.log(startPage, currentPage);
                } 
                else {
                    $('.popup').css('display', 'block');
                    $('.singleviewcont').css('display', 'block');
                    textzoom = true;
                    var pagecont = bookTxt['page' + currentPage].text;
                    var bgcolor = bookTxt['page' + currentPage].bgcolor;
                    for (var j = 0; j < pagecont.length; j++) {
                        $(".singleviewcont").append("<p class='a " + bgcolor[j] + "'>" + pagecont[j] + "</p><p class='lineBreak'> </p>");
                        $('.line').css('width', '878px');
                    }
                    //console.log(startPage, currentPage);
                }
                SelectTool("IcReadmode");

            } 
            else {
                closeZoomup();                
            }
        }

        UnbindNoteEventFromPage(); //remove note crosshair cursor
    }

    closeZoomup = function () {
        textzoom = false;
        $('.popup,.singleviewcont').css('display', 'none');
        $(".rightpagecont").html('');
        $(".leftpagecont").html('');
        $(".singleviewcont").html('');
        EnableAllTool();
        DeselectAllTool();
    }
    /* Read mode popup end*/


    /* search feature methods */
    enablesearch = function () {
        // closeFeatureWindow();
        SelectTool("IcSearch");
        $('.blackback').css('display', 'block');
        $('.gamePopup, .panelBG, .featureDetails').css('display', 'block');
        $('#featureTitle').html('Search');
        $('#icon').attr('class', 'title_icon searchIcon');
        $('.featureData').html('');
        $('.featureData').append('<div class="searchLabel">Search keyword</div>');
        $('.featureData').append('<input type="search" class="searchBox" id="searchBox" placeholder="Enter search keyword here">');
        $('.featureData').append('<div class="searchBtn" onclick="searchBook()"></div><div class="searchResult allowScroll" id="searchResult"></div>');
        $('#searchBox').on("change paste keyup", function () {
            if ($('.searchBox').val() !== '') {
                searchBook();
            } else {
                $('#searchResult').html('');
            }
        });
        UnbindNoteEventFromPage(); //remove note crosshair cursor
    }

    function searchBook() {

        if (AudConfig.BookLayout === "magazine") {
            startPage = Number(AudConfig.BookStartPrintPageNo);
            totalPages = Number(AudConfig.BookLastPrintPageNo);
            var key = $('.searchBox').val().toLowerCase();
            var searchList = [];
            $('#searchResult').html('');
            for (var i = startPage + 1; i <= totalPages; i++) {

                // try {
                for (var j = 0; j < bookTxt['page' + i].text.length; j++) {
                    if (bookTxt['page' + i].text[j].toLowerCase().indexOf(key) > -1) {
                        var index = bookTxt['page' + i].text[j].toLowerCase().indexOf(key);
                        var keyTxt = bookTxt['page' + i].text[j].substring(index, (key.length + index));

                        var pagenum = AudConfig.BookStartPrintPageNo;
                        pagenum = Number(i - pagenum);

                        var regex = new RegExp(keyTxt, "g");

                        $('#searchResult').append('<div class="clear"><div class="pageNum" onmousedown="gotoSelectedPage(' + pagenum + ')">Page ' + i + ': </div><div class="textFoundAt" id="txtLine' + i + '_' + j + '" onclick="navigateTopage(' + pagenum + ')">' + bookTxt['page' + i].text[j] + '</div></div>');
                        $('#txtLine' + i + '_' + j).html($('#txtLine' + i + '_' + j).html().replace(regex, ('<strong>' + keyTxt + '</strong>')));
                    }
                }
                // } catch (error) {

                // }
            }
        } else {

            startPage = Number(AudConfig.BookStartPrintPageNo);
            totalPages = Number(AudConfig.BookLastPrintPageNo);
            var key = $('.searchBox').val().toLowerCase();
            var searchList = [];
            $('#searchResult').html('');
            for (var i = startPage + 1; i <= totalPages; i++) {

                // try {
                for (var j = 0; j < bookTxt['page' + i].text.length; j++) {
                    if (bookTxt['page' + i].text[j].toLowerCase().indexOf(key) > -1) {
                        var index = bookTxt['page' + i].text[j].toLowerCase().indexOf(key);
                        var keyTxt = bookTxt['page' + i].text[j].substring(index, (key.length + index));

                        var pagenum = AudConfig.BookStartPrintPageNo;
                        pagenum = Number(i - pagenum + 1);

                        var regex = new RegExp(keyTxt, "g");

                        $('#searchResult').append('<div class="clear"><div class="pageNum" onmousedown="gotoSelectedPage(' + pagenum + ')">Page ' + i + ': </div><div class="textFoundAt" id="txtLine' + i + '_' + j + '" onclick="navigateTopage(' + pagenum + ')">' + bookTxt['page' + i].text[j] + '</div></div>');
                        $('#txtLine' + i + '_' + j).html($('#txtLine' + i + '_' + j).html().replace(regex, ('<strong>' + keyTxt + '</strong>')));
                    }
                }
                // } catch (error) {

                // }
            }
        }
    }


    $('.closeFeatureTab').click(function (e) {
        $('.blackback').css('display', 'none');
        $('.gamePopup, .panelBG, .featureDetails').css('display', 'none');
        EnableAllTool();
        DeselectAllTool();
    })

  


    /* End search feature methods */


    // help start

    closeHelp = function () {
        $('#blackWall, #helpContent_2, #btns_info,#pagenumimg').css('display', 'none');
        $('#blackWall, #helpContent, #btns_info,#pagenumimg').css('display', 'none');
        $('#div_toc').css('display', 'none');
        $('#div_notetaking').css('display', 'none');
        $('#div_bookmark').css('display', 'none');
        $('#div_activity').css('display', 'none');
        $('#div_search').css('display', 'none');
        $('#div_highlight, #div_highlight_IOS').css('display', 'none');
        $('#div_goto').css('display', 'none');
        $('#div_singlepage').css('display', 'none');
        $('#div_textsize').css('display', 'none');
        $('#div_navigate').css('display', 'none');
        $('#div_navigate1').css('display', 'none');
        $('#div_game').css('display', 'none');
        $('#div_help').css('display', 'none');
        $('.ieinfo').css('display', 'none');
        $('#div_glossary').css('display', 'none');
        $('#div_readmode').css('display', 'none');
        $('#div_togglefeatures').css('display', 'none');

        $('#div_pen').css('display', 'none');
        $('#div_zoonInOut').css('display', 'none');
        $('#div_more').css('display', 'none');

        $('#div_thumbnailIcn').css('display', 'none');
        $('#div_spotlight').css('display', 'none');
        $('#div_mask').css('display', 'none');
        $('#div_toggleAudioInfo').css('display', 'none');

        $("#div_audioSpeed").css('display', 'none');

        FirstTimeHelpClose(); // from pageController        
    }

    openHelp = function () {

        if (AudConfig.ToolMenuID == 0) {
            $('#blackWall, #helpContent, #btns_info').css('display', 'block');
        }
        if (AudConfig.ToolMenuID == 1) {
            $('#blackWall, #helpContent_2, #btns_info').css('display', 'block');
        }

        UnbindNoteEventFromPage(); //remove note crosshair cursor
    }

    feature_info = function (divclss) {
        $('#div_notetaking').css('display', 'none');
        $('#div_glossary').css('display', 'none');
        $('#div_readmode').css('display', 'none');
        $('#div_togglefeatures').css('display', 'none');

        $('#div_toc, #btns_info').css('display', 'none');
        $('#div_bookmark').css('display', 'none');
        $('#div_activity').css('display', 'none');
        $('#div_search').css('display', 'none');
        $('#div_highlight, #div_highlight_IOS').css('display', 'none');
        $('#div_goto').css('display', 'none');
        $('#div_singlepage').css('display', 'none');
        $('#div_textsize').css('display', 'none');
        $('#div_navigate').css('display', 'none');
        $('#div_navigate1').css('display', 'none');
        $('#div_game').css('display', 'none');
        $('#div_help').css('display', 'none');

        $('#div_pen').css('display', 'none');
        $('#div_zoonInOut').css('display', 'none');
        $('#div_more').css('display', 'none');

        $('#div_thumbnailIcn').css('display', 'none');
        $('#div_spotlight').css('display', 'none');
        $('#div_mask').css('display', 'none');
        $('#div_toggleAudioInfo').css('display', 'none');
        $("#div_audioSpeed").css('display', 'none');



        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (navigator.userAgent.match(/iPad/i) != null)) {
            if (divclss == '#div_highlight') {
                divclss = '#div_highlight_IOS';
            }
        }
        $(divclss).css('display', 'block');
    }



    // help end

});