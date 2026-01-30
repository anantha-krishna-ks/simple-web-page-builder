/*! Reader v0.2 */

//const { setTimeout } = require("timers/promises");
//config.arrChapPageNo = config.pageCount;
var LastPagePos = "L"; // "L": Left, "R": Right
var ChapterIndex = 0;
//var ArrChapPageNo = config.arrChapPageNo;
var ArrChapPageNo = [config.pageCount];
//ArrChapPageNo.push(config.pageCount);
var ContPgClassName = ["leftPage", "rightPage"];
!(function () {
  var reader = {
    LAYOUT_PRESENTATION: "presentation",
    LAYOUT_MAGAZINE: "magazine",
    SELECT_SELECT: "select",
    SELECT_PAN: "pan",
    ZOOM_FITPAGE: "fitpage",
  },
    json,
    pageCount,
    viewerDOM,
    pageBounds,
    currenPage = 0,
    isMobile,
    layout = AudConfig.BookLayout; // "magazine", // presentation | magazine
  lastPage = 0,
    //Mask Variable
    isMaskOpen = false;
  isActPopupOpen = false;
  LoginTime = 0;
  LogoutTime = 0;
  SessionTime = 0;
  CHAPTERNAME = 'ch12';

  pageEven = function () {
    var t = [0];
    for (var i = 1; i <= config.pagecount; i++) {
      if (i % 2 === 0) {
        t.push(i);
      }
    }

    return t;
  };

  goToPage = function (dir) {
    $("#dropMenu").removeClass("open");

    var prEvBtn = $("#prEvBtn"), neXtBtn = $("#neXtBtn");

    //if (dir === 'back' && currenPage === 0) return;
    if (dir === "next") {
      if (layout === "magazine") {
        if (currenPage + 2 >= pageCount) return;
      }
      else {
        if (LastPagePos == "L") {
          if (currenPage === pageCount - 1) return;
          if (currenPage === pageCount - 2 && layout === "presentation") return; // IF Single page view and last page blank
        }
        else {
          if (currenPage === pageCount - 1) return;
          if (currenPage === pageCount - 1 && layout === "presentation") return; // IF Single page view and last page blank
        }
      }
    }

    var step = 1;
    if (layout === "magazine") step = 2;

    if (dir === "back") {
      currenPage -= step;
      reader.HideMaskOnPageChange();
      reader.ShowMaskOnPageChange();
    }
    if (dir === "next") {
      currenPage += step;
      reader.HideMaskOnPageChange();
      reader.ShowMaskOnPageChange();
    }

    //viewerDOM.innerHTML = "";
    viewerDOM.classList.remove("magazine", "presentation");
    viewerDOM.classList.add(layout);

    // Buttons state
    neXtBtn.removeClass("disable");
    prEvBtn.removeClass("disable");
    //console.log(LastPagePos)
    if (LastPagePos == "L") {
      if (currenPage === pageCount - 2) {
        neXtBtn.addClass("disable");
      }
    }
    else {
      if (layout === "magazine") {
        if (currenPage === pageCount - 2) {
          neXtBtn.addClass("disable");
        }
      }
      else {
        if (currenPage === pageCount - 1) {
          neXtBtn.addClass("disable");
        }
      }
    }
    //console.log(currenPage);
    //reader.loadPages(currenPage);




    //if (currenPage === 0 || currenPage === 1 && layout === "presentation") { prEvBtn.addClass('disable'); };
    if (currenPage === 0 && layout === "presentation") {
      prEvBtn.addClass("disable");
    }
    if (currenPage === 0 || (currenPage === 1 && layout === "magazine")) {
      prEvBtn.addClass("disable");
    }
    stopLinkAudio();
    //console.log(currenPage);
    AudConfig.CurrPageNo = currenPage;

    ResetAllPageAudData();

    //console.log(AudConfig.CurrPageNo);
    //ResetZoom();

    ShowCurrentPage(currenPage);
    //SendSusData(); //send data to SCORM

    StopAllPageAudio();
  };

  reader.setup = function (json) {
    json || (json = config),
      (isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));

    pageCount = json.pagecount;
    pageBounds = json.bounds;
    viewerDOM = document.getElementById("viewer");

    GenerateAllIFrames();

    $("#LabelPageNo").html("");
    //$("#LabelPageNo").html(" / " + AudConfig.BookLastPrintPageNo);
    $("#LabelPageNo").html(AudConfig.BookLastPrintPageNo);

    $("#viewer").addClass(layout);

    // // Load all pages
    // for (var i = 0; i <= pageCount; i++) {
    //   var G = document.createElement("div");
    //   (G.id = "page" + i),
    //   // G.setAttribute(
    //   //   "style",
    //   //   "width: " +
    //   //     pageBounds[i - 1][0] +
    //   //     "px; height: " +
    //   //     pageBounds[i - 1][1] +
    //   //     "px;"
    //   // ),
    //   (G.className = "page"),
    //   viewerDOM.appendChild(G);

    //   reader.creatIFrames(G, i); // Input pages in iFrame
    // }
  };

  /*-- Generate All IFrames : Starts --*/

  function HideAllPages() {
    for (var i = 0; i < config.pagecount; i++) {
      $("#page" + i).addClass("ClsHideAllPages");
    }
  }

  function ShowCurrentPage(CPageNo) {
    HideAllPages();
    if (layout === "magazine") {
      if (CPageNo == config.pagecount - 1) {
        $("#page" + CPageNo).removeClass("ClsHideAllPages");
      }
      else {
        $("#page" + CPageNo).removeClass("ClsHideAllPages");
        $("#page" + (CPageNo + 1)).removeClass("ClsHideAllPages");
      }
    }
    else if (layout === "presentation") {
      if (CPageNo == config.pagecount - 1) {
        $("#page" + CPageNo).removeClass("ClsHideAllPages");
      }
      else {
        $("#page" + CPageNo).removeClass("ClsHideAllPages");
        //$("#page"+(CPageNo+1)).removeClass("ClsHideAllPages");
      }
    }

    LoadPageItems();
  }

  function GenerateAllIFrames() {
    for (var i = 0; i < config.pagecount; i++) {
      var G = document.createElement("div");
      G.id = "page" + i;
      if (i % 2 == 0) {
        G.className = "page " + ContPgClassName[0];
      }
      else if (i % 2 == 1) {
        G.className = "page " + ContPgClassName[1];
      }
      viewerDOM.appendChild(G);

      var iFraMe = document.createElement("iframe");
      iFraMe.setAttribute("class", "page-inner");
      iFraMe.setAttribute("src", "assets/data/pages/" + i + ".html");
      iFraMe.setAttribute(
        "style",
        "width: " +
        pageBounds[i][0] +
        "px; height: " +
        pageBounds[i][1] +
        "px; position: relative; border: 0;"
      );

      G.appendChild(iFraMe);

      $(iFraMe).contents().on("click", function (e) {
        //console.log(e);
        getLinkFromPage(e);
      });


    }

    HideAllPages();


    // lastPage = leftPage;
    //   if (leftPage % 2 !== 0) {
    //     //console.log(leftPage);
    //   }
    //   if (leftPage === 0) {
    //     //console.log(0);
    //   }


    //   var tmpCnt = 0;

    //   //console.log(layout);
    //   // Load all pages
    //   //console.log(leftPage, leftPage+1);
    //   for (var i = leftPage; i <= leftPage + 1; i++) {
    //     var G = document.createElement("div");
    //     (G.id = "page" + i),
    //       (G.className = "page " + className[tmpCnt]),
    //       viewerDOM.appendChild(G);
    //     tmpCnt++;
    //     reader.creatIFrames(G, i); // Input pages in iFrame
    //   }

    //   $("#LabelPageNo").html("");
    //   $("#LabelPageNo").html(" / " + AudConfig.BookLastPrintPageNo);
  }

  /*-- Generate All IFrames : Ends --*/

  getLinkFromPage = function (e) {
    //alert(e);
    e.preventDefault();
    var target = e.target;
    if (!target.classList.contains("showUp")) return;

    var link = $($(target)[0]).attr("href");
    //console.log(target);
    //console.log($($(target)[0]).hasClass('aud'));
    if ($($(target)[0]).hasClass("aud")) {
      playLinkAudio(link);
    } else {
      var lightbox = lity(link);
    }
  };

  openActivity = function (e) {
    var link = $($(e.target)[0]).attr("value");
    //alert(link);
    var lightbox = lity(link);
  };

  function playLinkAudio(audioLink) {
    stopLinkAudio();
    $("#AudBookLink").attr("src", audioLink);
    $("#AudBookLink")[0].play();
  }

  function stopLinkAudio() {
    $("#AudBookLink").attr("src", "");
  }

  reader.setScale = (function () {
    var styleTag,
      sheet,
      setTag = function () {
        styleTag = document.createElement("style");
        styleTag.setAttribute("type", "text/css"),
          document.head.appendChild(styleTag),
          (sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet);
      },
      // getZoomBounds = function () {
      //   return { width: pageBounds[currenPage - 1][0], height: pageBounds[currenPage - 1][1] };
      // }

      transStyle = function (a, b, c, d, e) {
        //console.log(a, b, c, d, e);
        var f;
        return (
          (f = e
            ? "translate3d(" + b + "px, " + c + "px, 0) scale(" + d + ")"
            : "translateX(" +
            b +
            "px) translateY(" +
            c +
            "px) scale(" +
            d +
            ")"),
          "-webkit-transform: " +
          f +
          ";\n-ms-transform: " +
          f +
          ";\ntransform: " +
          f +
          ";"
        );
      },
      scaleFactor = function () {
        //console.log(c);
        var zb = {
          width: pageBounds[currenPage][0],
          height: pageBounds[currenPage][1],
        },
          e = (viewerDOM.clientWidth - 2) / zb.width,
          g = (viewerDOM.clientHeight - 2) / zb.height;

        // var l = Math.min(e, g);
        return Math.min(e, g);
      },
      updateScale = function () {
        if (sheet && sheet.cssRules.length > 0) {
          sheet.deleteRule(0);
        }
        var u = transStyle(null, 0, 0, scaleFactor(), !1);
        document.documentElement.style.setProperty('--pageScale', u);
        // styleTag = sheet.insertRule(
        //   ".page-inner { \n" + u + "\n}",
        //   sheet.cssRules.length
        // );
        //console.log(sheet.cssRules.length);
      };

    return {
      setTag: function () {
        setTag();
        updateScale();
      },
      updateScale: updateScale,
    };
  })();

  loadJS = function (ID, FILE_URL, async = true) {
    // Remove OLD
    let scriptEle = document.getElementById(ID);
    scriptEle.remove();
    // Add New
    scriptEle = document.createElement("script");
    scriptEle.setAttribute("id", ID);
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);

    document.body.appendChild(scriptEle);

    // success event 
    scriptEle.addEventListener("load", () => {
      // console.log("File loaded");
      pageEven();
      // console.log(config);
      // console.log(AudConfig);
      reader.setup(json);

    });
    // error event
    scriptEle.addEventListener("error", (ev) => {
      //console.log("Error on loading file", ev);
    });
  }

  document.title = config["fileName"];
  document.getElementById("chapterNum").innerHTML = config["chapterNum"];
  document.getElementById("ChapterName").innerHTML = config["chapterName"];

  $("#dropMenu").on("click", function (e) {
    e.stopPropagation();
    $("#dropMenu").toggleClass("open");
  });

  // New Theme Base eBook
  openChapter = function (CHAP, ChapIndex) {
    ChapterIndex = ChapIndex;
    OnInitialStartClick();
    // ResetChapterData();       
    //$("#BookLoader").removeClass("ClsHide");
    //$("#theme_animation")[0].pause();

    setTimeout(function () {
      InitBookmark();
      InitHighPanel();
      InitNoteBookmark();
      InitPagemark();
    }, 1000);

    // setTimeout(function () {
    //   initScorm();
    //   LoginTime = new Date();
    // }, 1800);

    setTimeout(function () {
      OnChapterSelRecSusData();
      OnChapterSelRecComments();
      OnChapterSelRecLessonLoc();
      try {

        //OnChapterSelRecBookPerc();             
      } catch (err) { }

      document.title = config["fileName"];
      var startScreen = document.getElementById("startScreen");
      startScreen.classList.add("fadeOut");
      setTimeout(function () {
        startScreen.style.display = "none";
      }, 1000);

      // Load/reset video
      // $("#theme_animation")[0].pause();
      // $("#theme_animation")[0].currentTime = 0;

      //console.log(LastView, LastPageNo, IsBookFirstTime);      
      if (IsBookFirstTime) {
        openHelp();
        $("#vCenter").addClass("Clsloading");
        IsBookFirstTime = false;
        //SendSusData(); //send data to SCORM
      }
      else {
        $("#SPopupMMainCont").addClass("ClsOpen");
      }

      ShowCurrentPage(0);

      //console.log(RecdArrBookPercL1, SendArrBookPercLMS); 
      //$("#BookLoader").remove();
      // Hide Top menu by default
      setTimeout(() => { toggleMenu(); }, 50);
      $("#DvLoaderProgressBgText").hide();
      $("#preloaderBlock").remove();
      $("#wrapper").css("opacity", 1);
    }, 2500);

    IsBookStarted = true;
  }

  // Old Chapter eBook style
  start = function () {
    setTimeout(function () {
      var startScreen = document.getElementById("startScreen");
      startScreen.classList.add("fadeOut");
      //console.log(LastView, LastPageNo, IsBookFirstTime);      
      if (IsBookFirstTime) {
        openHelp();
        $("#vCenter").addClass("Clsloading");
        //IsBookFirstTime = false;
        //SendSusData(); //send data to SCORM        
      }
      else {
        //$("#SPopupMMainCont").addClass("ClsOpen");
      }
    }, 100);
    IsBookStarted = true;
    setMenu();
  };

  // document.addEventListener('click', function (e) {
  //console.log(e.target);
  // })

  toggleView = function () {
    reader.setLayout();
    UnbindNoteEventFromPage(); //remove note crosshair cursor    

    setTimeout(() => {
      scaleStage();
    }, 50);
    //SendSusData(); //send data to SCORM
  };

  reader.setLayout = function () {
    var prEvBtn = $("#prEvBtn"),
      neXtBtn = $("#neXtBtn");
    var viewBtn = document.getElementById("viewBtn");
    //console.log(val);
    if (layout === "magazine") {
      layout = "presentation";
      viewBtn.classList.add("single");
    } else {
      layout = "magazine";
      viewBtn.classList.remove("single");
      // $("#page" + currenPage).removeClass("ClsHideAllPages");
      $("#page" + (currenPage + 1)).removeClass("ClsHideAllPages");
    }

    // goToPage('next')
    viewerDOM.classList.remove("magazine", "presentation");
    viewerDOM.classList.add(layout);
    AudConfig.BookLayout = layout;
    AudConfig.CurrPageNo = currenPage;
    //console.log(currenPage, lastPage, layout);

    StopLastPageAudio();
    ResetAllPageAudData();


    if (LastPagePos == "L") {
      if (currenPage === lastPage && layout === "presentation") return;
    }
    else {
      if (currenPage === lastPage && layout === "presentation");
    }

    if (
      currenPage === lastPage &&
      layout === "magazine" &&
      currenPage % 2 === 0
    )
      return;

    if (LastPagePos == "L") {
      if (currenPage === pageCount - 2) {
        neXtBtn.addClass("disable");
      }
    } else {
      if (layout == "magazine") {
        if (currenPage === pageCount - 2) {
          neXtBtn.addClass("disable");
        }
      } else {
        if (currenPage === pageCount - 2) {
          neXtBtn.removeClass("disable");
        }
      }
    }

    //console.log(AudConfig.CurrPageNo);

    //viewerDOM.innerHTML = "";
    if (layout === "magazine") {
      if (currenPage % 2 !== 0) currenPage -= 1;
      AudConfig.CurrPageNo = currenPage;
    }

    //reader.loadPages(currenPage);
    //console.log(AudConfig.CurrPageNo);    
    ShowCurrentPage(currenPage);
  };

  pageNoKeyUp = function (e) {
    var KeyNo = e.keyCode;
    var PageVal = Number($("#InpPageNo").val());
    // console.log(KeyNo);
    if (KeyNo == 13 || e === 'click') {
      if (
        PageVal >= AudConfig.BookStartPrintPageNo &&
        PageVal <= AudConfig.BookLastPrintPageNo
      ) {
        gotoPrintPageNo(PageVal);
        $("#InpPageNo").val("");
      } else {
        $("#GoToPagePopupCont").removeClass("hide").addClass("show");
        $("#GoToPagePopupCont").animate(
          {
            opacity: 1,
          },
          {
            duration: 500,
            complete: function () {
              setTimeout(function () {
                $("#GoToPagePopupCont").animate(
                  {
                    opacity: 0,
                  },
                  {
                    duration: 500,
                    complete: function () {
                      $("#GoToPagePopupCont")
                        .removeClass("show")
                        .addClass("hide");
                      $("#InpPageNo").val("");
                    },
                  }
                );
              }, 2000);
            },
          }
        );
      }
    }
    UnbindNoteEventFromPage(); //remove note crosshair cursor
  };

  toggleMenu = function () {
    reader.setMenu();
    UnbindNoteEventFromPage(); //remove note crosshair cursor
  };

  reader.setMenu = function () {
    var menuBtn = document.getElementById("IcMenuBtn");
    var toolsBar = document.getElementById("tools");
    var mainContainer = document.getElementById("main");
    var mainWrapper = document.getElementById("wrapper");
    // configData.stageWidth = 1062;
    // configData.stageHeight = 748;
    menuBtn.classList.remove("ClsLargeIcon");
    menuBtn.classList.add("ClsSmallIcon");
    //toolsBar.classList.remove("hide");
    mainContainer.classList.remove("ClsLargeView");
    mainContainer.classList.add("ClsSmallView");
    mainWrapper.classList.remove("ClsLargeView");
    mainWrapper.classList.add("ClsSmallView");
    scaleStage();
    // if (menuBtn.classList.contains("ClsSmallIcon")) {
    //   // configData.stageWidth = 1062;
    //   // configData.stageHeight = 681;
    //   menuBtn.classList.remove("ClsSmallIcon");
    //   menuBtn.classList.add("ClsLargeIcon");
    //   //toolsBar.classList.add("hide");
    //   mainContainer.classList.remove("ClsSmallView");
    //   mainContainer.classList.add("ClsLargeView");
    //   mainWrapper.classList.remove("ClsSmallView");
    //   mainWrapper.classList.add("ClsLargeView");
    //   scaleStage();
    // } else {
    //   // configData.stageWidth = 1062;
    //   // configData.stageHeight = 748;
    //   menuBtn.classList.remove("ClsLargeIcon");
    //   menuBtn.classList.add("ClsSmallIcon");
    //   //toolsBar.classList.remove("hide");
    //   mainContainer.classList.remove("ClsLargeView");
    //   mainContainer.classList.add("ClsSmallView");
    //   mainWrapper.classList.remove("ClsLargeView");
    //   mainWrapper.classList.add("ClsSmallView");
    //   scaleStage();
    // }
  };

  loadNewPageFromContent = function (e) {
    gotoPrintPageNo(e.target.attributes["data-pg"].nodeValue);
  };

  gotoPrintPageNo = function (RcvdPageNo) {
    try {
      $(".blackback").css("display", "none");
      $(".gamePopup, .panelBG, .featureDetails").css("display", "none");
    } catch (error) { }

    var NewPageNo = Number(RcvdPageNo);
    var NewPageID;
    if (RcvdPageNo == "TOC") {
      NewPageID = AudConfig.TOCPageNo - AudConfig.BookStartPrintPageNo;
    } else {
      NewPageID = NewPageNo - AudConfig.BookStartPrintPageNo;
    }

    if (layout === "magazine") {
      reader.setTOCPage(NewPageID);
    } else {
      reader.setTOCPage(NewPageID + 1);
    }
    //console.log(NewPageID);

    UnbindNoteEventFromPage(); //remove note crosshair cursor
  };

  gotoSelectedPage = function (RcvdPageID) {
    //console.log(RcvdPageID);

    try {
      $(".blackback").css("display", "none");
      $(".gamePopup, .panelBG, .featureDetails").css("display", "none");
      EnableAllTool();
      DeselectAllTool();

      $(".blackback").css("display", "none");
      $(".gamePopup, .panelBG, .featureDetails").css("display", "none");
    } catch (error) { }

    var OpenedPageNo = currenPage;
    var TOCPageNo = AudConfig.TOCPageNo;
    var NewPageID;
    if (RcvdPageID == 0) {
      NewPageID = AudConfig.TOCPageNo - AudConfig.BookStartPrintPageNo;
    } else {
      NewPageID = RcvdPageID;
    }

    reader.setTOCPage(NewPageID);
    //console.log(currenPage);
  };

  reader.setTOCPage = function (RcvdPageID) {
    //var OpenedPageNo = currenPage;
    var NewPageNo = RcvdPageID;
    //console.log(RcvdPageID);
    var ModNo = NewPageNo % 2;
    if (layout === "magazine") {
      if (ModNo == 1) {
        currenPage = NewPageNo - 3;
        goToPage("next");
      } else {
        currenPage = NewPageNo - 2;
        goToPage("next");
      }
    }
    else {
      currenPage = NewPageNo - 2;
      goToPage("next");
    }
  };

  setToolNavigation = function () {
    $("#dropMenu").toggleClass("open");
    if ($("#nextBackToggle").hasClass("next")) {
      // $("#nextBackToggle").removeClass("next").addClass("back");
      // $("#toolCont").animate({ left: "-570" }, "slow");
      AudConfig.ToolMenuID = 1;
    } else if ($("#nextBackToggle").hasClass("back")) {
      // $("#nextBackToggle").removeClass("back").addClass("next");
      // $("#toolCont").animate({ left: "0" }, "slow");
      AudConfig.ToolMenuID = 0;
    }
    // CloseAudPopup();
    UnbindNoteEventFromPage(); //remove note crosshair cursor
  };

  CheckBookLastPagePos();
  reader.setup(json);
  // reader.loadPages(0); // COMMENTED TO LOAD DEFAULT

  reader.setScale.setTag();
  var parr = pageEven();

  //console.log(parr);

  /*-- Activity Popup Functions : Starts --*/
  toggleActPopup = function () {
    if (!isActPopupOpen) {
      showActPopup();
    } else {
      hideActPopup();
    }

    StopLastPageAudio();
    UnbindNoteEventFromPage(); //remove note crosshair cursor
  };

  showActPopup = function () {
    isActPopupOpen = true;
    $("#actBgCont").removeClass("hide").addClass("show");
    $("#tools").removeClass("enable").addClass("disable");
    loadActThumbs();
    SelectTool("IcAct");
  };

  hideActPopup = function () {
    isActPopupOpen = false;
    $("#actBgCont").removeClass("show").addClass("hide");
    $("#tools").removeClass("disable").addClass("enable");
    EnableAllTool();
    DeselectAllTool();
    $("#IcAct").removeClass("selected");
  };

  updateActIconStatus = function () {
    if (layout === "magazine") {
      if (
        arrActLink[currenPage].length == 0 &&
        arrActLink[currenPage + 1].length == 0
      ) {
        $("#IcAct").addClass("disable");
      } else {
        $("#IcAct").removeClass("disable");
      }
    } else if (layout === "presentation") {
      if (arrActLink[currenPage].length == 0) {
        $("#IcAct").addClass("disable");
      } else {
        $("#IcAct").removeClass("disable");
      }
    }
  };

  loadActThumbs = function () {
    $("#actThumbCont").html("");
    //alert(arrActLink[currenPage][0].ActLink);
    if (layout == "magazine") {
      for (let i = 0; i < arrActLink[currenPage].length; i++) {
        var TempNode =
          '<div class="clsActThumb"><div value="' +
          arrActLink[currenPage][i].ActLink +
          '" class="actThumbImg" style = "background-image:url(' +
          arrActLink[currenPage][i].ThumbLink +
          ');"></div><div class="clsActThumbTitle">' +
          arrActLink[currenPage][i].Title +
          "</div></div>";
        var LastData = $("#actThumbCont").html();
        $("#actThumbCont").html(LastData + TempNode);
      }

      for (let i = 0; i < arrActLink[currenPage + 1].length; i++) {
        var TempNode =
          '<div class="clsActThumb"><div value="' +
          arrActLink[currenPage + 1][i].ActLink +
          '" class="actThumbImg" style = "background-image:url(' +
          arrActLink[currenPage + 1][i].ThumbLink +
          ');"></div><div class="clsActThumbTitle">' +
          arrActLink[currenPage + 1][i].Title +
          "</div></div>";
        var LastData = $("#actThumbCont").html();
        $("#actThumbCont").html(LastData + TempNode);
      }
    } else if (layout == "presentation") {
      for (let i = 0; i < arrActLink[currenPage].length; i++) {
        var TempNode =
          '<div class="clsActThumb"><div value="' +
          arrActLink[currenPage][i].ActLink +
          '" class="actThumbImg" style = "background-image:url(' +
          arrActLink[currenPage][i].ThumbLink +
          ');"></div><div class="clsActThumbTitle">' +
          arrActLink[currenPage][i].Title +
          "</div></div>";
        var LastData = $("#actThumbCont").html();
        $("#actThumbCont").html(LastData + TempNode);
      }
    }

    $(".actThumbImg").on("click", function (e) {
      //console.log(e);
      openActivity(e);
    });
  };
  /*-- Activity Popup Functions : Ends --*/

  /*-- Mask Functions : Starts --*/
  var ObjMaskStatus = {
    Width: null,
    Height: null,
    Left: null,
    Top: null,
    Angle: null,
    PageNo: null,
  };
  var click = { x: 0, y: 0 };
  var containmentArea = $("#main");

  toggleMask = function () {
    if (!isMaskOpen) {
      $("#DvMask").removeClass("ClsHideMask").addClass("ClsShowMask");
      $("#DvMask").removeAttr("style");
      isMaskOpen = true;
      ObjMaskStatus.PageNo = currenPage;
    } else {
      $("#DvMask").removeClass("ClsShowMask").addClass("ClsHideMask");
      isMaskOpen = false;
      ObjMaskStatus.PageNo = null;
    }
    StopLastPageAudio();
  };

  reader.HideMaskOnPageChange = function () {
    if (ObjMaskStatus.PageNo != null) {
      $("#DvMask").removeClass("ClsShowMask").addClass("ClsHideMask");
      isMaskOpen = false;
    }
  };

  reader.ShowMaskOnPageChange = function () {
    //maintain mask state on page change
    // if(ObjMaskStatus.PageNo != null && ObjMaskStatus.PageNo == currenPage){
    //   $("#DvMask").removeClass("ClsHideMask").addClass("ClsShowMask");
    //   isMaskOpen = true;
    // }
  };

  reader.UpdateMaskData = function () {
    //ObjMaskStatus = {"Width": null, "Height":null, "Left":null, "Top": null, "Angle":null, "PageNo":null};

    var NWidth = parseFloat($("#DvMask")[0].style.width);
    var NHeight = parseFloat($("#DvMask")[0].style.height);
    var NTop = parseFloat($("#DvMask")[0].style.top);
    var NLeft = parseFloat($("#DvMask")[0].style.left);

    if (NWidth != NaN || NWidth != undefined) {
      ObjMaskStatus.Width = NWidth;
    }
    if (NHeight != NaN || NHeight != undefined) {
      ObjMaskStatus.Height = NHeight;
    }
    if (NTop != NaN || NTop != undefined) {
      ObjMaskStatus.Top = NTop;
    }
    if (NLeft != NaN || NLeft != undefined) {
      ObjMaskStatus.Left = NLeft;
    }

    //console.log(NWidth, NHeight, NTop, NLeft);
  };

  //mask 4 buttons
  reader.ShowMaskBtn = function () {
    /*$(".ui-resizable-handle").show();*/
  };

  reader.HideMaskBtn = function () {
    /*$(".ui-resizable-handle").hide();*/
  };

  initMask = function () {
    $(".ClsMaskBtn").hide();
    $("#DvMask")
      .draggable({
        containment: $("#DvMask").parent(),
        start: function (event) {
          click.x = event.clientX;
          click.y = event.clientY;
        },

        drag: function (event, ui) {
          // This is the parameter for scale()
          //var zoom = 1.5;zoomFactor

          var original = ui.originalPosition;

          //jQuery will simply use the same object we alter here
          ui.position = {
            left: (event.clientX - click.x + original.left) / zoomFactor,
            top: (event.clientY - click.y + original.top) / zoomFactor,
          };

          // var contWidth = containmentArea.width(), contHeight = containmentArea.height();
          // ui.position.left = Math.max(0, Math.min(ui.position.left / zoomFactor , contWidth - ui.helper.width()));
          // ui.position.top = Math.max(0, Math.min(ui.position.top  / zoomFactor,  contHeight- ui.helper.height()));

          var contWidth = containmentArea.width(),
            contHeight = containmentArea.height();
          ui.position.left = Math.max(
            0,
            Math.min(
              (event.clientX - click.x + original.left) / zoomFactor,
              contWidth - ui.helper.width()
            )
          );
          ui.position.top = Math.max(
            0,
            Math.min(
              (event.clientY - click.y + original.top) / zoomFactor,
              contHeight - ui.helper.height()
            )
          );
        },
      })
      .resizable({
        handles: "n, e, s, w, ne, se, sw, nw",
        containment: $("#DvMask").parent(),
      });

    $("#DvMask").mousedown(function () {
      reader.ShowMaskBtn();
    });

    $("#DvMask").mouseup(function () {
      reader.UpdateMaskData();
      setTimeout(function () {
        reader.HideMaskBtn();
      }, 100);
    });

    $("html").mousedown(function (e) {
      if (e.target.id != "DvMask") {
      }
    });
  };

  /*-- Mask Functions : Ends --*/

  // disclaimerPopUp
  openDisclaimer = function () {
    // alert('open')
    $(".disclaimerPopUp").show()
  }
  closeDisclaimer = function () {
    $(".disclaimerPopUp").hide()
  }

  window.addEventListener("resize", reader.setScale.updateScale);

  // try {
  //   initScorm();
  //   initMask();
  //   LoginTime = new Date();
  // } catch (err) {}
})();

