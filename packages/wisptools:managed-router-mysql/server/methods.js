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

var getDomain = function() {
  var domain = WtMangedRouterMySQLDomains.findOne({userId: this.userId});
  if (!domain) return null;
  if (domain.name == "") return null;
  return WtManagedRouterMySQL.escape(domain.name);
}

var search = function(search) {
  if (this.userId == null) return [];

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) return [];
  var escapedSearch = WtManagedRouterMySQL.escape("%" + search + "%");

  var fut = new Future();
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var sql = 
    "SELECT " +
    "  EquipmentID as id, " +
    "  SystemID as domain, " +
    "  SubscriberName as name, " +
    "  SerialNumber as serial, " +
    "  MACAddress as mac, " +
    "  Make as make, " +
    "  Model as model " +
    "FROM " +
    "  " + db_name + ".Subscriber, " +
    "  " + db_name + ".Equipment, " +
    "  " + db_name + ".ManagedRouter " + 
    "WHERE " + 
    " Subscriber.SystemID=" + escapedDomain + " AND " +
    " Subscriber.SubscriberID=Equipment.SubscriberID AND " +
    " Equipment.Deleted='N' AND " +
    " Equipment.Make=ManagedRouter.CSGMake AND " +
    " Equipment.Model=ManagedRouter.CSGModel AND " +
    " ( " +
    "   Subscriber.SubscriberName LIKE " + escapedSearch + " OR " +
    "   Equipment.SerialNumber LIKE " + escapedSearch + " OR " +
    "   Equipment.MACAddress LIKE " + escapedSearch + " " +
    " ) ";

  runQuery(sql, fut);

  var res = fut.wait();
  res = _.map(res, function(r) {
    // add on the URL
    r.url = WtManagedRouterMySQL.makeUrl(r.id);
    return r;
  });
  return res;  
}

Meteor.method("wtManagedRouterMySQLGetLimit", function(limit) {
  if (this.userId == null) return [];

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) return [];
  var sqlLimit = limit || 10;
  if (sqlLimit.toString() === "[object Object]") sqlLimit = 10; // handleing default empty object on rest api
  sqlLimit = WtManagedRouterMySQL.escape(sqlLimit);

  var fut = new Future();
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var sql = 
    "SELECT " + 
    "  EquipmentID as id, " +
    "  SystemID as domain, " +
    "  SubscriberName as name, " +
    "  SerialNumber as serial, " +
    "  MACAddress as mac, " +
    "  Make as make, " +
    "  Model as model " +
    "FROM " +
    "  " + db_name + ".Subscriber, " +
    "  " + db_name + ".Equipment, " +
    "  " + db_name + ".ManagedRouter " + 
    "WHERE " + 
    " Subscriber.SystemID=" + escapedDomain + " AND " +
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
    r.url = WtManagedRouterMySQL.makeUrl(r.id);
    return r;
  });
  return res;
},{
  url: "/mr/list"
});
Meteor.method("wtManagedRouterMySQLAdd", function(router) {
  var res;
  var sql;
  // Check for duplicate Serial
  res = search.call(this, router.serial);
  if (res.length > 0) throw new Meteor.Error('dup','Duplicate Serial Number', router.serial);

  // Check for duplicate mac
  res = search.call(this, router.mac);
  if (res.length > 0) throw new Meteor.Error('dup','Duplicate MAC Address', router.mac);

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');

  var escapedName = WtManagedRouterMySQL.escape(router.name);
  var escapedSerial = WtManagedRouterMySQL.escape(router.serial);
  var escapedMAC = WtManagedRouterMySQL.escape(router.mac);
  var escapedMake = WtManagedRouterMySQL.escape(router.make);
  var escapedModel = WtManagedRouterMySQL.escape(router.model);

  // Check for Serial Number Conflict
  var fut = new Future();
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var sql = 
    "SELECT * FROM " +
    " " + db_name + ".Equipment " +
    "WHERE " + 
    " Equipment.SerialNumber=" + escapedSerial + " AND " +
    " Equipment.Deleted='N'";

  runQuery(sql, fut);

  var res = fut.wait();
  if (res.length > 0) throw new Meteor.Error('denied','Serial Number Conflict');



  var fut = new Future();
  var db_name = Meteor.settings.managedRouterMySQL.dbName;

  // Add the Name
  sql = 
    "INSERT INTO " +
    " " + db_name + ".Subscriber " +
    "VALUES ( " +
    " NULL, " + escapedDomain + ", 0, 0, " +
    " " + escapedName + ", " +
    " '', '', '', '', '', 'N', 'N' " +
    ")";

  runQuery(sql, fut);

  var res = fut.wait();
  var subId = res.insertId;

  fut = new Future();
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
  var eId = res.insertId;

  fut = new Future();
  // Add default passphrase
  var passphrase = WtManagedRouterMySQL.escape("W500" + router.serial.substr(-4));;
  sql = 
    "INSERT INTO " +
    " " + db_name + ".ManagedRouterLastSavedValue " +
    "VALUES ( " +
    " " + eId + ", " +
    " 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase', " +
    " " + passphrase + " " +
    ")";

  runQuery(sql, fut);
  res = fut.wait();

  return Meteor.call('wtManagedRouterMySQLSearch', router.serial);
},{
  url: "/mr/add"
});
Meteor.method("wtManagedRouterMySQLSearch", function(str) {
  return search.call(this, str);
},{
  url: "/mr/search"
});



