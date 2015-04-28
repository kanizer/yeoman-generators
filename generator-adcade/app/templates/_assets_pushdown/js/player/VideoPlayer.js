/**
 * VideoPlayer component - controls integration, scaling and relative repositioning, video queue
 * @param {object} options Object of display assets
 * @return {Class} Class instance and interface
 *
 *
 * TODO
 * - SETUP TO CYCLE THROUGH QUEUE
 * - RESPONSIVE POS/SIZE
 * - NEW EVENTS
 *
 *
 *
 */
define([
	    'canvas/sprites/Sprite',
	    'canvas/shapes/Cluster',
	    'canvas/shapes/Rectangle',
	    'dom/video/Video',
	    'gen/utils/EventDispatcher'
	],
	function(
		Sprite,
		Cluster,
		Rectangle,
		Video,
		EventDispatcher
	){

	'use strict';
	var VideoPlayer = function(options)
	{
        options = options || {};
        options.shapes = options.shapes || [];

		var _self = this,
		_options = options,
		_master = options.master,
		_stage = options.stage = options.master.stage,

		_model = options.model,
		_isMobile = options.isMobile,

		_currentId = _model.getId(),
		_playPath = options.playPath || 'img/play.png',
		_pausePath = options.pausePath || 'img/pause.png',

		_w = options.w,
		_h = options.h,
		_x = options.x,
		_y = options.y,
		_absX = options.absX || _x,
		_absY = options.absY || _y,
		_rect = options.positionRect,

		_coverImage,
		_btnPlay,
		_btnPause,
		_hit,
		_video,
		_bufferTimer,
		_isPlaying = false,
		_userInit = false,
		_controlsPadding = 20;


		function init()
		{
			// inherit from 'super' class
            Cluster.call(_self, options);

            if(_rect !== undefined)
			{
				checkRect();
			}

			createVideoObject();
			createControls();
		}

		function checkRect()
		{
			var rect = _rect.getRectangle();
			_x = rect.leftX;
			_y = rect.topY;
			_w = rect.rightX - _x;
			_h = rect.bottomY - _y;
			_absX = _x;
			_absY = _y;
		}

		function createVideoObject()
		{
			var metricsLabel = _model.getDtoById(_currentId).metricsLabel;
			var pathArray = [
				_model.getDtoById(_currentId).path + '.mp4',
				_model.getDtoById(_currentId).path + '.webm'
			];

			_video = new Video(
			{
				stage: _stage,
                controls: false, // fixes weird nexus s pause on init play bug!
				name: metricsLabel,
				path: pathArray,
				css: {
					position: 'absolute',
					width: _w + 'px',
					height: _h + 'px',
					left: _absX + 'px',
					top: _absY + 'px',
					backgroundColor: '#000000'
				},
				insert: {
					target: _stage.canvas.el,
					type: 'below'
				},
				onLoaded: onVideoLoaded,
				onTimeUpdate: onVideoUpdate,
				onEnded: onVideoEnded
			});

			addAdditionalEventListeners();

			// check buffer status
			if(_bufferTimer) clearInterval(_bufferTimer);
			_bufferTimer = setInterval(onCheckBuffer, 500);

			if(!_userInit)
			{
				_video.hide();
			}
		}

		function addAdditionalEventListeners()
		{
            // already assigned w/in class
            // _video.el.addEventListener('loadedmetadata', onLoadedHandler, false);
            // _video.el.addEventListener('ended', onEndedHandler, false);
            // _video.el.addEventListener('play', onPlay, false);
            // _video.el.addEventListener('pause', onPause, false);
            // _video.el.addEventListener('timeupdate', onTimeUpdate, false);


            // http://www.w3schools.com/tags/ref_av_dom.asp
            _video.el.addEventListener('canplay', onCanPlay, false);
            _video.el.addEventListener('canplaythrough', onCanPlayThrough, false);
            _video.el.addEventListener('playing', onBufferRefilled, false);
		}

		function createControls()
		{
			_btnPlay = new Sprite({
				stage: _stage,
				path: _playPath,
				x: _w - _controlsPadding,
				y: _h - _controlsPadding,
				alpha: 1,
				display: true
			});
			_self.add(_btnPlay);

			_btnPause = new Sprite({
				stage: _stage,
				path: _pausePath,
				x: _w - _controlsPadding,
				y: _h - _controlsPadding,
				alpha: 1,
				display: true
			});
			_self.add(_btnPause);

			_hit = new Rectangle({
				stage: _stage,
				width : _w,
				height : _h,
				alpha: 0,
				fillStyle : '#ff0000',
				onClick: onHitClick
			});
			_self.add(_hit);

			_coverImage = new Sprite({
				stage: _stage,
				path: _model.getDtoById(_currentId).coverImage,
			});
			_self.add(_coverImage);
		}


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.play = function(isAuto)
		{
			_isPlaying = true;

			if(isAuto) _video.play('auto');
			else _video.play();

			_video.show();

			// set buttons
			_btnPlay.set({display: false});
			_btnPause.set({display: true});

			if(_coverImage.killAllTweens) _coverImage.killAllTweens();
			_coverImage.tween({
				duration: 150,
				alpha: 0,
				onComplete: function()
				{
					_coverImage.set({display: false});
				}
			});
			_self.set({display: true});

			// android browser fix
			_master.forceRefreshOnAndroidBrowser();
		};

		this.pause = function(isAuto)
		{
			_isPlaying = false;

			if(isAuto) _video.pause('auto');
			else _video.pause();

			// set buttons
			_btnPlay.set({display: true});
			_btnPause.set({display: false});

			// android browser fix
			_master.forceRefreshOnAndroidBrowser();
		};

		this.stop = function(isAuto)
		{
			_isPlaying = false;

			if(isAuto) _video.pause('auto');
			else _video.stop();

			_video.el.currentTime = 0;
			_video.hide();

			_btnPlay.set({display: true});
			_btnPause.set({display: false});

			if(_coverImage.killAllTweens) _coverImage.killAllTweens();
			_coverImage.set({display: true});
			_coverImage.tween({
				duration: 150,
				alpha: 1
			});

			// android browser fix
			_master.forceRefreshOnAndroidBrowser();
		};

		this.show = function()
		{
			_self.set({display: true});
			_video.show();
		};

		this.hide = function()
		{
			_self.set({display: false});
			_video.hide();
		};

		this.swapVideo = function(id)
		{
			_userInit = true;
			_currentId = id;

			_video.remove();

			createVideoObject();

			// android browser fix
			_master.forceRefreshOnAndroidBrowser();
		};


		//----------------------------------------------------------------------
		//
		// HANDLERS
		//
		//----------------------------------------------------------------------
		function onVideoLoaded()
		{
			console.log('VideoPlayer.js: onVideoLoaded');
		}

		function onVideoEnded()
		{
			EventDispatcher.dispatch(_stage.container.el, 'VIDEO_ENDED');
			_self.stop(true);
		}

		function onCanPlay(e)
		{
			console.log('VideoPlayer.js: onCanPlay: e:', e);

			if(!_isMobile && _userInit)
			{
				_self.play();
			}
		}

		function onCanPlayThrough(e)
		{
			console.log('VideoPlayer.js: onCanPlayThrough: e:', e);
		}

		function onBufferRefilled(e)
		{
			console.log('VideoPlayer.js: onBufferRefilled: e:', e);
		}

		function onVideoUpdate(e)
		{
			// console.log('VideoPlayer.js: onVideoUpdate: e:', e);

			var vid = e.target;
			// console.log('VideoPlayer.js: onVideoUpdate: vid:');
			// console.dir(vid);

			// currentpos: timestamp
			var duration = Math.round(vid.duration * 100) / 100,
			played = 0;
			
			if(vid.played.length === 1)
			{
				played = Math.round(vid.played.end(0) * 100) / 100;
				// console.log('VideoPlayer.js: vid.played:', played + ' / ' + duration);
			}
		}

		function onCheckBuffer()
		{
			// BEFORE PLAYING WILL ONLY BUFFER TO THE POINT OF CANPLAYTHROUGH

			// console.log('VideoPlayer.js: onCheckBuffer', vid.buffered.end(0));

			var vid = _video.el;
			var duration = Math.round(vid.duration * 100) / 100,
			buffered = 0;
			
			if(vid.buffered.length === 1)
			{
				buffered = Math.round(vid.buffered.end(0) * 100) / 100;
				// console.log('VideoPlayer.js: vid.buffered:', buffered + ' / ' + duration);

				if(vid.buffered.end(0) >= vid.duration - 0.001)
				{
					clearInterval(_bufferTimer);
				}
			}
		}

		function onHitClick()
		{
			if(!_isPlaying) _self.play();
			else _self.pause();
		}


		//----------------------------------------------------------------------
		//
		// SETTER/GETTER
		//
		//----------------------------------------------------------------------
		this.isPlaying = function()
		{
			return _isPlaying;
		};

		this.resize =
		this.setPosition = function(options)
		{
			options = options || {};

			// get new rectangle
			if(_rect !== undefined)
			{
				checkRect();
			}

			// use options params or rectangle vals
			_absX = options.x || _absX;
			_absY = options.y || _absY;
			_video.el.style.left = _absX + 'px';
			_video.el.style.top = _absY + 'px';

			_w = options.w || _w;
			_h = options.h || _h;
			_video.el.width = _w;
			_video.el.height = _h;
			_video.el.style.width = _w + 'px';
			_video.el.style.height = _h + 'px';

			_coverImage.set({
				width: _w,
				height: _h
			});

			_btnPlay.set({
				x: _w - _controlsPadding,
				y: _h - _controlsPadding
			});

			_btnPause.set({
				x: _w - _controlsPadding,
				y: _h - _controlsPadding
			});

			_hit.set({
				width : _w,
				height : _h,
			});

			_self.set({
				x: _absX,
				y: _absY
			});
		};


		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
		init();

	};

	return VideoPlayer;
});