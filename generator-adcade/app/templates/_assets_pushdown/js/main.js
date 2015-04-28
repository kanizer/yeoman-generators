require([
    'gen/core/SuperMaster',
    'gen/utils/BrowserDetector',
    'canvas/shapes/Rectangle',
    'canvas/shapes/Cluster',
    'canvas/sprites/Sprite',
    'dom/utils/Detector',
    'dom/mixins/Environment',
    'assets/js/anim/ExtendedTween',
    'assets/js/view/ExpandedView'
    ],
    function(
        SuperMaster,
        BrowserDetector,
        Rectangle,
        Cluster,
        Sprite,
        Detector,
        EnvironmentMixin,
        ExtendedTween,
        ExpandedView
    ){

        // Do not do stuff like var config = {}; config.metrics = true;
        var config = {

            // Configure preload items
            preloads: {
                fonts: [],
                media: []
            },

            // Please follow this sort of formatting in the config variable 
            // to be nice to the analysis in our deploy script. 
            // Line breaks when you make a new object, etc.
            dimensions: {
                collapsed: {
                    width: '970px',
                    height: '90px',
                },
                expanded: {
                    width: '970px',
                    height: '415px',
                },
                pushDown: true
            },

            // force resource path to ad server
            resources: {
                // path: 'http://resource.adcade.com/ad-assets/[AD_ID]/assets/',
                // auto-populate adId from tag
                // path: 'http://resource.adcade.com/ad-assets/',
                // appendAdId: true
            },

            clickOnly: true,

            debug: {
                recorder: false,       // Interaction recorder.
                fps: false,            // FPS meter.
                debugConsole: false,   // HTML debug console for devices without a debugger.
                boundingBoxes: false,  // Canvas shape bounding boxes for shapes with debug: true.
                network: false         // Network debugger
            },
            
            metrics: {
                enabled: true,
            }
        };

        // Pass the config variable to SuperMaster
        var master = new SuperMaster(config);
        var stage = master.stage;
        var queryVars = master.tag.custom;

        // You can also put preloads in here but you don't have to
        // master.begin({ media: ['img/beach2.jpg'] }, function(){
        master.begin(function(){

            //----------------------------------------------------------------------
            //
            // PROPERTIES
            //
            //----------------------------------------------------------------------
            // CONFIGURE CLICKTHROUGH URLS
            var URL_MAIN = queryVars.clickTag || 'http://www.adcade.com',

            // STATE VARS
            _isMobile = BrowserDetector.isMobile(),
            _w = stage.canvas.canvas.el.width,
            _h = stage.canvas.canvas.el.height,

            // DISPLAY OBJECTS
            _bg,
            _stroke,
            _hit,
            _wrapper,
            _expanded,

            _animationItems,
            _clickCollection = {};


            //----------------------------------------------------------------------
            //
            // INIT
            //
            //----------------------------------------------------------------------
            function init()
            {
                addEventListeners();
                addDisplayObjects();
                kickoffAnimation();
            }

            function addEventListeners()
            {
                stage.container.el.addEventListener('ADCADE_EVENT', onAdcadeEvent, false);
            }

            function addDisplayObjects()
            {
                _bg = new Rectangle({
                    stage: stage,
                    width: _w,
                    height: 90,
                    // alpha: 0,
                    // display: false,
                    fillStyle: 'green'
                });

                _stroke = new Rectangle({
                    stage: stage,
                    width: _w,
                    height: 90,
                    strokeStyle: '#444',
                    lineWidth: 1,
                    smoothing: 1, // 'never'
                });

                _hit = new Rectangle({
                    stage: stage,
                    width: _w,
                    height: _h,
                    fillStyle: 'yellow',
                    alpha: 0,
                    // display: false,
                    onClick: onHitClick
                });

                _wrapper = new Cluster({
                    stage: stage,
                    shapes: [
                        _bg,
                        _stroke,
                        _hit
                    ]
                });


                //###########################
                // expanded view
                //###########################
                _expanded = new ExpandedView({
                    master: master,
                    width: _w,
                    height: _h,
                    alpha: 0,
                    display: false,
                    clickthrough: URL_MAIN,
                    isMobile: _isMobile
                });
            }

            function debounceClick(btn)
            {
                // check that not already debounced
                if(btn.display)
                {
                    btn.set({display: false});
                    _clickCollection[btn] = btn;
                    _clickCollection[btn].to = setTimeout(function(){
                        btn.set({ display: true });
                    }, 500);
                }
            }

            function expand()
            {
                killAnimation();
                master.expand();

                var dur = 100;

                _expanded.fade(dur, 1, true);

                // hide collapsed to expose video knockout
                setTimeout(function(){
                    _wrapper.set({ display: false });
                    if(!_isMobile) _expanded.autoplayVideo();
                }, dur);
            }

            function collapse(isAuto)
            {
                var autoCollapse = (isAuto) ? {modifier: 'auto'} : {};
                master.collapse(autoCollapse);

                _expanded.fade(300, 0, true);
                _wrapper.set({ display: true });
            }


            //----------------------------------------------------------------------
            //
            // ANIMATION ROUTINES
            //
            //----------------------------------------------------------------------
            function addAnimationItem(mc, props) {
                // create list of animated items, and target properties for interrupt
                if (!_animationItems) _animationItems = [];

                var allProps = (props !== undefined) ? props : ExtendedTween.getAllProps(mc);
                _animationItems.push({
                    item: mc,
                    props: allProps
                });
            }

            function kickoffAnimation()
            {
                _animationItems = [];
                
                var del = 0;

                addAnimationItem(_bg, {alpha: 1});
                ExtendedTween.animateFrom(_bg, 500, del,
                    {
                        alpha: 0,
                        easing: 'easeOutQuad'
                    }
                );
            }

            function killAnimation()
            {
                var item,
                props;
                for(var i=0; i < _animationItems.length; i++)
                {
                    item = _animationItems[i].item;
                    props = _animationItems[i].props;

                    if(item.killAllTweens) item.killAllTweens();
                    item.set(props);
                }
            }


            //----------------------------------------------------------------------
            //
            // HANDLERS
            //
            //----------------------------------------------------------------------
            function onAdcadeEvent(e)
            {
                var eventLabel = e.name;

                if(eventLabel === 'CLOSE_PUSHDOWN_CLICKED')
                {
                    // cleanup any transitional stuff for exit
                    // master.forceRefreshOnAndroidBrowser();

                    if(e.data)
                    {
                        // console.log('main.js: onAdcadeEvent: e.data:', e.data.auto);
                        collapse(e.data.auto);
                    }
                }
            }

            function onHitClick()
            {
                expand();
                debounceClick(_hit);
            }

            //----------------------------------------------------------------------
            //
            // KICKOFF AD CONSTRUCTION
            //
            //----------------------------------------------------------------------
            init();

        });
        //###########################
        // end master.begin closure
        //###########################
    }
    //###########################
    // end main closure
    //###########################
);