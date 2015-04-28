define([
	'canvas/shapes/Cluster',
	'canvas/shapes/Rectangle',
	'gen/utils/EventDispatcher',
    'assets/js/anim/ExtendedTween',
    'assets/js/ui/HeaderFooter',
    'assets/js/util/SwipeDetect'
],
function(
	Cluster,
	Rectangle,
	EventDispatcher,
	ExtendedTween,
	HeaderFooter,
	SwipeDetect
){
	var FrameController = function(options) {
		var self = this;

        // params
        options = options || {};
        var master = options.master || (function(){throw new Error('FrameController.js: reference to master was not defined.');})();
        var stage = options.stage = master.stage;

        // 'public' props
        this.model = options.model || (function(){throw new Error('FrameController.js: model not defined.');})();
        this.w = options.width || stage.canvas.el.width;
        this.h = options.height || stage.canvas.el.height;
        this.isMobile = options.isMobile || false;

        var _header,
        _footer,
        _hitHeader,
        _hitFooter,
        _hitSwipe,
        _wrapper,

        _swipeUtil = new SwipeDetect(),
        _isSwiping = false,
        _isInTransition = false;


		//----------------------------------------------------------------------
		//
		// PRIVATE METHODS
		//
		//----------------------------------------------------------------------
		function init(options)
		{
			// inherit from 'super' class
	        Cluster.call(self, options);
            addDisplayItems();
		}

		function addDisplayItems()
		{
            _header = new HeaderFooter({
                stage: stage,
                width: self.w,
                height: 50,
                label: self.model.getDtoByIndex(self.model.getNextIndex(-1)).label,
                isHeader: true
            });

            _footer = new HeaderFooter({
                stage: stage,
                width: self.w,
                height: 50,
                y: '100%',
                registration: 'bottom left',
                label: self.model.getDtoByIndex(self.model.getNextIndex(1)).label
            });

            _hitHeader = new Rectangle({
                stage: stage,
                width: _header.width,
                height: _header.height,
                fillStyle: '#F00',
                alpha: 0,
                // display: false,
                onClick: onNavClicked,
                onTriggerOver: onNavOver,
                onTriggerOut: onNavOut
            });

            _hitFooter = new Rectangle({
                stage: stage,
                width: _footer.width,
                height: _footer.height,
                y: _footer.y,
                registration: 'bottom left',
                fillStyle: 'blue',
                alpha: 0,
                // display: false,
                onClick: onNavClicked,
                onTriggerOver: onNavOver,
                onTriggerOut: onNavOut
            });

            _wrapper = new Cluster({
                stage: stage,
                shapes: [
                    _header,
                    _footer,
                    _hitHeader,
                    _hitFooter
                ]
            });
            self.add(_wrapper);

            _hitSwipe = new Rectangle({
                stage: stage,
                width: '100%',
                height: '100%',
                fillStyle: 'blue',
                alpha: 0,
                onTriggerDown: onSwipeDown,
                onTriggerUp: onSwipeUp,
                display: self.isMobile,
                clickPropagation: true
            });
            self.add(_hitSwipe);

            // show init pulse of arrows
            setTimeout(function()
            {
                _header.showOver();
                _footer.showOver();
            }, 500);

            setTimeout(function()
            {
                _header.showOver();
                _footer.showOver();
                _hitHeader.set({display: true});
                _hitFooter.set({display: true});
            }, 1200);
		}

        function stopDrag(e)
        {
            if(e){
                var swipeEndObj = _swipeUtil.checkEnd(e);
                var dir = swipeEndObj.direction;
                // var vel = swipeEndObj.velocity;

                if(dir === 'up' || dir === 'down')
                {
                    // UPDATE FRAMES
                    var pol = dir === 'down' ? -1 : 1;
                    updateFrame(pol);
                }
            }
            _isSwiping = false;
        }

        function updateFrame(pol)
        {
            if(!_isInTransition)
            {
                _isInTransition = true;

                // UPDATE TARGET INDEX
                // console.log('FrameController.js: updateFrame: self.model.getIndex():', self.model.getIndex());
                // console.log('FrameController.js: updateFrame: pol:', pol);
                // console.log('FrameController.js: updateFrame: self.model.getNextIndex(pol):', self.model.getNextIndex(pol));
                self.model.setIndex(self.model.getNextIndex(pol));


                // UPDATE NAV ITEMS / ARROWS STATES
                _header.updateLabel(pol, self.model.getDtoByIndex(self.model.getNextIndex(-1)).label);
                _footer.updateLabel(pol, self.model.getDtoByIndex(self.model.getNextIndex(1)).label);


                // TRANSITION OUT PREVIOUS SLIDE
                var dto = self.model.getDtoByIndex(self.model.getNextIndex(pol * -1)),
                dur = 800,
                del = 0,
                ease = 'easeOutQuint',
                prevFrame = self.model.getFrameById(dto.id),
                start = { y: 0, easing: ease },
                end = { y: pol * -600 };
                ExtendedTween.animateFromTo(prevFrame, dur, del, start, end);


                // TRANSITION IN CURRENT SLIDE
                start = { y: pol * 600 };
                end = { y: 0, easing: ease};
                dto = self.model.getDtoByIndex(self.model.getIndex());
                var currentFrame = self.model.getFrameById(dto.id);
                ExtendedTween.animateFromTo(currentFrame, dur, del, start, end,
                    function(){
                        // don't allow frame transitions to pile up
                        _isInTransition = false;
                    });


                // SEND COUNTER FOR FRAME SWITCH
                master.metricsDispatcher.sendCounter({
                    key : 'toggle_' + dto.id
                });


                // HANDLE VIDEO FRAME
                // if(currentFrame == _frameVideo){
                //     var video = _frameVideo.getVideo();
                //     if(video){
                //        _frameVideo.showVideo();
                //     }else{
                //         console.log('WARNING : video is empty!!!');
                //     }
                // }

                // if(prevFrame == _frameVideo)
                // {
                //     _frameVideo.resetVideo();
                // }
            }
        }


		//----------------------------------------------------------------------
		//
		// HANDLERS
		//
		//----------------------------------------------------------------------
        function onNavClicked()
        {
            var pol = this === _hitHeader ? -1 : 1;
            updateFrame(pol);
        }

        function onNavOver()
        {
            var tar = this === _hitHeader ? _header : _footer;
            tar.showOver();
        }

        function onNavOut()
        {
            var tar = this === _hitHeader ? _header : _footer;
            tar.showOut();
        }

        function onSwipeDown(e)
        {
            _isSwiping = true;
            _swipeUtil.setStart(e);
        }

        function onSwipeUp(e)
        {
            if(_isSwiping) stopDrag(e);
        }


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.setTriggerOut = function(e)
		{
            if(_isSwiping) stopDrag(e);
		};


		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
		init(options);

	};

	return FrameController;
});