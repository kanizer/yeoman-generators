/**
 * Punch a hole into an object - primarily for porthole to video element
 * @param {Stage} options Object with configuration parameters.
 * @return {Knockout} A cluster object containing the punched out shape
 */
define([
		'canvas/sprites/Sprite',
		'canvas/shapes/Cluster',
		'canvas/shapes/Rectangle'
	],
	function(
		Sprite,
		Cluster,
		Rectangle
	){

	var Knockout = function(options) { //stage, path, rect

        var self = this;
        var options = options || {};
        var stage = options.stage;
		var path = options.path || '';
		var rect = options.rect;
		var positionRect = options.positionRect;
		var w = options.w;
		var h = options.h;

        var top;
        var left;
        var right;
        var bottom;
        var rectTop;
        var rectLeft;
        var rectRight;
        var rectBottom;



		//----------------------------------------------------------------------
		//
		// PRIVATE METHODS
		//
		//----------------------------------------------------------------------
		var init = function(){
			Cluster.call(self, options);

			if (path === '') {
				throw new Error('snippets.shape.Knockout: No image path defined.');
			}
			else if(positionRect !== undefined) {

				checkRectangle();

				drawImage();
				drawClips();
				update();
			}
			else if (rect === undefined) {
				throw new Error('snippets.shape.Knockout: No rectangle defined.');
			}
			else {
				drawImage();
				drawClips();
				update();
			}
		};

		var drawImage = function(){
			top = new Sprite({
				stage: stage,
				path: path,
				display: false
			});
			self.add(top);

			left = new Sprite({
				stage: stage,
				path: path,
				display: false
			});
			self.add(left);

			right = new Sprite({
				stage: stage,
				path: path,
				display: false
			});
			self.add(right);

			bottom = new Sprite({
				stage: stage,
				path: path,
				display: false,
				onLoaded: onImageLoaded
			});
			self.add(bottom);
		};

		var drawClips = function(){
			var tarA = 0.4;
			var fillColor = '#'+Math.floor(Math.random()*16777215).toString(16);

			// reveal img
			top.set({display: true});
			left.set({display: true});
			right.set({display: true});
			bottom.set({display: true});

			// draw masks
			rectTop = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
				alpha: tarA
			});
			self.add(rectTop);

			rectLeft = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
				alpha: tarA
			});
			self.add(rectLeft);

			rectRight = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
				alpha: tarA
			});
			self.add(rectRight);

			rectBottom = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
				alpha: tarA
			});
			self.add(rectBottom);

			// clip/mask
			top.set({clipObjects:[rectTop]});
			left.set({clipObjects:[rectLeft]});
			right.set({clipObjects:[rectRight]});
			bottom.set({clipObjects:[rectBottom]});

			// set display mode to freeze
			// self.freeze();
		};

		var update = function(){
			// w = top.width;
			// h = top.height;

			self.setRectangle(rect);
		};

		var checkRectangle = function(){

			rect = positionRect.registerMode === 4 ?
				{
					// centered
	                leftX: positionRect.x - Math.round(positionRect.width/2),
	                topY: positionRect.y - Math.round(positionRect.height/2),
	                rightX: positionRect.x + positionRect.width - Math.round(positionRect.width/2),
	                bottomY: positionRect.y + positionRect.height - Math.round(positionRect.height/2),
	            } :
				{
					// presume top left
	                leftX: positionRect.x,
	                topY: positionRect.y,
	                rightX: positionRect.x + positionRect.width,
	                bottomY: positionRect.y + positionRect.height,
	            };
		};


		//----------------------------------------------------------------------
		//
		// HANDLERS
		//
		//----------------------------------------------------------------------
		var onImageLoaded = function()
		{
			// set width based on loaded bmp
			if(rectTop) update();
		};


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.resize =
		this.setRectangle = function(newRect, newW, newH)
		{
			// resize and reposition masks
			// self.unfreeze();
			
			// resize stage bounds (optional)
			if (newW !== undefined && newH !== undefined) {
				w = newW;
				h = newH;
			}

			// use positionRect if available
			if (positionRect !== undefined) {
				checkRectangle();
			}
			else {
				rect = newRect;
			}

			rectTop.set({
				width: w,
				height: rect.topY + 1
			});

			rectLeft.set({
				width: rect.leftX + 1,
				height: rect.bottomY - rect.topY,
				y: rect.topY
			});

			rectRight.set({
				width: w - rect.rightX + 1,
				height: rect.bottomY - rect.topY,
				x: rect.rightX - 1,
				y: rect.topY
			});

			rectBottom.set({
				width: w,
				height: h - rect.bottomY + 1,
				y: rect.bottomY - 1
			});
			
			// self.freeze();
		};

		this.getRectangle = function()
		{
			return rect;
		};


		//----------------------------------------------------------------------
		//
		// KICKOFF
		//
		//----------------------------------------------------------------------
		init();

	};

	return Knockout;
});