$(document).ready(function () {
  //console.log("Ready")
  setTimeout(function () {
    try {
      initScorm();
      initMask();
      LoginTime = new Date();
    } catch (err) { }
  }, 500);
});

function closeLimitMsgPopUp() {
  $("#HightlightDataLimitEnds").animate(
    { opacity: 0, },
    {
      duration: 500,
      complete: function () {
        $("#HightlightDataLimitEnds")
          .removeClass("show")
          .addClass("hide");
      },
    }
  );
}

function CheckBookLastPagePos() {
  var PageDiff =
    Number(AudConfig.BookLastPrintPageNo) -
    Number(AudConfig.BookStartPrintPageNo);
  if (PageDiff % 2 == 0) {
    LastPagePos = "L";
    config.pagecount = PageDiff + 2;
  } else {
    LastPagePos = "R";
    config.pagecount = PageDiff + 1;
  }
  //console.log(LastPagePos);

  $("#chapterNumber").html(AudConfig.ChapterNo);
  $("#chapterName").html(AudConfig.ChapterName);
}

function LoadPageItems() {
  updateActIconStatus();
  readNoteBookMark();
  LoadPageBookMark();
  FromLoadPageItems(); // from pageController
  InitHighlight();
  UpdateHighlight();
  //console.log(AudConfig.CurrPageNo);
  AddNodeAudHighCls();
  UpdateCanvasPageNo();
  // stop toc page highlight.
  $("#page0 > iframe").contents().find("div#p0").attr("style", 'user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; -o-user-select: none !important;');
  OnPageUpdateMarkPage();
}

