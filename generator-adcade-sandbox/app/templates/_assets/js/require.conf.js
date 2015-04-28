require.config({
    paths: {
        // JavaScript folders
        canvas: '[RELATIVE_PATH]product2/framework/sources/src/com/adcade/canvas',
        dom: '[RELATIVE_PATH]product2/framework/sources/src/com/adcade/dom',
        app: '[RELATIVE_PATH]product2/framework/sources/src/com/adcade/app',
        gen: '[RELATIVE_PATH]product2/framework/sources/src/com/adcade/gen',
        common: '[RELATIVE_PATH]product2/framework/sources/src/com/adcade/common',
        libs: '[RELATIVE_PATH]product2/framework/sources/libs',
        
        stats: '[RELATIVE_PATH]product2/framework/sources/libs/Stats',
        'medialets.adcade-adapter': '[RELATIVE_PATH]product2/framework/sources/libs/medialets.adcade-adapter.min',

        // Shim plugin
        use: '[RELATIVE_PATH]product2/framework/sources/plugins/use'
    },
    
    use: {
        'TimelineMax': {
            attach: 'TimelineMax',
            deps: ['TweenMax']
        }
    }
});