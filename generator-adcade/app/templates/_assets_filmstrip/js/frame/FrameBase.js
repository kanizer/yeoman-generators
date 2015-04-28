/**
 * @class
 * @name frame.FrameBase
 * @description Base class for filmstrip frames
 * @requires canvas.shapes.Cluster
 * @requires gen.utils.EventDispatcher
 * @augments canvas.shapes.Cluster
 * @param object options An Object with configuration properties
 */
define([
	'canvas/shapes/Cluster',
	'gen/utils/EventDispatcher'
],
function(Cluster, EventDispatcher)
{
	var FrameBase = function(options)
	{
        var self = this;

        // 'protected' props
        this.options = options || {};
        this.master = this.options.master || (function(){throw new Error('FrameBase.js: reference to master was not defined.');})();
        this.stage = this.master.stage;

        // 'public' props
        this.dto = this.options.dto || { label: 'NO FRAME LABEL SET' };
        this.w = this.options.width || this.stage.canvas.el.width;
        this.h = this.options.height || this.stage.canvas.el.height;


        //----------------------------------------------------------------------
        //
        // CONSTRUCTOR
        //
        //----------------------------------------------------------------------
        function init(options)
        {
			// inherit from 'super' class
            Cluster.call(self, options);
		}
		
		
		//----------------------------------------------------------------------
		//
		// METRICSDISPATCHER SHORTCUT
		//
		//----------------------------------------------------------------------
		this.sendExit = function(key, url)
		{
            EventDispatcher.dispatch(this.stage.container.el, 'ADCADE_FILMSTRIP_FRAME_EXIT');

	        self.master.metricsDispatcher.sendExit({
	            key : key,
	            url : url
	        });
		};

		this.sendCounter = function(key)
		{
	        self.master.metricsDispatcher.sendCounter({ key : key });
		};
       

		//----------------------------------------------------------------------
		//
		// HANDLERS
		//
		//----------------------------------------------------------------------
		// this.onCtaClicked = function()
		// {
		// 	self.cta.showOut();
		// 	self.sendExit(
		// 		'300x600_enter_' + self.dto.id,
		// 		self.dto.clickthrough
		// 	);
		// };

		// this.onCtaOver = function()
		// {
		// 	self.cta.showOver();
		// };

		// this.onCtaOut = function()
		// {
		// 	self.cta.showOut();
		// }


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		// this.stopDrag = function()
		// {
		// 	// IMPLEMENT IF NEEDED
		// };

		// this.stopFrame = function()
		// {
		// 	console.log('FrameBase.js: IMPLEMENT FOR VIDEO');
		// };
		
		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
        init(options);
	};

	return FrameBase;
});