/*-- Let's go : Activity Popup - Starts --*/
async function loadPDF(ActPath) {
  const pdfUrl = ActPath; // Replace with your PDF URL
  console.log(pdfUrl)
  try {
    const response = await fetch(pdfUrl, {
      // Needed if the PDF requires cookies/session
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }
    const blob = await response.blob();
    // Make sure it's a PDF
    if (blob.type !== 'application/pdf') {
      throw new Error('File is not a valid PDF');
    }
    const blobUrl = URL.createObjectURL(blob);
    // Redirect to PDF.js viewer with the Blob URL
    return encodeURIComponent(blobUrl);
  } catch (err) {
    // console.error(err);
    return false
  }
}
async function openLetsGoActivity(ActPath, closeBtnTop, closeBtnRight) {
  $("#dropMenu").removeClass("open");
  if (CheckIfAudPopupOpen()) { return; }
  StopAllPageAudio();
  // IF PDF
  if (ActPath.toLowerCase().endsWith('.pdf')) {
    const newPath = await loadPDF(ActPath);
    if (newPath !== false) {
      $("#IFrame_letsgo_activity").attr("src", 'assets/pdfjs/web/viewer.html?file=' + newPath + '#zoom=page-width');
    } else {
      $("#IFrame_letsgo_activity").attr("src", 'assets/pdfjs/web/viewer.html?file=' + ActPath + '#zoom=page-width');
      // $("#IFrame_letsgo_activity").attr("src", 'https://docs.google.com/gview?url=' + ActPath + '&embedded=true');
    }
    // $("#IFrame_letsgo_activity").attr("src", 'assets/pdfjs/web/viewer.html?file=' + ActPath + '#zoom=page-width');
    // $("#IFrame_letsgo_activity").attr("src", newPath);

    $("#letsgo_activity").fadeIn();
  }
  // IF PPT
  else if (ActPath.toLowerCase().endsWith('.ppt') || ActPath.toLowerCase().endsWith('.pptx')) {
    $("#IFrame_letsgo_activity").attr("src", 'https://view.officeapps.live.com/op/embed.aspx?src=' + ActPath);
    $("#letsgo_activity").fadeIn();
  }
  // IF MP4
  else if (ActPath.toLowerCase().endsWith('.mp4')) {
    openLetsGoVideo(ActPath);
  }
  // ELSE Activity
  else {
    $("#IFrame_letsgo_activity").attr("src", ActPath);
    scaleIFrameFn();
    $("#letsgo_activity").fadeIn();
  }

  $("#letsgo_activity img[src*='close.png']").css({ "top": closeBtnTop || 10, "right": closeBtnRight || 5 });
}
function closeLetsGoActivity() {
  $("#letsgo_activity").hide();
  $("#IFrame_letsgo_activity").attr("src", "").removeAttr("style");
  $("#letsgo_activity img[src*='close.png']").removeAttr("style");
}
/*-- Let's go : Activity Popup - Ends --*/

/* Let's Go Po up */
function openLetsGoVideo(src, closeBtnTop, closeBtnRight) {
  $("#dropMenu").removeClass("open");
  if (CheckIfAudPopupOpen()) { return; }
  StopAllPageAudio();
  $("#letsgo_video").fadeIn();
  $("#letsgo_video video").attr("src", src);
  $("#letsgo_video video")[0].play();

  $("#letsgo_video img[src*='close.png']").css({ "top": closeBtnTop || 10, "right": closeBtnRight || 5 });
}
function closeLetsGoVideo() {
  $("#letsgo_video").hide();
  $("#letsgo_video video")[0].load();
  $("#letsgo_video img[src*='close.png']").removeAttr("style");
}

/* Pop-Up Images */
// Did you know, Let’ recall
function enlargeImage(imgPath, audioPath) {
  if (CheckIfAudPopupOpen()) { return; }

  $("#enlarge_image_elem").attr("src", imgPath);
  $("#enlarge_image").fadeIn();

  if (audioPath === '' || audioPath === undefined) {
    // $("#enlarge_image_audio_elem").hide();
  }
  else {
    $("#enlarge_image_audio_elem").attr("src", audioPath);
    setAudPlayer("enlarge_image");

    setTimeout(function () {
      $("#enlarge_image_audio_elem").show();
      customAudPlayer('enlarge_image_audio_elem');
    }, 500);
  }
}
function closeEnlargedImage() {
  $("#enlarge_image").hide();
  $("#enlarge_image audio")[0].load();
  $("#enlarge_image_elem").attr("src", "");
  $("#enlarge_image_audio_elem").attr("src", "");
  resetAudioPlayer();
}

// Did you know, Let’ recall
function openListeningExercisesPopUp(audioPath) {
  if (CheckIfAudPopupOpen()) { return; }
  $("#listening_exercises_audio_elem").attr("src", audioPath);
  setAudPlayer("listening_exercises");

  $("#listening_exercises").fadeIn();
  setTimeout(function () {
    // $("#listening_exercises audio")[0].play();
    customAudPlayer('listening_exercises_audio_elem');
  }, 500);
}
function closeListeningExercisesPopUp() {
  $("#listening_exercises").hide();
  $("#listening_exercises audio")[0].load();
  resetAudioPlayer();
}

/* Custom Audio Player */
function setAudPlayer(parent) {
  $("#" + parent).append('<div id="audioPlayerContainer"> <span id="playBtn" class="btn ClsPlayBtn"> </span> <div id="progressbar"> <span id="buffered-amount"></span> <span id="progress-amount"></span> </div> <span id="time">0:00</span> <span class="btn hide" id="replayBtn" title="repeat"></span> <span class="btn ClsAudio" id="volume"> </span> </div>');
}
function customAudPlayer(id) {
  var audplayer = document.querySelector('#' + id);
  var playPause = document.querySelector('#playPause');
  var speaker = document.querySelector('#speaker');
  var repeatBtn = document.querySelector('#replayBtn');
  var muteBtn = document.querySelector('#volume');
  var progressBar = document.querySelector('#progressbar');
  var playPauseBtn = document.querySelector('#playBtn');
  var timeRemaining = document.querySelector('#time');

  if (isNaN(audplayer.duration)) {
    // return timeRemaining.textContent = 'Refresh !!';
    return timeRemaining.textContent = '0:00';
  }

  audplayer.addEventListener('timeupdate', timeupdate, false);
  audplayer.addEventListener('progress', buffered, false);
  audplayer.addEventListener('ended', endedFn, false);
  repeatBtn.addEventListener('click', repeat, false);
  muteBtn.addEventListener('click', mute, false);
  progressBar.addEventListener('click', ProgressBarClick, false);
  playPauseBtn.addEventListener('click', PlayPause, false);

  timeRemaining.textContent = timer();

  function timer() {
    var timeleft = Math.ceil(audplayer.duration - audplayer.currentTime);
    var m = Math.floor(timeleft / 60);
    var s = Math.floor(timeleft % 60);
    if (s < 10) {
      s = '0' + s;
    }
    return m + ':' + s;
  }

  function PlayPause() {
    if (audplayer.paused) {
      audplayer.play();
      //playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
      playPauseBtn.classList.remove("ClsPlayBtn");
      playPauseBtn.classList.add("ClsPauseBtn");
    }
    else {
      audplayer.pause();
      //playPause.attributes.d.value = "M18 12L0 24V0";
      playPauseBtn.classList.remove("ClsPauseBtn");
      playPauseBtn.classList.add("ClsPlayBtn");
    }
  }

  function mute(e) {
    if (!audplayer.muted) {
      audplayer.muted = true;
      muteBtn.classList.remove("ClsAudio");
      muteBtn.classList.add("ClsMuteAudio");
    }
    else {
      audplayer.muted = false;
      muteBtn.classList.remove("ClsMuteAudio");
      muteBtn.classList.add("ClsAudio");
    }
  }

  function ProgressBarClick(e) {
    var playerContainer = document.querySelector('#audioPlayerContainer');
    var clickLeft = (e.pageX - playerContainer.getBoundingClientRect().left - 52) / window.zoomFactor;
    var r = ((clickLeft) / 370) * 100;
    audplayer.currentTime = audplayer.duration * r / 100;
  }

  function timeupdate() {
    var progressbar = document.getElementById('progress-amount');
    if (progressbar == null) return
    progressbar.style.width = ((audplayer.currentTime / audplayer.duration) * 100) + "%";
    timeRemaining.textContent = timer();
    if (progressbar.style.width == '100%') {
      // playPauseBtn.className = "iconicfill-play btn";
    }
  }

  function endedFn() {
    playPauseBtn.classList.remove("ClsPauseBtn");
    playPauseBtn.classList.add("ClsPlayBtn");
  }

  function repeat(e) {
    if (!audplayer.loop) {
      audplayer.loop = true;
      e.target.style.color = "#FF9393";
    }
    else {
      audplayer.loop = false;
      e.target.style.color = "#FFF";
    }
  }

  function buffered() {
    var buffelm = document.getElementById('buffered-amount');
    if (audplayer.buffered.length === 0) return;
    if (buffelm == null) return;

    var bufferedEnd = audplayer.buffered.end(audplayer.buffered.length - 1);
    buffelm.style.width = ((bufferedEnd / audplayer.duration) * 100) + "%";
  }

  //return PlayPause()
}
function resetAudioPlayer() {
  // var playPause = document.querySelector('#playPause');
  // var speaker = document.querySelector('#speaker');
  // document.getElementById('progress-amount').style.width = '0%';
  // document.getElementById('buffered-amount').style.width = '0%';
  // playPause.attributes.d.value = "M18 12L0 24V0";
  // speaker.attributes.d.value = "M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z";
  $('#audioPlayerContainer').remove();
}
function ResetChapterData() {
  delete (config);
  delete (AudConfig);
  delete (ICanArrAns);
  delete (ArrLinkThumbnail);
  delete (ArrAudSentData);
  delete (ArrAudWordData);
  delete (arrActLink);
  // config = null;
  // AudConfig = null;
  // ICanArrAns = [];
  // ArrLinkThumbnail = [];
  // ArrAudSentData = [];
  // ArrAudWordData = [];
  // arrActLink = [];
}

/*-- Add Audio Highlight functionality : Starts --*/

var ArrAudHigh = [];
function GenerateBlankArrAudHigh() {
  //console.log("Here")
  for (var i = 0; i < config.arrChapPageNo.length; i++) {
    var ArrBookAudHighBlank = [];
    for (var j = 0; j < config.arrChapPageNo[i]; j++) {
      var ArrPageAudHighBlank = [];
      ArrBookAudHighBlank.push(ArrPageAudHighBlank);
    }
    ArrAudHigh.push(ArrBookAudHighBlank);
  }

  //console.log(ArrAudHigh);
}


function CheckDupNodeAudHigh(NodeID) {
  var IsNodeFound = false;
  for (var i = 0; i < ArrAudHigh[ChapterIndex][AudConfig.CurrPageNo].length; i++) {
    if (NodeID == ArrAudHigh[ChapterIndex][AudConfig.CurrPageNo][i]) {
      IsNodeFound = true;
    }
  }
  return IsNodeFound;
}

function AddNodeAudHigh(NodeID, PageNo) {
  ArrAudHigh[ChapterIndex][PageNo].push(NodeID);
  ArrAudHigh[ChapterIndex][PageNo] = removeDuplicates(ArrAudHigh[ChapterIndex][PageNo]);
}

function removeDuplicates(arr) {
  return arr.filter((item,
    index) => arr.indexOf(item) === index);
}

function AddNodeAudHighCls() {
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;

  //console.log(AudConfig.CurrPageNo); 
  for (var i = 0; i < ArrAudHigh[ChapterIndex][LeftPageNo].length; i++) {
    let TempClsName = $("#page" + LeftPageNo + " > iframe").contents().find("#" + ArrAudHigh[ChapterIndex][LeftPageNo][i]).attr("data-audhlt");
    $("#page" + LeftPageNo + " > iframe").contents().find("#" + ArrAudHigh[ChapterIndex][LeftPageNo][i]).addClass(TempClsName);
  }

  if (AudConfig.BookLayout == "magazine") {
    if (ArrAudHigh[ChapterIndex][RightPageNo] != undefined) {
      for (var i = 0; i < ArrAudHigh[ChapterIndex][RightPageNo].length; i++) {
        let TempClsName = $("#page" + RightPageNo + " > iframe").contents().find("#" + ArrAudHigh[ChapterIndex][RightPageNo][i]).attr("data-audhlt");
        $("#page" + RightPageNo + " > iframe").contents().find("#" + ArrAudHigh[ChapterIndex][RightPageNo][i]).addClass(TempClsName);
      }
    }
  }
}

function FindNodeWithAttr(ParentDivID) {
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  let TempNodeArr = [];
  let TempArrChildNodes = null;
  TempArrChildNodes = $("#page" + LeftPageNo + " > iframe").contents().find("#" + ParentDivID).children();
  if (AudConfig.BookLayout == "magazine") {
    TempArrChildNodes = $("#page" + RightPageNo + " > iframe").contents().find("#" + ParentDivID).children();
  }

  //console.log(TempArrChildNodes);
  for (var i = 0; i < TempArrChildNodes.length; i++) {
    if ((TempArrChildNodes[i]).attributes["data-audhlt"] != undefined) {
      TempNodeArr.push(TempArrChildNodes[i].attributes['id'].nodeValue);
    }
  }

  return TempNodeArr;
}

function OnInitialStartClick() {
  GenerateBlankArrAudHigh();
  //reader.GenerateAllIFrames();
  CollectAllPageAudElem(); // Create array containing all pages audio elements
}

/*-- Add Audio Highlight functionality : Ends --*/

function isNumberKey(evt) {
  const charCode = evt.which ? evt.which : evt.keyCode;
  // Allow only digits (0-9)
  if (charCode >= 48 && charCode <= 57) {
    return true;
  }
  return false; // Block anything else
}

// Add tabindex and role to elements with onclick, for accessibility / remote control compatibility
window.addEventListener('load', () => {
  // Select all elements that have an inline onclick attribute
  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(el => {
    // 1. Add tabindex if not already present
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }

    // 2. Add role="button" if not present
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'button');
    }

    // 3. Add onkeydown to trigger onclick on Enter key
    el.onkeydown = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault(); // optional but helps avoid double key processing
        el.click(); // triggers whatever is already bound to onclick
      }
    };
  });
});


