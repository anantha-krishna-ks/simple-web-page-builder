var _rem,
    _$h = $('html'),
    _$b = $('#canTools'),
    _$bp = $('#canTools'),
    _$bpc = $('#canTools'),
    // _$an = $('#activity-navigator'),
    // _$ans = $('#activity-navigator-seek'),
    // _$anp = $('#activity-navigator-seek'),
    _acetate_global_scale = window.zoomFactor,
    _acetate_zoom_scale = 1,
    _pen = {"size":20},
    _$acetate_anchors = [],
    canvas;

    _$bodyWd = $("body").width();

var _spotlight = {x: 0, y: 0, w: 0, h: 0};
var _spotlight_delta = {x: 0, y: 0, w: 0, h: 0};
var _spotlight_width = 0, _spotlight_height = 0;

function acetate_spotlighting($acetate)
{

    //console.log($acetate);
    // _acetate_global_scale = (_$bodyWd / _$bpc.height()) / window.zoomFactor;

    var $canvas = $('<canvas/>', {class: 'acetate-spotlight-canvas'}).appendTo($acetate);
    var $hotspot = $('<a/>', {class: 'acetate-spotlight-hotspot focussed'})
        .append($('<i/>', {class: 'resizer-t'}))
        .append($('<i/>', {class: 'resizer-r'}))
        .append($('<i/>', {class: 'resizer-b'}))
        .append($('<i/>', {class: 'resizer-l'}))
        .appendTo($acetate);

    canvas = $canvas[0]; // var canvas
    // canvas.width = $acetate.width(); // * (_$bodyWd / _$bp.width());
    // canvas.height = $acetate.height(); // * (_$bodyWd / _$bp.width());

    canvas.width = 1920;
    canvas.height = 1920;

    $("#canTools").css("width","1920px");
    $("#canTools").css("height","1920px");

    _spotlight_width = canvas.width / 20;
    _spotlight_height = canvas.height / 20;
    var handle = {};

    var getPos = function (e)
    {
        //console.log("getPos");
        var t = e.type;

        if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length === 1)
        {
            e = e.originalEvent.touches[0];
        }

        var x, y, $acetate = $(e.target);

        if (typeof(e.pageX) !== 'undefined')
        {
            if (t === 'touchmove' && $acetate.is('a')) $acetate = $acetate.parent();
            if (t === 'touchmove' && $acetate.is('i')) $acetate = $acetate.parent().parent();

            // x = e.pageX - $acetate.offset().left;
            // y = e.pageY - $acetate.offset().top;

            x = (e.pageX - $acetate.offset().left)/window.zoomFactor;
            y = (e.pageY - $acetate.offset().top)/window.zoomFactor;

        }
        else if (typeof(e.offsetX) !== 'undefined')
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        else
        {
            x = e.layerX;
            y = e.layerY;
        }

        // x *= _acetate_global_scale;
        // y *= _acetate_global_scale;

        return {x: x, y: y};
    };


    function onMouseLight(e)
    {
        //console.log(this, e.target);
        //console.log("onMouseLight");
        var pos = getPos(e);

        _spotlight_delta = {x: _spotlight.x, y: _spotlight.y, w: _spotlight_width, h: _spotlight_height};

        pos.x += (($hotspot.width() / 2) - (handle.x)); // / _acetate_global_scale
        pos.y += (($hotspot.height() / 2) - (handle.y)); // / _acetate_global_scale

        _spotlight = pos;

        spotlight(canvas, $hotspot, pos.x, pos.y);

        e.stopPropagation();
        e.preventDefault();
    }


    function onMouseResizeC(e)
    {
       // alert("ii")
        var pos = getPos(e);
        _spotlight_delta = {x: _spotlight.x, y: _spotlight.y, w: _spotlight_width, h: _spotlight_height};

        var diff = {x: pos.x - _spotlight.x, y: _spotlight.y - pos.y};

        //console.log(pos, _spotlight, diff);

        diff = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

        _spotlight_width = Math.min(canvas.width * 0.48, Math.max(canvas.width / 20, diff));

        spotlight(canvas, $hotspot, _spotlight.x, _spotlight.y);

        e.stopPropagation();
        e.preventDefault();
    }


    function onMouseResizeT(e)
    {
        var actualDiff = _spotlight_delta.y - getPos(e).y;
        var diff = Math.abs(actualDiff);

        if(actualDiff <= 0) return;

        if (diff <= canvas.height * 0.98 && diff >= canvas.height / 99)
        {
            _spotlight_delta.y -= ((diff) - _spotlight_delta.h) / 2;
            _spotlight_delta.h += ((diff) - _spotlight_delta.h) / 2;
        }

        spotlight(canvas, $hotspot, _spotlight_delta.x, _spotlight_delta.y, _spotlight_delta.w, _spotlight_delta.h);

        e.stopPropagation();
        e.preventDefault();
    }


    function onMouseResizeR(e)
    {
        var actualDiff = getPos(e).x - _spotlight_delta.x;
        var diff = Math.abs(actualDiff);

        if(actualDiff <= 0) return;

        if (diff <= canvas.width * 0.98 && diff >= canvas.width / 99)
        {
            _spotlight_delta.x += ((diff) - _spotlight_delta.w) / 2;
            _spotlight_delta.w += ((diff) - _spotlight_delta.w) / 2;
        }

        spotlight(canvas, $hotspot, _spotlight_delta.x, _spotlight_delta.y, _spotlight_delta.w, _spotlight_delta.h);

        /*e.stopPropagation();
        e.preventDefault();*/
    }


    function onMouseResizeB(e)
    {
        var actualDiff = _spotlight_delta.y - getPos(e).y;
        var diff = Math.abs(actualDiff);

        if(actualDiff >= 0) return;

        if (diff <= canvas.height * 0.98 && diff >= canvas.height / 99)
        {
            _spotlight_delta.y += ((diff) - _spotlight_delta.h) / 2;
            _spotlight_delta.h += ((diff) - _spotlight_delta.h) / 2;
        }

        spotlight(canvas, $hotspot, _spotlight_delta.x, _spotlight_delta.y, _spotlight_delta.w, _spotlight_delta.h);

        e.stopPropagation();
        e.preventDefault();
    }


    function onMouseResizeL(e)
    {
        var actualDiff = getPos(e).x - _spotlight_delta.x;
        var diff = Math.abs(actualDiff);

        if(actualDiff >= 0) return;

        if (diff <= canvas.width * 0.98 && diff >= canvas.width / 99)
        {
            _spotlight_delta.x -= ((diff) - _spotlight_delta.w) / 2;
            _spotlight_delta.w += ((diff) - _spotlight_delta.w) / 2;
        }

        spotlight(canvas, $hotspot, _spotlight_delta.x, _spotlight_delta.y, _spotlight_delta.w, _spotlight_delta.h);

        e.stopPropagation();
        e.preventDefault();
    }

    $acetate.on('mousedown touchstart', function ()
    {
        $hotspot.removeClass('focussed');
    });

    $hotspot.on('mousedown touchstart', function (e)
    {
        //console.log("mouse down for spot and mask");

        _spotlight_delta = {x: _spotlight.x, y: _spotlight.y, w: _spotlight_width, h: _spotlight_height};

        var ev = e;

        if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length === 1)
        {
            e = e.originalEvent.touches[0];
        }

        if ($(e.target).hasClass('resizer-t'))
        {
            $acetate.addClass('resizing');
            $acetate.on('mousemove touchmove', onMouseResizeT);
        }
        else if ($(e.target).hasClass('resizer-r'))
        {
            $acetate.addClass('resizing');

            if (_$bpc.hasClass('bp-acetate-spotlight-circle'))
                $acetate.on('mousemove touchmove', onMouseResizeC);
            else
                $acetate.on('mousemove touchmove', onMouseResizeR);
        }
        else if ($(e.target).hasClass('resizer-b'))
        {
            $acetate.addClass('resizing');
            $acetate.on('mousemove touchmove', onMouseResizeB);
        }
        else if ($(e.target).hasClass('resizer-l'))
        {
            $acetate.addClass('resizing');
            $acetate.on('mousemove touchmove', onMouseResizeL);
        }
        else
        {
            $hotspot.addClass('focussed');

            handle = getPos(ev);
            $acetate.addClass('moving');
            $acetate.on('mousemove touchmove', onMouseLight);
            $hotspot.on('touchmove', function (e)
            {
                /*console.log('x');
                e.preventDefault();
                e.returnValue = false;
                return false;*/
            });
        }

        ev.stopPropagation();
        ev.preventDefault();
    });

    $acetate.on('mouseup touchend', function (e)
    {
        //console.log("mouse up for spot and mask");
        $acetate.removeClass('moving');
        $acetate.removeClass('resizing');
        $acetate.off('mousemove touchmove');

        _spotlight = {x: _spotlight_delta.x, y: _spotlight_delta.y, w: _spotlight_delta.w, h: _spotlight_delta.h};
        _spotlight_width = _spotlight_delta.w;
        _spotlight_height = _spotlight_delta.h;

        e.stopPropagation();
        e.preventDefault();
    });

    $acetate.on('mouseout', function (e)
    {
        var preserve = e.target.tagName == 'CANVAS' && $(this).hasClass('resizing');

        if (e.target.tagName == 'CANVAS')
        {
            $acetate.removeClass('moving');
            $acetate.removeClass('resizing');
            $acetate.off('mousemove');

            if (preserve)
            {
                _spotlight = {x: _spotlight_delta.x, y: _spotlight_delta.y, w: _spotlight_delta.w, h: _spotlight_delta.h};
                _spotlight_width = _spotlight_delta.w;
                _spotlight_height = _spotlight_delta.h;
            }
        }
    });
}

