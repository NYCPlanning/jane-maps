(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.Carto = mod.exports;
  }
})(this, function (module) {
  'use strict';

  // carto.js - helper methods for interacting with the carto APIs

  module.exports = {
    getVectorTileTemplate: function getVectorTileTemplate(mapConfig, options) {
      return new Promise(function (resolve, reject) {
        $.ajax({ // eslint-disable-line no-undef
          type: 'POST',
          url: 'https://' + options.carto_domain + '/user/' + options.carto_user + '/api/v1/map',
          data: JSON.stringify(mapConfig),
          dataType: 'text',
          contentType: 'application/json',
          success: function success(data) {
            data = JSON.parse(data);
            var layergroupid = data.layergroupid;

            var template = 'https://' + options.carto_domain + '/user/' + options.carto_user + '/api/v1/map/' + layergroupid + '/{z}/{x}/{y}.mvt';

            resolve(template);
          }
        }).fail(function () {
          return reject();
        });
      });
    }
  };
});