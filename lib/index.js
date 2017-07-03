/**
 * @module index
 * @overview Export library interface
 * @author lilliputten <igor@lilliputten.ru>
 */
module.exports = {

    Utils : require('./rtf-utils'),

    RGB : require('./rgb'),
    Format : require('./format'),
    Language : require('./language'),
    // Orientation : require('./orientation'),

    Element : require('./elements/element'),

    TableElement : require('./elements/table'),
    TextElement : require('./elements/text'),
    // ImageElement : require('./elements/image'),
    GroupElement : require('./elements/group'),

    Options : require('./options'),

};
