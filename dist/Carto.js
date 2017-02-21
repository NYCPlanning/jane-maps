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
    autoComplete: function autoComplete(value) {
      var sql = 'SELECT st_centroid(the_geom) as the_geom, sagency, projectid, name FROM (SELECT * FROM adoyle.capeprojectspolygons UNION ALL SELECT * FROM adoyle.capeprojectspoints) a WHERE name ILIKE \'%' + value + '%\' OR projectid ILIKE \'%' + value + '%\'';

      return this.SQL(sql);
    },
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

            var template = 'https://' + options.carto_domain + '/user/' + options.carto_user + '/api/v1/map/' + layergroupid + '/0/{z}/{x}/{y}.mvt';

            resolve(template);
          }
        }).fail(function () {
          return reject();
        });
      });
    },
    getRow: function getRow(tableName, column, value) {
      var self = this;

      return new Promise(function (resolve, reject) {
        var sql = typeof value === 'number' ? 'SELECT * FROM ' + tableName + ' WHERE ' + column + ' = ' + value : 'SELECT * FROM ' + tableName + ' WHERE ' + column + ' = \'' + value + '\'';

        // returns a promise
        self.SQL(sql).then(function (data) {
          resolve(data.features[0]);
        }).catch(function () {
          return reject();
        });
      });
    },
    getCount: function getCount(sql) {
      var self = this;
      sql = 'SELECT count(*) FROM (' + sql + ') a';

      return new Promise(function (resolve, reject) {
        self.SQL(sql, 'json').then(function (data) {
          resolve(data[0].count);
        }).catch(function () {
          return reject();
        });
      });
    },
    SQL: function SQL(sql, format, options) {
      format = format || 'geojson';

      var apiCall = 'https://' + options.carto_domain + '/user/' + options.carto_user + '/api/v2/sql?q=' + sql + '&format=' + format;

      apiCall = encodeURI(apiCall);

      return new Promise(function (resolve, reject) {
        $.getJSON(apiCall) // eslint-disable-line no-undef
        .done(function (data) {
          if (format === 'geojson') {
            resolve(data);
          } else {
            resolve(data.rows);
          }
        }).fail(function () {
          return reject();
        });
      });
    }
  };
});