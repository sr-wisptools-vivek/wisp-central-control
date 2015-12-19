var Future = Npm.require('fibers/future');

var runQuery = function (sql, future) {
  // Get connection from pool
  WtManagedRouterMySQL.pool.getConnection(function(err, connection) {
    if (err) { throw new Meteor.Error(err); }
    // Run query
    connection.query(sql, [], function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { throw new Meteor.Error(err); }
      // return results
      future.return(results);
    });
  });  
}

Meteor.methods({
  wtManagedRouterMySQLGetLimit: function(limit) {
    if (Meteor.userId() == null) return null;
    var sqlLimit = limit || 10;

    var fut = new Future();
    var db_name = Meteor.settings.managedRouterMySQL.dbName;
    var sql = 
      "SELECT * FROM " +
      "  " + db_name + ".Subscriber, " +
      "  " + db_name + ".Equipment, " +
      "  " + db_name + ".ManagedRouter " + 
      "WHERE " + 
      " Subscriber.SubscriberID=Equipment.SubscriberID AND " +
      " Equipment.Deleted='N' AND " +
      " Equipment.Make=ManagedRouter.CSGMake AND " +
      " Equipment.Model=ManagedRouter.CSGModel " +
      "ORDER BY Equipment.EquipmentID DESC " +
      "LIMIT " + sqlLimit;

    runQuery(sql, fut);

    var res = fut.wait();
    res = _.map(res, function(r) {
      // add on the URL
      r.url = WtManagedRouterMySQL.makeUrl(r.EquipmentID);
      return r;
    });
    return res;
  },
  wtManagedRouterMySQLAdd: function(router) {
    var res;
    var sql;
    // Check for duplicate Serial
    res = Meteor.call('wtManagedRouterMySQLSearch', router.serial);
    if (res.length > 0) throw new Meteor.Error('dup','Duplicate Serial Number', router.serial);

    // Check for duplicate mac
    res = Meteor.call('wtManagedRouterMySQLSearch', router.mac);
    if (res.length > 0) throw new Meteor.Error('dup','Duplicate MAC Address', router.mac);

    var escapedName = WtManagedRouterMySQL.escape(router.name);
    var escapedSerial = WtManagedRouterMySQL.escape(router.serial);
    var escapedMAC = WtManagedRouterMySQL.escape(router.mac);
    var escapedMake = WtManagedRouterMySQL.escape(router.make);
    var escapedModel = WtManagedRouterMySQL.escape(router.model);

    var fut = new Future();
    var db_name = Meteor.settings.managedRouterMySQL.dbName;

    // Add the Name
    sql = 
      "INSERT INTO " +
      " " + db_name + ".Subscriber " +
      "VALUES ( " +
      " NULL, 1, 0, 0, " +
      " " + escapedName + ", " +
      " '', '', '', '', '', 'N', 'N' " +
      ")";

    runQuery(sql, fut);

    var res = fut.wait();
    var subId = res.insertId;

    var fut = new Future();
    // Add the router
    sql = 
      "INSERT INTO " +
      " " + db_name + ".Equipment " +
      "VALUES ( " +
      " NULL, " +
      " " + subId + ", " +
      " " + escapedSerial + ", " +
      " " + escapedMAC + ", " +
      " " + escapedMake + ", " +
      " " + escapedModel + ", " +
      " '', '', 'N', 'N' " +
      ")";

    runQuery(sql, fut);
    res = fut.wait();

    return Meteor.call('wtManagedRouterMySQLSearch', router.serial);
  },
  wtManagedRouterMySQLSearch: function(search) {
    if (Meteor.userId() == null) return null;

    var escapedSearch = WtManagedRouterMySQL.escape("%" + search + "%");

    var fut = new Future();
    var db_name = Meteor.settings.managedRouterMySQL.dbName;
    var sql = 
      "SELECT * FROM " +
      "  " + db_name + ".Subscriber, " +
      "  " + db_name + ".Equipment, " +
      "  " + db_name + ".ManagedRouter " + 
      "WHERE " + 
      " Subscriber.SubscriberID=Equipment.SubscriberID AND " +
      " Equipment.Deleted='N' AND " +
      " Equipment.Make=ManagedRouter.CSGMake AND " +
      " Equipment.Model=ManagedRouter.CSGModel AND" +
      " ( " +
      "   Subscriber.SubscriberName LIKE " + escapedSearch + " OR " +
      "   Equipment.SerialNumber LIKE " + escapedSearch + " OR " +
      "   Equipment.MACAddress LIKE " + escapedSearch + " " +
      " ) ";

    runQuery(sql, fut);

    var res = fut.wait();
    res = _.map(res, function(r) {
      // add on the URL
      r.url = WtManagedRouterMySQL.makeUrl(r.EquipmentID);
      return r;
    });
    return res;
  }  
});



