define(function()
{
    var ExtendedTween = {};

    //----------------------------------------------------------------------
    //
    // STATIC METHODS
    // - example: animateFrom(mc, 500, 500, {x: -300, easing: 'easeOutQuint'});
    //
    //----------------------------------------------------------------------
    ExtendedTween.animate = 
    ExtendedTween.animateFromTo = function(mc, dur, del, start, end, callback)
    {
        end.duration = dur;
        end.delay = del;

        if(end.easing === undefined) end.easing = start.easing;
        if(callback) end.onComplete = callback;

        mc.set(start);
        mc.tween(end);

        // console.log("ExtendedTween.js: start: ", start);
        // console.log("ExtendedTween.js: end: ", end);
    };

    ExtendedTween.animateFrom = function(mc, dur, del, start, callback)
    {
        var end = ExtendedTween.findProps(mc, start);
        ExtendedTween.animate(mc, dur, del, start, end, callback);
    };

    ExtendedTween.animateAllFromTo = function(mcs, dur, del, start, callback)
    {
        var mc, end;
        for(var i=0; i < mcs.length; i++)
        {
            mc = mcs[i];
            end = ExtendedTween.findProps(mc, end);
            ExtendedTween.animateFromTo(mc, dur, del, start, end, callback);
        }
    };

    ExtendedTween.animateAllFrom = function(mcs, dur, del, start, callback)
    {
        var mc, end;
        for(var i=0; i < mcs.length; i++)
        {
            mc = mcs[i];
            end = ExtendedTween.findProps(mc, start);
            ExtendedTween.animateFrom(mc, dur, del, start, callback);
        }
    };



    /**
    * Interate through an object and return those properties for the supplied Shape instance
    * @param {Shape} mc Shape instance
    * @param {Object} props Object of properties
    * @return {Object} Object of properties for supplied Shape instance
    */
    ExtendedTween.findProps = function(mc, props)
    {
        var o = {};
        for(var sourceKey in props)
        {
            for(var key in mc)
            {
                if(key === sourceKey)
                {
                    // console.log("main.js: sourceKey: ", sourceKey);
                    // console.log("main.js: key: ", key);
                    o[key] = mc[key];
                }
            }
        }

        return o;
    };

    ExtendedTween.getAllProps = function(mc)
    {
        var validProps = [
            'x',
            'y',
            'width',
            'height',
            'alpha',
            'scaleX',
            'scaleY',
            'fillStyle',
            'strokeStyle'
        ];

        return ExtendedTween.findProps(mc, validProps);
    };

    ExtendedTween.setDynamicObj = function(prop, val)
    {
        var o = {};
        o[prop] = val;
        return o;
    };

    return ExtendedTween;
});