// ## Variaveis de configurações gerais;
var Main = new MainM();

$(document).ready(function () {

	Main.initPreloader();

});

var filesPreloader = {
	"files": [
		/*--------------------- Player Images Starts --------------------*/

		// { "source": "assets/ui/header_bg.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/sprite.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/title_bg.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/startBtn.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/activity.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/activitySel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/arrowToolBack.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/arrowToolBackSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/arrowToolNext.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/arrowToolNextSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/audioIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/bgHeader.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/bind.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/bookmark.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/bookmark_closed.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/bookmark_open.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/bookmarkSel.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/box.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/chap_list_bg.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/circleIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/close.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/colourPalleteBg.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/down.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/drag.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/drawIcon.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/glossary.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/glossarySel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/goToPage.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/goToPageSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/helppage1.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/helppage2.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/helppagenum_s.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/highlight.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/highlightSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/hindiwriteIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/icon_bookmark.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/icon_help.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/icon_helpSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/icon_highlight.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/icon_note.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/icon_search.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/icon_singlepage.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/listenIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/mask.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/maskSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/nextArrow.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/nextArrowGreen.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/note.png", "type": "IMAGE", "size": 1032 },
		// { "source": "assets/ui/img/noteSel.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/optionsup.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/oupi_activity.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/oupi_h1.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/oupi_h2.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/p2.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/p3.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/p4.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/paintIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/panBg.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/panDefault.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/panMove.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/pen.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/penSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/pop_bg1.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/popupHeaderBg.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/prevArrow.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/prevArrowGreen.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/readIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/readmode.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/readmodeSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/reset.png", "type": "IMAGE", "size": 1032 },

		{ "source": "assets/ui/img/search.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/searchSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/speakIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/spotlight.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/spotlightSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/stickerIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/texzoom.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/thumbnail.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/thumbnailSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/toc.png", "type": "IMAGE", "size": 1032 },

		// {"source": "assets/ui/img/tocSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/traceIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/up.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/view.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/view2.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/view2Sel.png","type": "IMAGE","size": 1032},
		// {"source": "assets/ui/img/viewSel.png","type": "IMAGE","size": 1032},
		{ "source": "assets/ui/img/writeIcon.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/img/zoomin.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/zoominSel.png","type": "IMAGE","size": 1032},

		{ "source": "assets/ui/img/zoomout.png", "type": "IMAGE", "size": 1032 },
		// {"source": "assets/ui/img/zoomoutSel.png","type": "IMAGE","size": 1032},

		{ "source": "assets/ui/ui/eraser.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/ui/mouse_hand.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/ui/Pen_pointer.png", "type": "IMAGE", "size": 1032 },
		{ "source": "assets/ui/ui/spotlight_resize.png", "type": "IMAGE", "size": 1032 }

		/*--------------------- Player Images Ends --------------------*/

	]
}


