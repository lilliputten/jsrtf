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

    TableElement : require('./elements/table'),
    TextElement : require('./elements/text'),
    // ImageElement : require('./elements/image'),
    GroupElement : require('./elements/group'),

    Options : require('./options'),

};
