WtManagedRouterMySQL = {};

var mysql = Npm.require('mysql');
WtManagedRouterMySQL.pool  = mysql.createPool({
  host      : Meteor.settings.managedRouterMySQL.dbHost,
  user      : Meteor.settings.managedRouterMySQL.dbUser,
  password  : Meteor.settings.managedRouterMySQL.dbPass,
  insecureAuth: true
});

// MySQL DB query wrapper
// http://stackoverflow.com/a/26868647
WtManagedRouterMySQL.query = function () {
  var queryArgs = Array.prototype.slice.call(arguments),
      events = [],
      eventNameIndex = {};

  this.pool.getConnection(function (err, conn) {
      if (err) {
          if (eventNameIndex.error) {
              eventNameIndex.error();
          }
      }
      if (conn) { 
          var q = conn.query.apply(conn, queryArgs);
          q.on('end', function () {
              conn.release();
          });

          events.forEach(function (args) {
              q.on.apply(q, args);
          });
      }
  });

  return {
      on: function (eventName, callback) {
          events.push(Array.prototype.slice.call(arguments));
          eventNameIndex[eventName] = callback;
          return this;
      }
  };   
}

WtManagedRouterMySQL.escape = function (str) {
  return this.pool.escape(str);
}

WtManagedRouterMySQL.makeUrl = function (id, phpFile) {
  var file = phpFile || "";
  return Meteor.settings.managedRouterMySQL.baseUrl + file + "?ID=" + id + "&TOKEN=" + CryptoJS.MD5(id.toString() + Meteor.settings.managedRouterMySQL.urlSecret.toString()).toString();
}
