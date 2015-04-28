define([
	'canvas/shapes/Cluster',
	'canvas/shapes/Rectangle',
	'canvas/sprites/Sprite',
	'gen/utils/EventDispatcher',
	'assets/js/shape/Knockout',
    'assets/js/player/VideoPlayer',
    'assets/js/player/VideoModel'
],
function(
	Cluster,
	Rectangle,
	Sprite,
	EventDispatcher,
	Knockout,
	VideoPlayer,
	VideoModel
){
	var ExpandedView = function(options) {

        options = options || {};
        var self = this,
        master = options.master || (function(){throw new Error('ExpandedView.js: reference to master was not defined.');})(),
        stage = options.stage = master.stage,
        isMobile = options.isMobile || false,
        clickthrough = options.clickthrough || '';

        // 'public' props
        this.w = options.width || stage.canvas.el.width;
        this.h = options.height || stage.canvas.el.height;

        var _bg,
        _stroke,
        _hit,
        _hitClose,
        _videoModel,
        _video,
        _videoData = [{
            id: '00',
            coverImage: 'img/cover.jpg',
            video: 'vid/vid',
            metricsLabel: 'generic'
        }],

        VIDW = 496,
        VIDH = 279;


		//----------------------------------------------------------------------
		//
		// PRIVATE METHODS
		//
		//----------------------------------------------------------------------
		function init(options)
		{
			// inherit from 'super' class
            Cluster.call(self, options);
            addEventListeners();
            addDisplayItems();
            addVideo();
		}

		function addEventListeners()
		{
			stage.container.el.addEventListener('ADCADE_EVENT', onAdcadeEvent, false);
		}
		
		function addDisplayItems()
		{
			_bg = new Knockout({
				stage: stage,
				path: 'img/bg_brick.jpg',
				w: self.w,
				h: self.h,
				// alpha: 0.3,
				rect: {
					leftX: 432 + 2,
					topY: 52 + 2,
					rightX: 432 + VIDW - 2,
					bottomY: 52 + VIDH - 2
				}
			});
			self.add(_bg);

			_stroke = new Rectangle({
				stage: stage,
				x: -1,
				y: -1,
				width: self.w,
				height: self.h,
				// alpha: 0,
				// display: false,
				strokeStyle: '#444',
				lineWidth: 1
			});
			self.add(_stroke);

			_hit = new Rectangle({
				stage: stage,
				width: self.w,
				height: self.h,
				alpha: 0,
				// display: false,
				fillStyle: '#ff0000',
				onClick: onHitClick
			});
			self.add(_hit);

			_hitClose = new Rectangle({
				stage: stage,
				x: self.w,
				width: 150,
				height: 50,
				alpha: 0.3,
				// display: false,
				registration: 'top right',
				fillStyle: 'red',
				onClick: onCloseClick
			});
			self.add(_hitClose);
		}

        function addVideo()
        {
            _videoModel = new VideoModel({
                master: master,
                data: _videoData,
            });

            _video = new VideoPlayer({
                master: master,
                model: _videoModel,
                isMobile: isMobile,
                x: _bg.getRectangle().leftX - 2,
                y: _bg.getRectangle().topY - 2,
                w: VIDW,
                h: VIDH
            });
            self.add(_video);
            // _video.moveToBottom();
        }


		//----------------------------------------------------------------------
		//
		// HANDLERS
		//
		//----------------------------------------------------------------------
		function onHitClick()
		{
            master.metricsDispatcher.sendExit({
                key: 'Clickthrough',
                url: clickthrough
            });

            // if(_video.isPlaying()) 
			_video.stop(true);
			EventDispatcher.dispatch(stage.container.el, 'CLOSE_PUSHDOWN_CLICKED', {auto: true});
		}

		function onCloseClick()
		{
            // if(_video.isPlaying()) 
            _video.stop(true);
			EventDispatcher.dispatch(stage.container.el, 'CLOSE_PUSHDOWN_CLICKED', {auto: false});
		}


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.fade = function(dur, targetAlpha, autoAlpha, callback)
		{
			if(autoAlpha && targetAlpha > 0) self.set({ display: true });
			self.tween({
				duration: dur,
				easing: 'easeOutQuad',
				alpha: targetAlpha,
				onComplete: function()
				{
					if(autoAlpha && targetAlpha === 0) self.set({ display: false });
					if(callback !== undefined) callback();
				}
			});
		};

        this.autoplayVideo = function()
        {
            _video.play(true);
        };

        this.resetVideo = function()
        {
            _video.stop(true);
        };


		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
		init(options);

	};

	// event key static constants
	ExpandedView.CLOSE_PUSHDOWN_CLICKED = 'CLOSE_PUSHDOWN_CLICKED';

	return ExpandedView;
});