function spotlight(canvas, $hotspot, x, y, w, h)
{
    var x = x || canvas.width / 2,
        y = y || canvas.height / 2,
        w = w || _spotlight_width,
        h = h || _spotlight_height,
        ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 0;
    ctx.fillStyle = '';
        ctx.fillStyle="rgba(0,0,0,1)";
    ctx.globalCompositeOperation = 'source-over';

    // _$bpc.addClass('bp-acetate-spotlight-circle');
    if (_$bpc.hasClass('bp-acetate-spotlight-circle'))
    {
        ctx.globalAlpha = 1.0;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, w, 50, 0, 2 * Math.PI);
        ctx.fill();
    }
    else
    {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle="rgba(0,0,0,0)";
        ctx.beginPath();
        ctx.fillRect(x - w, y - h, w * 2, h * 2);
    }

    ctx.stroke();

    //console.log(_acetate_global_scale)

    // x /= _acetate_global_scale;
    // y /= _acetate_global_scale;
    h = (_$bpc.hasClass('bp-acetate-spotlight-circle') ? w : h); // / _acetate_global_scale;
    // w /= _acetate_global_scale;

    //console.log($hotspot)

    $hotspot.css({
        left  : to_rem(x) + 'rem',
        top   : to_rem(y) + 'rem',
        width : to_rem(2 * w) + 'rem',
        height: to_rem(2 * h) + 'rem'
    });

}




