/**
 * Punch a hole into an object - primarily for porthole to video element
 * @param {Stage} options Object with configuration parameters.
 * @return {KnockoutShape} A cluster object containing the punched out shape
 */
define([
		'canvas/shapes/Cluster',
		'canvas/shapes/Rectangle'
	],
	function(
		Cluster,
		Rectangle
	){

	'use strict';

	var KnockoutShape = function(options) { //stage, rect, width, height, fillStyle

        var self = this;
        var options = options || {};
        var stage = options.stage;
		var rect = options.rect;
		var positionRect = options.positionRect;
		var fillColor = options.fillStyle;
		var w = options.width;
		var h = options.height;

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

			if(positionRect !== undefined) {

				checkRectangle();

				drawClips();
				update();
			}
			else if (rect === undefined) {
				throw new Error('snippets.shape.KnockoutShape: No rectangle defined.');
			}
			else {
				drawClips();
				update();
			}
		};

		var drawClips = function(){
			// draw shapes
			rectTop = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
			});
			self.add(rectTop);

			rectLeft = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
			});
			self.add(rectLeft);

			rectRight = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
			});
			self.add(rectRight);

			rectBottom = new Rectangle({
				stage: stage,
				fillStyle: fillColor,
			});
			self.add(rectBottom);

			self.freeze();
		};

		var update = function(){
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
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.resize =
		this.setRectangle = function(newRect, newW, newH){
			// resize and reposition masks
			self.unfreeze();

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

			self.freeze();
		};

		this.getRectangle = function(){
			return rect;
		};


		//----------------------------------------------------------------------
		//
		// KICKOFF
		//
		//----------------------------------------------------------------------
		init();

	};

	return KnockoutShape;
});