require([
    'gen/core/SuperMaster',
    'gen/utils/BrowserDetector',
    'canvas/shapes/Rectangle',
    'canvas/shapes/Cluster',
    'canvas/sprites/Sprite',
    'dom/utils/Detector',
    'dom/mixins/Environment',
    'assets/js/anim/ExtendedTween',
    'assets/js/ui/HeaderFooter',
    'assets/js/frame/FrameController',
    'assets/js/frame/FrameModel',
    'assets/js/frame/FrameSample'
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
        HeaderFooter,
        FrameController,
        FrameModel,
        FrameSample
    ){

        // Do not do stuff like var config = {}; config.metrics = true;
        var config = {

            // Configure preload items
            preloads: {
                fonts: [
                    {
                        name: 'Raleway',
                        css: 'http://fonts.googleapis.com/css?family=Raleway'
                        // css: 'http://resource.adcade.com/ad-assets/fonts/panera/stylesheet.css'
                    }
                ],
                media: [
                    'img/arrow.png'
                ]
            },

            // Please follow this sort of formatting in the config variable 
            // to be nice to the analysis in our deploy script. 
            // Line breaks when you make a new object, etc.
            dimensions: {
                collapsed: {
                    width: '300px',
                    height: '600px'
                }
            },

            metrics: {
                enabled: false
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

            // DISPLAY OBJECTS
            _bg,
            _stroke,
            _frameWin,
            _frameSlider,

            // STATE VARS
            _isMobile = BrowserDetector.isMobile(),

            // PROPS
            _w = stage.canvas.canvas.el.width,
            _h = stage.canvas.canvas.el.height,
            _frameModel,
            _frameController,
            _frameData = [
                {
                    id: 'entertowin',
                    //clickthrough: _clickthrough_rt,
                    label: 'ENTER TO WIN'
                },
                {
                    id: 'seediy',
                    //clickthrough: _clickthrough_rt,
                    label: 'SEE THE DIY TRANSFORMATION'
                }
            ];


            //----------------------------------------------------------------------
            //
            // INIT
            //
            //----------------------------------------------------------------------
            function init()
            {
                addEventListeners();
                addModel();
                addDisplayObjects();
                addFrames();
                addController();
                initFrames();

                // make sure stroke is on top level
                _stroke.bump();

                if(document.fps && document.fps === 'true') showFpsMeter();
            }

            function addEventListeners()
            {
                stage.container.el.addEventListener('ADCADE_EVENT', onAdcadeEvent, false);
            }

            function addModel()
            {
                _frameModel = new FrameModel({
                    master: master,
                    data: _frameData
                });
            }

            function addDisplayObjects()
            {
                _bg = new Rectangle({
                    stage: stage,
                    width: '100%',
                    height: '100%',
                    // alpha: 0.3,
                    // display: false,
                    fillStyle: 'white'
                });

                _stroke = new Rectangle({
                    stage: stage,
                    width: _w - 1,
                    height: _h - 1,
                    strokeStyle: '#444',
                    lineWidth: 1
                });
            }

            function addFrames()
            {
                _frameWin = new FrameSample({
                    stage: stage,
                    master: master,
                    isMobile: _isMobile,
                    // y: 600,
                    dto: {label: 'entertowin'}
                });
                _frameModel.addFrame('entertowin', _frameWin);

                _frameSlider = new FrameSample({
                    stage: stage,
                    master: master,
                    isMobile: _isMobile,
                    // y: 600,
                    dto:  {label: 'seediy'}
                });
                _frameModel.addFrame('seediy', _frameSlider);
            }

            function addController()
            {
                // holds nav view items and 
                // controls input and transitions between frames
                _frameController = new FrameController({
                    master: master,
                    model: _frameModel,
                    width: _w,
                    height: _h
                });
            }

            function initFrames()
            {
                var dto, frame;
                for(var i=0; i < _frameModel.getLength(); i++)
                {
                    dto = _frameModel.getDtoByIndex(i);
                    frame = _frameModel.getFrameById(dto.id);
                    frame.set({
                        y: i === _frameModel.getIndex() ? 0 : _h
                    });
                }

                // _frameSlider.swap(_frameWin);
            }

            // move fps meter to highest z-index
            function showFpsMeter()
            {
                // FPS Meter
                var meter = new FPSMeter({zIndex: Detector.topZIndex() + 10});
                var fps = 30;
                var interval = 1000 / fps;
                var fpsInterval = setInterval(meter.tick, interval);
            }


            //----------------------------------------------------------------------
            //
            // HANDLERS
            //
            //----------------------------------------------------------------------
            master.onTriggerOut = function(e)
            {
                // ON STAGE LEAVE EVENT - e is MouseEvent
                _frameController.setTriggerOut(e);
            };

            master.onResize = function(w, h)
            {
                // called on any browser resize
                // returns w & h of canvas
                _w = w;
                _h = h;

                // TODO - UPDATE ALL CHILDREN
            };

            function onAdcadeEvent(e)
            {
                var eventLabel = e.name;

                if(eventLabel === 'ADCADE_FILMSTRIP_FRAME_EXIT')
                {
                    // cleanup any transitional stuff for exit
                    // master.forceRefreshOnAndroidBrowser();

                    if(e.data.key)
                    {
                        console.log('main.js: onAdcadeEvent: e.data:', e.data);
                    }
                }
            }

            function onCollapsedClicked()
            {
                master.metricsDispatcher.sendExit({
                    key: 'Clickthrough',
                    url: URL_MAIN
                });
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