define([
	'canvas/shapes/Cluster',
	'canvas/shapes/Rectangle',
	'canvas/text/TextNode',
	'canvas/sprites/Sprite'
],
function(Cluster, Rectangle, TextNode, Sprite)
{
	var HeaderFooter = function(options)
	{
        options = options || {};

        var self = this;
        self.stage = options.stage;

        var _bg,
        _arrow,
        _label,

        _labelText = options.label || 'NO HEADER/FOOTER LABEL SET',
        _isHeader = options.isHeader || false,
		_overY,
		_offY;


        //----------------------------------------------------------------------
        //
        // CONSTRUCTOR
        //
        //----------------------------------------------------------------------
        function init(options)
        {
			// inherit from 'super' class
            Cluster.call(self, options);
            addDisplayItems();
		}


		//----------------------------------------------------------------------
		//
		// PRIVATE METHODS
		//
		//----------------------------------------------------------------------
		function addDisplayItems()
		{
			_bg = new Rectangle({
				stage: self.stage,
				width: self.width,
				height: self.height,
				fillStyle: '#ff0000'
			});
			self.add(_bg);

			_label = new TextNode({
				stage: self.stage,
				y: Math.round(self.height/2),
				maxWidth: self.width,
				text: _labelText,
				textAlign: 'center',
				lineHeight: 5,
				fontSize: 10,
				fontStyle: 'normal',
				fontFamily: 'Raleway',
				fillStyle: 'white'
			});
			self.add(_label);

			_arrow = new Sprite({
				stage: self.stage,
				x: _isHeader ? 13 : 288,
				registrations: 'center',
				rotation: _isHeader ? 0 : 180,
				path: 'img/arrow.png'
			});
			self.add(_arrow);

			_offY = _isHeader ?
				Math.round( (self.height - _arrow.height)/2 ) :
				Math.round( (self.height + _arrow.height)/2 );
			_overY = _isHeader ? _offY - 5 : _offY + 5;

			_arrow.set({ y: _offY });
		}


		//----------------------------------------------------------------------
		//
		// PUBLIC METHODS
		//
		//----------------------------------------------------------------------
		this.showOver = function()
		{
			if(_arrow.killAllTweens) _arrow.killAllTweens();
			_arrow.tween({
				tweens:[
					{
						duration: 200,
						easing: 'easeOutQuad',
						y: _overY
					},
					{
						duration: 200,
						easing: 'easeOutQuad',
						y: _offY
					}
				]
			});
		};

		this.showOut = function()
		{
			if(_arrow.killAllTweens) _arrow.killAllTweens();
			_arrow.tween({
				duration: 200,
				easing: 'easeOutQuad',
				y: _offY
			});
		};

		this.updateLabel = function(pol, newLabel)
		{
			_label.tween({
				duration: 200,
				alpha: 0,
				y: pol > 0 ? 12 : 22,
				easing: 'easeOutQuad',
				onComplete: function()
				{
					if(newLabel !== undefined) _labelText = newLabel;
					_label.set({
						y: pol < 0 ? 12 : 22,
						text: _labelText
					});
					_label.tween({
						duration: 200,
						y: Math.round(self.height/2),
						alpha: 1,
						easing: 'easeOutQuad'
					});
				}
			});
		};


		//----------------------------------------------------------------------
		//
		// INIT
		//
		//----------------------------------------------------------------------
        init(options);
	};

	return HeaderFooter;
});