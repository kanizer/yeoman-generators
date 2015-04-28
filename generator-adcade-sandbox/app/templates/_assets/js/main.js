require([
    'gen/core/AdController',
    'canvas/shapes/Rectangle',
    'canvas/sprites/Sprite',
    'canvas/shapes/Cluster',
    'canvas/text/TextNode'
], function(ad, Rectangle, Sprite, Cluster, TextNode) {

    var config = {
        preloads: {
            fonts: [],
            media: []
        },
        dimensions: {
            collapsed: {
                width: '300px',
                height: '250px',
            }
        },
        metrics: {
            enabled: true,
            ajaxUrl: 'http://ad-stage.adcade.com',
            version: '2',
        },
        resources: {
            path: 'assets/'
        }
    };

    ad.configure(config);
    var stage = ad.stage;

    ad.begin(function() {

        var background = new Rectangle({
            stage: stage,
            width: '100%',
            height: '100%',
            fillStyle: '#282828',
            onClick: function() {
                ad.metricsDispatcher.sendExit({
                    key: 'clickthrough',
                    url: 'http://www.adcade.com'
                });
            }
        });

        var logo = new Sprite({
            stage: stage,
            path: 'img/backup.jpg',
            registration: 'center',
            x: '50%',
            y: '50%'
        });

    });
});