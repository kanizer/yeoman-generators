
FEATURES = {
    'dragging': 'check',

    # By default, we still use hovering even if it's explicitly not mentioned in main.js, because of
    # clickables that have a hand cursor on hover.
    'chovering': 'enable',

    'clipping': 'enable',

    # Android clipping is a subset of clipping
    'androidclipping': 'check',

    'binding': 'check',
    'snapping': 'check',
    'bounds': 'check',

    'filterblur': 'check',
    'filterbrightness': 'check',
    'filtercontrast': 'check',
    'filtergrayscale': 'check',
    'filternoise': 'check',
    'filterpixelate': 'check',
    'filterthreshold': 'check',
    'filtersepia': 'check',

    'refreshtimer': 'check',
    'positiontimer': 'enable', # Position timer on by default
    'rerendertimer': 'check',
    'screensizetimer': 'check',
    'timers': 'enable', # Timer entry point. On by default because positiontimer
}

# Relative to the mainfile folder
#FRAMEWORK_PATH = '../../../../../../../../framework/sources/src/com/adcade/'
#FRAMEWORK_PATH = ''