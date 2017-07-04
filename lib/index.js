/**
 * @module index
 * @overview Export library interface
 * @author lilliputten <igor@lilliputten.ru>
 */
module.exports = {

    Utils : require('./rtf-utils'),

    Fonts : require('./data/fonts'),
    Colors : require('./data/colors'),
    RGB : require('./data/rgb'),
    Language : require('./data/language'),

    Format : require('./format'),

    Element : require('./elements/element'),

    ContainerElement : require('./elements/container'),
    TextElement : require('./elements/text'),
    TableElement : require('./elements/table'),
    GroupElement : require('./elements/group'),
    // ImageElement : require('./elements/image'),

    Options : require('./options'),

};