var canvasDrawing, tmp_canvas, canData;
function acetate_drawing($acetate)
{
   //console.log("active pen for drawing..");
    if ($acetate.data('drawing') === true) return;

    // _acetate_global_scale = _$bodyWd / _$bpc.width();

    $acetate.append('<canvas class="acetate-canvas"></canvas><canvas class="acetate-temp-canvas"></canvas>');

    canvasDrawing = $acetate.find('.acetate-canvas')[0];
    // canvasDrawing.width = $acetate.width() * (_$bodyWd / _$bp.width());
    // canvasDrawing.height = $acetate.height() * (_$bodyWd / _$bp.width());

    canvasDrawing.width = "1920";
    canvasDrawing.height = "1920";

    var ctx = canvasDrawing.getContext('2d');

    tmp_canvas = $acetate.find('.acetate-temp-canvas')[0];
    tmp_canvas.width = canvasDrawing.width;
    tmp_canvas.height = canvasDrawing.height;

    var tmp_ctx = tmp_canvas.getContext('2d');
    tmp_ctx.lineJoin = 'round';
    tmp_ctx.lineCap = 'round';

    var ppts = [];

    var onMousePaint = function (e)
    {
       //console.log(e.pageX+"...paint line start"+getPos(e).x);
        ppts.push(getPos(e || event));
        onPaint();
    };

    var onTouchPaint = function (e)
    {
        var e = e || event;

        if (e.touches && e.touches.length === 1)
        {
            ppts.push(getPos(e.touches[0]));
            onPaint();
        }

        e.preventDefault();
    };

    var onPaint = function ()
    {
        tmp_ctx.strokeStyle = _pen.colour;
        tmp_ctx.fillStyle = _pen.colour;
        tmp_ctx.lineWidth = _pen.size;
        tmp_ctx.globalAlpha = _pen.highlight ? 0.5 : 1;

        if (ppts.length < 3)
        {
            //console.log("less than3")
            var b = ppts[0];
            tmp_ctx.beginPath();
            tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            tmp_ctx.fill();
            tmp_ctx.closePath();
            return;
        }
        
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
        tmp_ctx.beginPath();
        tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++)
        {
           //console.log("ppts ..drwa line.....")
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        tmp_ctx.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
        );
        tmp_ctx.stroke();
        
    };
    
    canData = tmp_ctx.getImageData(50, 50, 100, 100);

    var onMouseErase = function (e)
    {
        ppts.push(getPos(e || event));
        onErase();
    };

    var onTouchErase = function (e)
    {
        var e = e || event;

        if (e.touches && e.touches.length === 1)
        {
            ppts.push(getPos(e.touches[0]));
            onErase();
        }

        e.preventDefault();
    };

    var onErase = function ()
    {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 40;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        if (ppts.length < 3)
        {
            var b = ppts[0];
            ctx.beginPath();
            //ctx.moveTo(b.x, b.y);
            //ctx.lineTo(b.x+50, b.y+50);
            ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
            ctx.fill();
            ctx.closePath();

            return;
        }

        // Tmp canvas is always cleared up before drawing.
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++)
        {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;

            ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        // For the last 2 points
        ctx.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
        );
        ctx.stroke();

    };

    var getPos = function (e)
    {
       //console.log(window.zoomFactor);
        var x, y, $acetate = $(e.target);

        //console.log(e.pageX/window.zoomFactor)

        //console.log(e.pageX, e.pageY) // $acetate.offset().left
        //console.log(e.pageX - e.pageX/window.zoomFactor)
        if (typeof(e.pageX) !== 'undefined')
        {
            x = (e.pageX - $acetate.offset().left)/window.zoomFactor;
            // x = e.pageX/window.zoomFactor;
            y = (e.pageY - $acetate.offset().top)/window.zoomFactor;
            // y = e.pageY/window.zoomFactor;

            


        }
        else if (typeof(e.offsetX) !== 'undefined')
        {
            // x = e.offsetX;
            // y = e.offsetY;
        }
        else
        {
            // x = e.layerX;
            // y = e.layerY;
        }
        //console.log(x,y)

        // x *= _acetate_global_scale * _acetate_zoom_scale;
        // y *= _acetate_global_scale * _acetate_zoom_scale;

        //console.log(window.zoomFactor)
        // if(window.zoomFactor > 1)
        // {
        //     return {x: x / window.zoomFactor, y: y / window.zoomFactor};
        // }
        // else if(window.zoomFactor < 1)
        // {
        //     return {x: x * window.zoomFactor, y: y * window.zoomFactor};
        // }else
        // {
        //     return {x: x, y: y};
        // }
        return {x: x, y: y};
        //console.log({x: x, y: y})
        // return {x: x, y: y};
    };

    tmp_canvas.addEventListener('mouseout', function (e)
    {
        tmp_canvas.removeEventListener('mousemove', onMousePaint, false);

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tmp_canvas, 0, 0);

        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        ppts = [];
    }, false);

    tmp_canvas.addEventListener('mousedown', function (e)
    {
        if (!_$bpc.hasClass('bp-acetate-draw')) return;

        tmp_canvas.addEventListener('mousemove', onMousePaint, false);
        onMousePaint(e);

        $('#activity-console-draw').removeClass('open');
        canData = tmp_ctx.getImageData(50, 50, 100, 100);
    }, false);

    tmp_canvas.addEventListener('mouseup', function ()
    {
        if (!_$bpc.hasClass('bp-acetate-draw')) return;

        tmp_canvas.removeEventListener('mousemove', onMousePaint, false);

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tmp_canvas, 0, 0);

        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        ppts = [];
    }, false);

    tmp_canvas.addEventListener('touchstart', function (e)
    {
        if (!_$bpc.hasClass('bp-acetate-draw')) return;

        tmp_canvas.addEventListener('touchmove', onTouchPaint, false);
        onTouchPaint(e);

        $('#activity-console-draw').removeClass('open');
    }, false);

    tmp_canvas.addEventListener('touchend', function ()
    {
        if (!_$bpc.hasClass('bp-acetate-draw')) return;

        tmp_canvas.removeEventListener('touchmove', onTouchPaint, false);

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tmp_canvas, 0, 0);

        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

        ppts = [];

        event.preventDefault();
    }, false);

    canvasDrawing.addEventListener('mousedown', function (e)
    {
      //console.log("gg11");
        if (!_$bpc.hasClass('bp-acetate-erase')) return;

        canvasDrawing.addEventListener('mousemove', onMouseErase, false);
        onMouseErase(e);

        $('#activity-console-erase').removeClass('open');
    }, false);

    canvasDrawing.addEventListener('mouseup', function ()
    {
       //console.log("gg22");
        if (!_$bpc.hasClass('bp-acetate-erase')) return;

        canvasDrawing.removeEventListener('mousemove', onMouseErase, false);
        ppts = [];
    }, false);

    canvasDrawing.addEventListener('touchstart', function (e)
    {
       //console.log("gg33");
        // if (!_$bpc.hasClass('bp-acetate-erase')) return;

        canvasDrawing.addEventListener('touchmove', onTouchErase, false);
        onTouchErase(e);

        $('#activity-console-erase').removeClass('open');
    }, false);

    canvasDrawing.addEventListener('touchend', function (e)
    {
        //console.log("gg44");
        if (!_$bpc.hasClass('bp-acetate-erase')) return;

        canvasDrawing.removeEventListener('touchmove', onTouchErase, false);

        ppts = [];

        e.preventDefault();
    }, false);

    $acetate.data('drawing', true);
}