/**
 * Scale the desired element to fit the screen size.
 * @param {Object} [options] - Configuration options
 * @param {string} [options.rootElementId] - The ID of the root element to scale
 * @param {Object} [options.config={ stageWidth: 1062, stageHeight: 768 }] - Configuration for scaling
 * @description This function calculates the scale based on the viewport size and applies it to the specified root element.
 * It adjusts the transform style to scale the element and centers it in the viewport.
 */
var scaleIFrame = { x: 1, y: 1 },
  zoomFactorIF = 1,
  iframeLeft = 0,
  configDataFixed = { stageWidth: 1062, stageHeight: 768 },
  videoConfig = { stageWidth: 830, stageHeight: 1080 };

function scaleElement({
  rootElementId,
  config = { stageWidth: 1062, stageHeight: 768 },
}) {
  const rootElem = document.getElementById(rootElementId);
  // console.log(rootElementId, rootElem.checkVisibility());
  // if (!rootElem || !rootElem.checkVisibility()) return;
  if (!rootElem) return;

  const scale = {
    x: window.innerWidth / config.stageWidth,
    y: window.innerHeight / config.stageHeight,
  };

  let zoomFactor = scale.y;
  let newScale = `${scale.y}, ${scale.y}`;
  if (scale.x < scale.y) {
    zoomFactor = scale.x;
    newScale = `${scale.x}, ${scale.x}`;
  }

  const newWidth = parseFloat(newScale.split(",")[0]) * config.stageWidth;
  const leftPos = (window.innerWidth - newWidth) / 2;

  window.rootLeftElmPos = leftPos;
  window.zoomFactorIF = zoomFactor;

  const styleObj = {
    transform: `scale(${newScale}) translate(-50%, -50%)`,
    "transform-origin": "left top",
    position: "absolute",
    top: "50%",
    //left: "50%",
    left: "calc(" + 50 + "% + " + 30 + "px)",
    width: config.stageWidth + "px",
    height: config.stageHeight + "px",
    // overflow: "hidden",
  };

  for (const key in styleObj) {
    if (styleObj.hasOwnProperty(key)) {
      rootElem.style[key] = styleObj[key];
    }
  }
}

