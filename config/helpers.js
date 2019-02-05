// https://raw.githubusercontent.com/Hotell/typescript-lib-starter/master/config/helpers.js
// https://github.com/Hotell/typescript-lib-starter/blob/master/LICENSE.md

module.exports = {
    camelCaseToDash,
    dashToCamelCase,
    toUpperCase,
    getOutputFileName,
}

/**
 *
 * @param {string} myStr
 */
function camelCaseToDash(myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 *
 * @param {string} myStr
 */
function dashToCamelCase(myStr) {
    return myStr.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

/**
 *
 * @param {string} myStr
 */
function toUpperCase(myStr) {
    return `${myStr.charAt(0).toUpperCase()}${myStr.substr(1)}`
}


/**
 *
 * @param {string} fileName
 * @param {boolean?} isProd
 */
function getOutputFileName(fileName, isProd = false) {
    return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}