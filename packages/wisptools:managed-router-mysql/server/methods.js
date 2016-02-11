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

var search = function(search, limit) {
  if (this.userId == null) return [];

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) return [];

  var sqlSearch = search || "";
  if (sqlSearch.toString() === "[object Object]") sqlSearch = ''; // handleing default empty object on rest api
  var escapedSearch = WtManagedRouterMySQL.escape("%" + sqlSearch + "%");

  var sqlLimit = limit || 20;
  if (sqlLimit.toString() === "[object Object]") sqlLimit = 20; // handleing default empty object on rest api
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
    " Equipment.Model=ManagedRouter.CSGModel AND " +
    " ( " +
    "   Subscriber.SubscriberName LIKE " + escapedSearch + " OR " +
    "   Equipment.SerialNumber LIKE " + escapedSearch + " OR " +
    "   Equipment.MACAddress LIKE " + escapedSearch + " " +
    " ) " +
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
}

Meteor.method("wtManagedRouterMySQLGetLimit", function(limit) {
  return search.call(this, '', limit);
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
// srch is a string or an object with "q" and "limit" values
Meteor.method("wtManagedRouterMySQLSearch", function(srch) {
  var str = srch.q || srch;
  var limit = srch.limit || 20;
  return search.call(this, str, limit);
},{
  url: "/mr/search"
});

Meteor.method("wtManagedRouterMySQLUpdate", function(router, updateRouter) {
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;
  var escapedDomain = getDomain.call(this);
  
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');

  //Update SubscriberName in table Subscriber 
  if (typeof updateRouter["name"] !== "undefined") {
    
    var escapedName =  WtManagedRouterMySQL.escape(updateRouter.name);
 
    // Get SubscriberId for Equipment
    var fut = new Future();
    sql = "SELECT SubscriberId FROM " + db_name + ".Equipment WHERE EquipmentId = " + equipmentId; 
    runQuery(sql, fut);
    var res = fut.wait();
    var subscriberId = WtManagedRouterMySQL.escape(res[0].SubscriberId);

    //Update Subscrider name
    var fut = new Future();
    sql = 
      "UPDATE " 
      + db_name + ".Subscriber "
      + "SET SubscriberName = "
      + escapedName +
      " WHERE " + "SubscriberId = " +
      subscriberId;

    runQuery(sql,fut);
    res = fut.wait();
  } //end of Subscriber Name update

  if (typeof updateRouter["serial"] !== "undefined" ){
    var res;
    var escapedSerial = WtManagedRouterMySQL.escape(updateRouter.serial); 
    var equipmentId = router.id;

    // Check for duplicate Serial
    res = search.call(this, updateRouter.serial);
    if (res.length > 0) throw new Meteor.Error('dup','Duplicate Serial Number', updateRouter.serial); 

    // Check for Serial Number Conflict
    var fut = new Future();
    var sql = 
        "SELECT * FROM " +
        " " + db_name + ".Equipment " +
        "WHERE " + 
        " Equipment.SerialNumber=" + escapedSerial + " AND " +
        " Equipment.Deleted='N'";

    runQuery(sql, fut);

    var res = fut.wait();
    if (res.length > 0) throw new Meteor.Error('denied','Serial Number Conflict');

    //Update Serial
    var fut = new Future();
    sql = 
      "UPDATE "
      + db_name + ".Equipment "
      + "SET SerialNumber = "
      + escapedSerial +
      " WHERE " + "EquipmentID = " +
      equipmentId;
    runQuery(sql,fut);
    res = fut.wait();
  } //end of serial number update

  if (typeof updateRouter["mac"] !== "undefined") {
    var res;
    var escapedMac = WtManagedRouterMySQL.escape(updateRouter.mac); 
    var equipmentId = router.id; 
    
    // Check for duplicate mac
    res = search.call(this, updateRouter.mac);
    if (res.length > 0) throw new Meteor.Error('dup','Duplicate MAC Address', updateRouter.mac);

    //Update Serial
    var fut = new Future();
    sql = 
      "UPDATE "
      + db_name + ".Equipment "
      + "SET MACAddress = "
      + escapedMac +
      " WHERE " + "EquipmentID = " +
      equipmentId;
    runQuery(sql,fut);
    res = fut.wait();
  }

  return Meteor.call('wtManagedRouterMySQLSearch','');
});