function onResize() {
  scaleElement({ rootElementId: "IFrame_letsgo_activity", config: configDataFixed });
  scaleElement({ rootElementId: "startScreenCont", config: videoConfig });
  scaleElement({ rootElementId: "helpContent", config: configDataFixed });
}

window.addEventListener("resize", onResize);
onResize(); // Initial call


// -------------------- Scale Viewer Functionality -------------------- //
// Global Variables
let CurrScale = { X: 1, Y: 1 };
let scale = { x: 1, y: 1 };
let zoomFactor = 1;
let stageLeft = 0;

// Default configuration
const configData = { stageWidth: config.bounds[0][0], stageHeight: config.bounds[0][1] };
document.documentElement.style.setProperty('--pageBoundWidth', config.bounds[0][0]);

// Function: Scales the stage based on the viewport and mode
function scaleStage(autoResize = false) {
  const rootElem = document.getElementById("viewer");
  const mainElem = document.getElementById("main");

  if (!rootElem || !mainElem) return;

  // Determine viewing mode from class names
  const isDoublePage = rootElem.classList.contains("magazine");
  const isFullPage = mainElem.classList.contains("ClsLargeView");

  // Update stage width based on mode
  configData.stageWidth = isDoublePage ? config.bounds[0][0] * 2 : config.bounds[0][0];

  // Calculate available height (subtract menu height if not full page)
  const availableHeight = isFullPage ? mainElem.clientHeight : mainElem.clientHeight - 67;

  // Compute scale factors
  scale.x = mainElem.clientWidth / configData.stageWidth;
  scale.y = availableHeight / configData.stageHeight;

  const useScale = Math.min(scale.x, scale.y);
  zoomFactor = CurrScale.X = CurrScale.Y = useScale;

  // Calculate new dimensions
  const newWidth = useScale * configData.stageWidth;
  const newHeight = useScale * configData.stageHeight;

  // Center the stage horizontally
  stageLeft = (mainElem.clientWidth - newWidth) / 2;
  window.rootLeftElmPos = stageLeft;

  // Apply styling for scaling and positioning
  const styleObj = {
    transform: `scale(${useScale}) translate(-50%, -50%)`,
    transformOrigin: "left top",
    position: "absolute",
    top: "50%",
    // left: "50%",
    // left: "calc(" + 50 + "% + " + 30 + "px)",
    left: "50%",
    width: `${configData.stageWidth}px`,
    height: `${configData.stageHeight}px`,
    // overflow: "hidden"
  };

  // Apply styles to the root element
  Object.entries(styleObj).forEach(([key, value]) => {
    rootElem.style[key] = value;
  });

  // Make zoom factor available globally and as CSS variable
  window.zoomFactor = zoomFactor;
  document.documentElement.style.setProperty('--zoomFactor', zoomFactor);

  // Optional: Auto-toggle view based on container overflow
  if (autoResize) {
    const scaledHeight = rootElem.offsetHeight * zoomFactor;
    const mainHeight = mainElem.offsetHeight;
    const scaledWidth = configData.stageWidth * 2 * zoomFactor;
    const mainWidth = mainElem.offsetWidth;

    // if (scaledHeight < mainHeight || scaledWidth < mainWidth) {
    //   toggleView(); // Assumes toggleView() is defined elsewhere
    // }
  }
}

// Event: Rescale stage on window resize
window.addEventListener("resize", () => scaleStage(true));
// Initial scaling
scaleStage();

// -------------------- Disable Picture-in-Picture on Video -------------------- //
// const video = document.getElementById('theme_animation');

// // Ensure the browser supports disablePictureInPicture
// if ('disablePictureInPicture' in HTMLVideoElement.prototype && video) {
//   video.disablePictureInPicture = true;
// }

// // Block right-click context menu on video
// video?.addEventListener('contextmenu', e => e.preventDefault());

// // Prevent Picture-in-Picture from starting
// video?.addEventListener('enterpictureinpicture', e => {
//   e.preventDefault();
//   if (document.exitPictureInPicture) {
//     document.exitPictureInPicture();
//   }
// });

// // Block PiP keyboard shortcuts (e.g., Ctrl/Cmd + P)
// video?.addEventListener('keydown', e => {
//   if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
//     e.preventDefault();
//   }
// });
// -------------------- Disable Picture-in-Picture on Video -------------------- //