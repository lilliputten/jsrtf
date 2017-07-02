/* globals modules */
/**
 *
 * @module resolve-modules
 * @overview Load required modules from YModules (if exixist in global scope) or from CommonJS
 * @author lilliputten <igor@lilliputten.ru>
 *
 * Original maintainer Jonathan Rowny (https://github.com/jrowny/node-rtf)
 *
 */

module.exports = function (deps, resolveFn, errFn) {

    // If defined global YModules...
    if ( typeof modules === 'object' ) {
        return modules.require(deps, resolveFn, errFn);
    }

    // Else use CommonJS...
    try {
        var resolvedModules = deps.map((name) => require(name));
        ( typeof resolveFn === 'function' ) && resolveFn.apply(this, resolvedModules);
    }
    catch (err) {
        // /*DEBUG*//*jshint -W087*/debugger;
        if ( typeof errFn === 'function' ) {
            errFn(err);
        }
        else {
            console.error('resolve-modules error:', err);
            throw new Error(err);
        }
    }

};
