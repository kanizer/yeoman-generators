define([
    'canvas/shapes/Cluster',
    'canvas/shapes/Rectangle',
    'canvas/text/TextNode',
    'assets/js/frame/FrameBase'
],
function(
    Cluster,
    Rectangle,
    TextNode,
    FrameBase
){
    var FrameSample = function(options)
    {
        options = options || {};

        var self = this,

        // display
        _bg,
        _label;


        //----------------------------------------------------------------------
        //
        // CONSTRUCTOR
        //
        //----------------------------------------------------------------------
        function init(options)
        {
            // inherit from 'super' class
            FrameBase.call(self, options);
            addDisplayItems();

            // console.log('FrameSample.js: init: this.className:', this.className);
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
                width: self.w,
                height: self.h,
                fillStyle: 'tan'
            });
            self.add(_bg);
             
           _label = new TextNode({
                stage: self.stage,
                y: '50%',
                text: self.dto.label,
                maxWidth: self.w,
                textAlign: 'center',
                lineHeight: 10,
                fontSize: 18,
                fontStyle: 'normal',
                fontFamily: 'Raleway',
                fillStyle: 'white'
            });
            self.add(_label);
        }


        //----------------------------------------------------------------------
        //
        // INIT
        //
        //----------------------------------------------------------------------
        init(options);
    };

    return FrameSample;
});