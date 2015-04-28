require([
    'gen/core/AdController',
    'gen/utils/BrowserDetector',
    'canvas/shapes/Rectangle',
    'canvas/shapes/Cluster',
    'canvas/sprites/Sprite',
    'dom/utils/Detector',
    'modules/anim/ExtendedTween'
    ],
    function(
        ad,
        BrowserDetector,
        Rectangle,
        Cluster,
        Sprite,
        Detector,
        ExtendedTween
    ){

        // Do not do stuff like var config = {}; config.metrics = true;
        var config = {

            // Configure preload items
            preloads: {
                fonts: [
                    {
                        name: 'Raleway',
                        css: 'http://fonts.googleapis.com/css?family=Raleway'
                        // css: 'http://font.adcade.com/panera/'
                    }
                ],
                media: ['img/backup.jpg']
            },

            // Please follow this sort of formatting in the config variable 
            // to be nice to the analysis in our deploy script. 
            // Line breaks when you make a new object, etc.
            dimensions: {
                expanded: {
                    width: '300px',
                    height: '250px',
                },
                collapsed: {
                    width: '300px',
                    height: '250px',
                }
            },

            bgColor: '#fff',

            hd: false,

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
                enabled: false
            },

            noMargin: true, // restores old behavior, no margin set on container parent 
            canvasPositioning: 'absolute' // again, old behavior 

        };

        // Pass the config variable to SuperMaster
        ad.configure(config);
        var queryVars = ad.tag.custom;
        var stage = ad.stage;

        // You can also put preloads in here but you don't have to
        // ad.begin({ media: ['img/beach2.jpg'] }, function(){
        ad.begin(function(){

            //----------------------------------------------------------------------
            //
            // PROPERTIES
            //
            //----------------------------------------------------------------------
            // CONFIGURE CLICKTHROUGH URLS
            var URL_MAIN = queryVars.clickTag || 'http://www.adcade.com',
                ENV = location.origin.search('192.168.') > -1
                    || location.origin.search('adcade.dev') > -1
                    || location.origin.search('adcade.com') > -1
                        ? 'local' : 'prod',
                RESOURCE_PATH = ENV === 'local'
                        // piece together local resource path
                        ? location.href + stage.resourcePath
                        // or absolute S3 path
                        : stage.resourcePath, //'http://resource.adcade.com/ad-assets/ADTDEC13AIHIP300250/assets/';

            // STATE VARS
            _isMobile = BrowserDetector.isMobile(),
            _isExpanded = false,
            _w = getCanvasDimensions().w,
            _h = getCanvasDimensions().h,

            // DISPLAY OBJECTS
            _bg,
            _hit,
            _wrapper,

            _animationItems,
            _clickCollection = {};

            //----------------------------------------------------------------------
            //
            // INIT
            //
            //----------------------------------------------------------------------
            function init()
            {
                addDisplayObjects();
                kickoffAnimation();
            }

            function debounceClick(btn)
            {
                // check that not already debounced
                if(btn.display)
                {
                    btn.set({display: false});
                    _clickCollection[btn] = setTimeout(function(){
                        btn.set({ display: true });
                    }, 500);
                }
            }

            function addDisplayObjects()
            {
                _bg = new Sprite({
                    stage: stage,
                    path: 'img/backup.jpg'
                });

                _hit = new Rectangle({
                    stage: stage,
                    width: '100%',
                    height: '100%',
                    alpha: 0.3,
                    display: true,
                    fillStyle: 'red',
                    onClick: onHitClicked
                });

                _wrapper = new Cluster({
                    stage: stage,
                    shapes: [_bg, _hit]
                });
            }

            function expand()
            {
                killAnimation();
                ad.expand();
            }

            function collapse(isAuto)
            {
                var autoCollapse = (isAuto) ? {modifier: 'auto'} : {};
                ad.collapse(autoCollapse);
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

                del += 500;
                addAnimationItem(_hit, {alpha: 1});
                ExtendedTween.animateFrom(_hit, 500, del,
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

            function getCanvasDimensions()
            {
                var style = stage.container.el.style,
                w = parseInt(style.width.split('px')[0], 10),
                h = parseInt(style.height.split('px')[0], 10);

                return {w: w, h: h};
            }


            //----------------------------------------------------------------------
            //
            // HANDLERS
            //
            //----------------------------------------------------------------------
            ad.onTriggerOut = function(e)
            {
                // ON STAGE LEAVE EVENT - e is MouseEvent
            };

            ad.onResize = function(w, h)
            {
                // called on any browser resize
                // returns w & h of canvas
                var isPortrait = w < h;

                // get object with w & h of viewport (i think!)
                // var screenInfo = EnvironmentMixin.getScreenInfo();
            };

            function onHitClicked()
            {
                ad.metricsDispatcher.sendExit({
                    key: 'Clickthrough',
                    url: URL_MAIN
                });

                expand();
                debounceClick(this);
            }


            //----------------------------------------------------------------------
            //
            // KICKOFF AD CONSTRUCTION
            //
            //----------------------------------------------------------------------
            init();

        });
        //###########################
        // end ad.begin closure
        //###########################
    }
    //###########################
    // end main closure
    //###########################
);