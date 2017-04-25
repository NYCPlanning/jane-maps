// carto.js - helper methods for interacting with the carto APIs

module.exports = {
  getVectorTileTemplate(mapConfig, options) {
    return new Promise((resolve, reject) => {
      $.ajax({ // eslint-disable-line no-undef
        type: 'POST',
        url: `https://${options.carto_domain}/user/${options.carto_user}/api/v1/map`,
        data: JSON.stringify(mapConfig),
        dataType: 'text',
        contentType: 'application/json',
        success(data) {
          data = JSON.parse(data);
          const layergroupid = data.layergroupid;

          const template = `https://${options.carto_domain}/user/${options.carto_user}/api/v1/map/${layergroupid}/{z}/{x}/{y}.mvt`;

          resolve(template);
        },
      })
      .fail(() => reject());
    });
  },
};
