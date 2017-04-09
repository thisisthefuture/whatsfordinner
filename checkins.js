/**
 * Parse checkins.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function (json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var checkins = {};
    checkins.list = [];
    checkins.list[[0]] = json.response.checkins.items;

    return checkins;
};