function acetate_erase_all_old()
{
    return;
    var canvas = $('.acetate:visible').find('canvas')[0];
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function acetate_anchor($this, type)
{
    //console.log($this.offset().top);
    //console.log("acetate_anchor")
    var $acetate, prop = 'acetate-' + type;
    $acetate = $('<div/>', {
        class: 'acetate',
        data : {anchor: $this}
    }).appendTo($('#canTools'));

    // var $acetate, prop = 'acetate-' + type;
    // if (!$this.data(prop) || $this.data(prop).length === 0)
    // {
    //     $acetate = $('<div/>', {
    //         class: 'acetate',
    //         data : {anchor: $this}
    //     }).appendTo($('#canTools'));

    //     $this.data(prop, $acetate);

    //     if (!$this.is(':visible')) $acetate.hide();
    // }
    // else
    // {
    //     $acetate = $this.data(prop);
    //     $acetate.show().siblings('.acetate').hide();
    // }

    //console.log($this.outerWidth() === _$bpc.width())

    var css = {
        top   : to_rem(Math.max(0, $this.offset().top - _$bpc.offset().top)) + 'rem',
        left  : to_rem(Math.max(0, $this.offset().left - _$bpc.offset().left)) + 'rem',
        bottom: 'auto',
        right : 'auto',
        width : $this.outerWidth() === _$bpc.width() ? '100%' : (to_rem($this.outerWidth()) + 'rem'),
        height: $this.outerHeight() === _$bpc.height() ? '100%' : (to_rem($this.outerHeight()) + 'rem')
    };

    //console.log(css.width)

    $acetate
        .addClass(prop)
        .css(css);

    return $acetate;
}
function to_rem(px)
{
    if (px == 0) return 0;
    return px / parseFloat(_rem);
}
// function make_pen($swatch)
// {

//      //console.log($swatch);
//     return {
//         colour   : $swatch.css('background-color'),
//         highlight: (0.5 == $swatch.css('opacity')),
//         size     : $swatch.width()
//     };
// }

var $acetate = acetate_anchor($("#canTools"), 'spotlighting');
acetate_spotlighting($acetate);

var $acetate = acetate_anchor($("#canTools"), 'drawing');
acetate_drawing($acetate);

$(window).resize(_n);
_n();

/**
 *
 * @private
 */
function _n()
{

    _rem = _$bp.height() / 32;

    _$h.css({'font-size': (_$bp.height() / 32) + 'px'});

    // var $acetate = $("body");

    // var ctx = $(".acetate-canvas, .acetate-temp-canvas")[0].getContext("2d");
    // ctx.scale(window.zoomFactor, window.zoomFactor);

    // canvas.width = $acetate.width();
    // canvas.height = $acetate.height();

    // canvasDrawing.width = $acetate.width();
    // canvasDrawing.height = $acetate.height();

    // tmp_canvas.width = $acetate.width();
    // tmp_canvas.height = $acetate.height();

    // $("canvas").attr("width",$acetate.width());
    // $("canvas").attr("height",$acetate.height());

    // $("#canTools").css("width",$acetate.width());
    // $("#canTools").css("height",$acetate.height());

    var bodyWd  = $("body").innerWidth();
    var ctWidth = $("#canTools").width();

    //console.log(bodyWd, ctWidth)

    var bodyHt   = $("body").height();
    var ctHeight = $("#canTools").height();
    var mScale = window.zoomFactor;

    //console.log(bodyHt, ctHeight, mScale)
    
    //console.log(leftt)

    // if(ctWidth > bodyWd){
    //     $("#canTools").css("left", "-" + ((ctWidth - bodyWd)/2) + "px");
    // }else{
    //     $("#canTools").css("left", (bodyWd - ctWidth)/2 + "px");
    // }
    // $("#canTools").css("left", leftt + "px");


    if(ctHeight > bodyHt){
        // $("#canTools").css("top", "-" + ((ctHeight - bodyHt)/2) + "px");
    }else{
        // $("#canTools").css("top", ((bodyHt - ctHeight)/2) + "px");
    }

    //_$bpc.toggleClass('bp-zoomed', Math.round(window.devicePixelRatio * 100) != 100);
    if (_$bpc.hasClass('bp-tool-drawing'))
    {
        // _acetate_global_scale = (_$bodyWd / _$bp.width());
    }
    //_acetate_global_scale /= 1.219512195;

    //_spotlight_width *= _acetate_global_scale;
    //_spotlight_height *= _acetate_global_scale;
};


(function ($)
{
    var methods = {
        init            : function (settings)
        {
            settings = $.extend({
                'colors'   : ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
                'direction': 'left'
            }, settings);

            return this.each(function ()
            {
                if ($.isArray(settings.colors) && settings.colors.length >= 2)
                {
                    $(this).css({
                        'background':
                            methods.gradientToString(settings.colors, settings.direction)
                    });
                }
                else
                {
                    $.error('Please pass an array');
                }
            });
        },
        gradientToString: function (colors, direction)
        {
            var nbColors = colors.length;

            if (colors[0].percent === undefined)
            {
                if (colors[0].color === undefined)
                {
                    var tmp = [];
                    for (i = 0; i < nbColors; i++)
                        tmp.push({'color': colors[i]});

                    colors = tmp;
                }

                var p = 0, percent = 100 / (nbColors - 1);

                //calculate percent
                for (i = 0; i < nbColors; i++)
                {
                    p = i === 0 ? p : (i == nbColors - 1 ? 100 : p + percent);
                    colors[i].percent = p;
                }
            }

            var to = safari ? '' : 'to';

            var gradientString = safari ? '-webkit-linear-gradient(' : 'linear-gradient(';

            gradientString += to + ' ' + direction;

            for (i = 0; i < nbColors; i++) gradientString += ', ' + colors[i].color + ' ' + colors[i].percent + '%';

            gradientString += ')';

            return gradientString;
        }

    };

    $.fn.gradientGenerator = function ()
    {
        return methods.init.apply(this, arguments);
    };
})(jQuery);

// function bind_clicks(clicks)
// {
//     console.log("click----");
//     $.each(clicks, function (i, f)
//     {
//         if (i != 'body')
//         {
//             $(i).mousedown(function (e)
//             {
//                 e.stopPropagation()
//             });
//         }
//         $(i).click(function (e)
//         {
//             if (!$(this).hasClass('disabled') && !$(this).hasClass('blocked'))
//             {
//                 f(e, $(this));
//             }
//         });
//     });
// }
// var clicks = {
//     '.acetate-pen i' : function (ev, $this)
//     {
//         _pen = make_pen($this.find('a'));
//         console.log(_pen.colour)
//         $('.acetate-pen i').removeClass('active');
//         $this.addClass('active');
//         $('#activity-console-draw').removeClass('open');
//         _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-draw bp-acetate-erase').addClass('bp-acetate-draw');
//         ev.stopPropagation();
//     }
// }
// setTimeout(function(){
//     bind_clicks(clicks);
// },2000);






// pinch-to-zoom + double tap
var doubleTouchStartTimestamp = 0;

document.addEventListener("touchstart", touchHandler, {passive: false});
function touchHandler(evt){
  var event = evt.originalEvent || evt;
  var now = +(new Date());

  if (doubleTouchStartTimestamp + 500 > now){
      //the event is double-tap
      //you can then prevent the behavior
      event.preventDefault();
  };
  doubleTouchStartTimestamp = now;
  
  if(event.touches.length > 1){
      //the event is multi-touch
      //you can then prevent the behavior
      event.preventDefault()
  }
};
// touch move - overflow
document.addEventListener('touchmove', function(event) {
  event = event.originalEvent || event;

  const target = event.target;
  const parent = target?.offsetParent;

  // List of allowed class names
  const allowedClasses = new Set([
    "recordsSlide",
    "tips_block",
    "allowScroll",
    "ClsThumbLink",
    "leftpagecont",
    "rightpagecont",
    "glossaryText",
    "pageNum",
    "textFoundAt"
  ]);

  const targetClassList = target?.classList;
  const parentClassList = parent?.classList;

  // Check if either target or its offsetParent has an allowed class
  const isAllowed = [...allowedClasses].some(cls =>
    targetClassList?.contains(cls) || parentClassList?.contains(cls)
  );

  if (isAllowed) return;

  if (event.scale !== 1) {
    event.preventDefault();
    event.stopPropagation();
  }
}, { passive: false });


// Disable right-click / contextmenu
document.addEventListener('contextmenu', event => event.preventDefault());

$( document ).ready(function() {

    var activeToolSelection = false;
    var activeDrawingTools = false;
    var isshowHotspot = false;
    var isshowMask = false;
    var isshowEraser = false;

    //  activeToolSelection = false;
	//   activeDrawingTools = false;
	 

    showHotspot = function(){
        $(".DrawIconsContainer").hide();
        if(isshowHotspot){
            EnableAllTool();
            DeselectAllTool();
            isshowHotspot = false;
            $("#canTools").removeClass("showCanvas");
            _$bpc.removeClass('bp-acetate-spotlight-rectangle bp-acetate-draw bp-acetate-erase bp-acetate-spotlight-circle')
        }
        else{
            SelectTool("IcSpotlight");
            isshowHotspot = true;
            isshowMask = false;
            isshowEraser = false;
            $("#canTools").addClass("showCanvas");
            _$bpc.removeClass('bp-acetate-spotlight-rectangle bp-acetate-draw bp-acetate-erase').addClass('bp-acetate-spotlight-circle');
          var $acetate = $('.acetate'), canvas = $acetate.find('.acetate-spotlight-canvas')[0];
          _spotlight = {x: canvas.width / 2, y: canvas.height / 2};
          _spotlight_width = canvas.width / 20;
          _spotlight_height = canvas.height / 20;
          spotlight(canvas, $acetate.find('.acetate-spotlight-hotspot'));
        }
        UnbindNoteEventFromPage(); //remove note crosshair cursor
    };

    showMask = function(){
        $(".DrawIconsContainer").hide();
        if(isshowMask){
            EnableAllTool();
            DeselectAllTool();
            isshowMask = false;
            _$bpc.removeClass('bp-acetate-spotlight-rectangle bp-acetate-draw bp-acetate-erase bp-acetate-spotlight-circle showCanvas');
        }else{            
            SelectTool("IcMaskIcon");
            $("#canTools").addClass("showCanvas");
            isshowMask = true;
            isshowHotspot = false;
            isshowEraser = false;
            _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-draw bp-acetate-erase').addClass('bp-acetate-spotlight-rectangle');
          var $acetate = $('.acetate:visible'), canvas = $acetate.find('.acetate-spotlight-canvas')[0];
          _spotlight = {x: canvas.width / 2, y: canvas.height / 2};
          _spotlight_width = canvas.width / 20;
          _spotlight_height = canvas.height / 20;
          spotlight(canvas, $acetate.find('.acetate-spotlight-hotspot'));
        }

        UnbindNoteEventFromPage(); //remove note crosshair cursor
    };
    
	  toggleDrawTools = function(){

        if($(".cTools").css("display") == "none"){
            $(".cTools").css("display","block");      
            //OpenPenTool();                
        }
        else{
            $(".cTools").css("display","none");  
            //ClosePenTool();                          
        }       

        if(activeDrawingTools){
           // $("#canTools").removeClass("bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-erase bp-acetate-draw showCanvas");
            $(".DrawIconsContainer").hide();
            activeDrawingTools = false;
            activeToolSelection = false;
            isshowHotspot = false;
            isshowMask = false;
            isshowEraser = false;
        }
        else{
            $(".DrawIconsContainer").show();
            return;

            $("#canTools").addClass("showCanvas");
            activeDrawingTools = true;
            $(".DrawIconsContainer").show();
            _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-erase').addClass('bp-acetate-draw');
          acetate_drawing($acetate);
        }
    };

    eraserToolFn_old = function(){
        return;
        _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-draw').addClass('bp-acetate-erase');
        
        // if(isshowEraser){
        //     isshowEraser = false;
        //     _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-draw bp-acetate-erase');
        // }else{
        //     isshowEraser = true;
        //     //$(".DrawIconsContainer").hide();
        //     _$bpc.removeClass('bp-acetate-spotlight-circle bp-acetate-spotlight-rectangle bp-acetate-draw').addClass('bp-acetate-erase');
        // }
       
    };

});