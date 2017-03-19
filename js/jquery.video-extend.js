
/**
 * HTML5 Video Extend
 *
 * jQuery plugin (MIT license)
 *
 * @version 1.1.3
 * @author <andchir@gmail.com> Andchir
 */

(function($){

    "use strict";
    
    var videoExtend = function(el, options){
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.player = el;
        base.timer = null;
        
        // Add a reverse reference to the DOM object
        base.$el.data('videoExtend', base);
        
        // Initialize
        base.init = function(){
            
            var attributes = base.getAttributes();
            base.options = $.extend({}, videoExtend.defaultOptions, options, attributes);
            base.browser = base.getBrowserName();
            
            var video_src = base.$el.attr('src') || base.$el.children('source').attr('src'),
                poster = base.$el.attr('poster');
            base.isYouTube = /youtube\.com|youtu\.be/.test( video_src );
            base.isFlashVideo = video_src.substr( video_src.length - 4 ) == '.flv';
            if ( base.isYouTube ) {
                base.embedYoutube( video_src );
            }
            else if ( base.isFlashVideo ) {
                base.embedFlashVideo( video_src );
            }
            else {
                
                base.$el
                    .css({
                        display: 'block',
                        backgroundColor: base.options.backgroundColor
                    })
                    .bind('play pause mouseover mouseout', base.eventsHandler)
                    .bind('canplay',function(){
                        if ( !base.options.initialized ) {
                            base.addMarkers();
                        }
                        base.options.initialized = true;
                    });
                
            }
            
            base.makeResponsive();
            base.addLogo();
            
            if ( base.isFlashVideo && poster ) {
                base.addPoster( poster );
            }
            
        };
        
        // Get browser name
        base.getBrowserName = function(){
            
            var userAgent = navigator.userAgent,
                browser = 'unknown';
            
            if ( /msie/i.test(userAgent) || /edge/i.test(userAgent) || "ActiveXObject" in window )
                browser = 'ie';
            else if ( /firefox/i.test(userAgent) )
                browser = 'firefox';
            else if ( /\x20OPR\//.test(userAgent) )
                browser = 'opera';
            else if ( /chrome|chromium/i.test(userAgent) )
                browser = 'chrome';
            else if ( /safari/i.test(userAgent) )
                browser = 'safari';
            else if ( /iphone/i.test(userAgent) ) {
                browser = 'iphone';
            }
            else if ( /ipad/i.test(userAgent) ) {
                browser = 'ipad';
            }
            
            return browser;
            
        };
        
        base.getAttributes = function(){
            var attributes = {};
            $.each( base.$el.get(0).attributes, function( index, attr ) {
                if( attr.name.indexOf('data-') > -1 ) {
                    var value = attr.value;
                    if( /\[(.*)\]/.test( value ) )
                        value = $.parseJSON( value );
                    attributes[ attr.name.substr(5) ] = value;
                }
            });
            return attributes;
        };
        
        base.eventsHandler = function(e){

            var markers_container;
            
            switch( e.type ){
                case 'play':
                    
                    if ( base.options.logoAutoHide ) {
                        clearTimeout( base.timer );
                        base.timer = setTimeout(function(){
                            base.$el.parent().find('.video-extend-logo-container').fadeOut(1000);
                        },1500);
                    }
                    
                    break;
                case 'pause':
                    
                    if ( base.options.logoAutoHide ) {
                        if ( !base.player.seeking ) {
                            clearTimeout( base.timer );
                            base.$el.parent().find('.video-extend-logo-container')
                                .stop().css('opacity',1).show();
                        }
                    }
                    
                    break;
                case 'mouseover':
                    
                    markers_container = base.$el.parent().find('.video-extend-progress-bar');
                    
                    if ( base.options.markers && markers_container.length > 0 ) {
                        markers_container.show();
                    }
                    
                    break;
                case 'mouseout':
                    
                    markers_container = base.$el.parent().find('.video-extend-progress-bar');
                    
                    if ( base.options.markers && markers_container.length > 0 ) {
                        markers_container.hide();
                    }
                    
                    break;
            }
            
        };
        
        base.getControlsSize = function( browser ){
            
            browser = browser || base.browser;
            var size = { left: 120, right: 220, bottom: 20 };
            
            switch ( browser ) {
                case 'ie':
                    size.left = 165;
                    size.right = 140;
                    size.bottom = 36;
                    break;
                case 'firefox':
                    size.left = 28;
                    size.right = 128;
                    size.bottom = 19;
                    break;
                case 'opera':
                    size.left = 50;
                    size.right = 150;
                    size.bottom = 20;
                    break;
                case 'safari':
                    size.left = 90;
                    size.right = 100;
                    size.bottom = 30;
                    break;
                case 'chrome':
                    //default
                    break;
            }
            
            return size;
            
        };
        
        // Add logo
        base.addLogo = function(){
            
            if ( !base.options.logo ) {
                return;
            }
            
            var logo = $('<img/>',{
                    src: base.options.logo
                })
                .css({
                    position: 'absolute',
                    zIndex: 200,
                    width: base.options.logoSize[0],
                    height: base.options.logoSize[1],
                    top: !isNaN( base.options.logoPosition[2] )
                        ? base.$el.outerHeight(true) - base.options.logoSize[1] - base.options.logoPosition[2]
                        : base.options.logoPosition[0],
                    right: base.options.logoPosition[1],
                    bottom: 'auto',
                    left: base.options.logoPosition[3]
                })
                .appendTo('<div/>')
                .parent()
                .addClass('video-extend-logo-container')
                .css({
                    position: 'relative',
                    width: base.options.responsive ? '100%' : base.$el.width()
                });
            
            if ( base.options.logoLink ) {
                logo.children('img')
                    .css('cursor','pointer')
                    .bind('click',function(){
                        var win = window.open(base.options.logoLink, '_blank');
                        win.focus();
                    });
            }
            
            base.$el
                .before(logo);
            
        };
        
        // Make responsive
        base.makeResponsive = function(){
            
            if ( !base.options.responsive ) {
                return;
            }
            
            var maxWidth = base.$el.attr('width') || base.$el.width();
            
            base.$el
                .wrap('<div></div>')
                .css({
                    width: '100%'
                })
                .parent()
                .addClass('video-extend-wrapper')
                .css({
                    width: '100%',
                    maxWidth: maxWidth + 'px'
                });
                
                if ( base.options.alignCenter ) {
                    base.$el.parent('.video-extend-wrapper')
                        .css('margin', '0 auto');
                }
            
            $( window )
                .bind('resize',function(){
                    
                    if ( base.$el.parent().find('.video-extend-progress-bar').length > 0 ) {
                        
                        var playerControlsSize = base.getControlsSize();
                        base.$el.parent().find('.video-extend-progress-bar')
                            .css({
                                width: base.$el.width() - playerControlsSize.left - playerControlsSize.right
                            });
                        
                    }
                    
                    base.centerPoster();
                    
                });
            
        };
        
        // Add markers
        base.addMarkers = function(){
            
            if ( !base.options.markers || base.options.markers.length == 0 ) {
                return;
            }
            
            base.addProgressBarControl();
            
            setTimeout(function(){
                
                var duration = base.player.duration,
                    markers_container = base.$el.next('.video-extend-progress-bar'),
                    playerControlsSize = base.getControlsSize();
                
                if ( !duration ) {
                    return;
                }
                
                base.options.markers.forEach(function(marker){
                    
                    var percent = parseInt( marker.time / duration * 100 );
                    var marker_el = $('<div/>',{
                            title: marker.text
                        })
                        .css({
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#eee',
                            border: '1px solid #777',
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '-' + playerControlsSize.bottom + 'px',
                            left: percent + '%',
                            marginLeft: '-4px'
                        })
                        .appendTo( markers_container );
                    
                    marker_el
                        .bind('click', function(){
                            base.player.currentTime = marker.time;
                        })
                        .bind('mouseover mouseout', function(){
                            markers_container.show();
                        });
                    
                });
                
            }, 500);
            
        };
        
        // Add progress bar control
        base.addProgressBarControl = function(){
            
            var playerWidth = base.$el.width(),
                playerControlsSize = base.getControlsSize();
                
            $('<div/>')
                .insertAfter(base.$el)
                .addClass('video-extend-progress-bar')
                .css({
                    position: 'relative',
                    left: playerControlsSize.left,
                    width: playerWidth - playerControlsSize.left - playerControlsSize.right,
                    height: 0
                });
            
        };
        
        // Embed YouTube video
        base.embedYoutube = function( video_src ){
            
            var videoWidth = base.$el.width(),
                videoHeight = base.$el.height(),
                frame_id = 'video' + new Date().getTime(),
                video_id = base.getYoutubeVideoId( video_src );
            
            var youtubeIframe = $('<iframe/>',{
                    src: 'https://www.youtube-nocookie.com/embed/' + video_id + '?enablejsapi=1&origin=' + window.location.origin,
                    id: frame_id,
                    frameborder: 0,
                    width: videoWidth,
                    height: videoHeight
                })
                .css({
                    width: videoWidth,
                    height: videoHeight
                })
                .insertAfter( base.$el )
                .on('load', function(){
                    base.loadYTApi( frame_id );
                });
            
            base.$el.remove();
            base.$el = youtubeIframe;
            
        };
        
        // Get YouTube video ID
        // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        base.getYoutubeVideoId = function( url ){
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length==11){
                return match[7];
            }
            return '';
        };
        
        base.loadYTApi = function( frame_id ){
            
            if ( $('#yt_iframe_api').length == 0 ) {
                
                $('<script/>',{
                        src: 'https://www.youtube.com/iframe_api',
                        id: 'yt_iframe_api'
                    })
                    .insertAfter($('script:last'));
                
                window.onYouTubeIframeAPIReady = function() {
                    base.setupYTEvents( frame_id );
                };
                
            }
            else {
                base.setupYTEvents( frame_id );
            }
            
        };
        
        base.setupYTEvents = function( frame_id ){
            
            base.player = new YT.Player(frame_id, {
                events: {
                    "onStateChange": function(event){
                        switch(event.data){
                            case 1:// play
                                base.eventsHandler({type:'play'});
                                break;
                            case 2:// pause
                                base.eventsHandler({type:'pause'});
                                break;
                        }
                    }
                }
            });
            
        };
        
        // Embed Flash video
        base.embedFlashVideo = function( video_src ){
            
            var videoWidth = base.$el.width(),
                videoHeight = base.$el.height(),
                obj_id = 'video' + new Date().getTime(),
                attributes = {
                    id: obj_id,
                    name: obj_id,
                    type: 'application/x-shockwave-flash',
                    data: base.options.swfPath,
                    wmode: 'opaque',
                    width: videoWidth,
                    height: videoHeight,
                    bgcolor: base.options.backgroundColor
                },
                params = {
                    movie: base.options.swfPath,
                    flashvars: '',//'readyFunction=videoExtend_flashOnReady',
                    allowScriptAccess: 'always',
                    allowNetworking: 'all'
                };
                
            var objTag = '<object type="application/x-shockwave-flash"';
            for( var key in attributes ){
                if ( attributes.hasOwnProperty( key ) ) {
                    objTag += ' ' + key + '="' + attributes[key] + '"';
                }
            }
            objTag += '>';
            
            for( var key in params ){
                if ( params.hasOwnProperty( key ) ) {
                    objTag += "\n" + '<param name="' + key + '" value="' + params[key] + '" />';
                }
            }
            
            objTag += "\n" + '</object>';
            
            base.$el.after( objTag );
            base.$el.remove();
            base.$el = $('#'+obj_id);
            
            setTimeout(function(){
                if ( /http:\/\/|https:\/\//.test( video_src ) === false && video_src.substr(0,1) != '/' ) {
                    video_src = window.location.pathname + video_src;
                }
                base.player = base.$el.get(0);
                base.player.vjs_src( video_src );
                if ( base.options.autoPlay ) {
                    base.player.vjs_play();
                }
            },1000);
            
        };
        
        // Add poster
        base.addPoster = function( posterUrl ){
            
            if( posterUrl ){
                var posterImg = $('<img/>',{
                    src: posterUrl,
                    title: base.options.textPlay
                })
                .css({
                    width: 'auto',
                    maxWidth: 'none',
                    height: base.$el.height(),
                    cursor: 'pointer'
                })
                .appendTo('<div/>')
                .parent()
                    .bind('click',function(){
                        if ( base.isFlashVideo ) {
                            $('img',this).hide();
                            if ( base.isPlaying ) {
                                base.player.vjs_pause();
                                base.isPlaying = false;
                                base.eventsHandler({type:'pause'});
                            } else {
                                base.player.vjs_play();
                                base.isPlaying = true;
                                base.eventsHandler({type:'play'});
                            }
                        }
                    })
                    .css({
                        width: base.options.responsive ? '100%' : base.$el.width(),
                        height: base.$el.height(),
                        overflow: 'hidden',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        textAlign: 'center'
                    })
                    .appendTo('<div/>')
                    .parent()
                        .addClass('video-extend-poster-container')
                        .css({
                            position: 'relative',
                            width: base.options.responsive ? '100%' : base.$el.width()
                        })
                        .insertBefore( base.$el );
                
                base.centerPoster();
            }
            
        };
        
        base.centerPoster = function(){
            
            var poster_wrapper = base.$el.parent().find('.video-extend-poster-container');
            
            if ( poster_wrapper.length > 0 ) {
                
                var $image = poster_wrapper.find('img'),
                    wrapper_width = poster_wrapper.width(),
                    image_width = $image.width();
                
                $image
                    .css({
                        marginLeft: ( ( wrapper_width - image_width ) / 2 ) + 'px'
                    });
            }
            
        };
        
        base.init();
    };
    
    // Default options
    videoExtend.defaultOptions = {
        backgroundColor: '#000',
        logo: '',
        logoLink: '',
        logoSize: [ 50, 50 ], // width, height
        logoPosition: [ 10, 10, 'auto', 'auto' ], // top, right, bottom, left
        logoAutoHide: true,
        responsive: true,
        alignCenter: true,
        markers: [],
        swfPath: 'swf/video-js.swf',
        autoPlay: false,
        textPlay: 'Play video',
        onPlay: null,
        onPause: null
    };
    
    $.fn.videoExtend = function(options){
        return this.each(function(){
            new videoExtend(this, options);
        });
    };
    
})(jQuery);
