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

  var sqlSearchMAC = sqlSearch.toUpperCase().replace(/:/g, "").replace(/\./g, "").replace(/-/g, "");
  var escapedSearchMAC = WtManagedRouterMySQL.escape("%" + sqlSearchMAC + "%");

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
    "   Equipment.MACAddress LIKE " + escapedSearchMAC + " " +
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
  var fut;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;


  // Check for duplicate Serial
  res = search.call(this, router.serial);
  if (res.length > 0){
    for (var i = 0; i < res.length; i++) {
      if (res[i].serial == router.serial) {
        throw new Meteor.Error('dup','Duplicate Serial Number', router.serial);
        break;
      }
    }  
  }

  // Check for duplicate mac
  router.mac = router.mac.toUpperCase().replace(/:/g, "").replace(/\./g, "").replace(/-/g, ""); // normalize mac
  res = search.call(this, router.mac);
  if (res.length > 0) throw new Meteor.Error('dup','Duplicate MAC Address', router.mac);

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');

  var escapedName = WtManagedRouterMySQL.escape(router.name);
  var escapedSerial = WtManagedRouterMySQL.escape(router.serial);
  var escapedMAC = WtManagedRouterMySQL.escape(router.mac);
  var Make;
  var model;

  // Check for reserved serial number
  fut = new Future();
  sql = 
    "SELECT " +
    "  Domain " +
    "FROM " +
    "  " + db_name + ".EquipmentReserved " +
    "WHERE " + 
    " SerialNumber=" + escapedSerial;
  runQuery(sql, fut);
  res = fut.wait();
  if (res.length > 0) {
    if (WtManagedRouterMySQL.escape(res[0].Domain) != escapedDomain)
      throw new Meteor.Error('denied','Serial Number Is Reserved');
  }


  //Auto detect model number from serial
  var serialWithModelNumber = { "RNV50":"WRT500",
                                "RNV210":"VRT210",
                                "RNV510":"VWRT510",
                                "RNV530":"VWRT520",
                                "RNV520":"VWRT520R",
                                "RNV220":"VRT220",
                                "12MS":"AC1200MS",
                                "12M":"AC1200M",
                                "400":"cnPilot R201",
                                "J12M00":"JMR1200M",
                                "LTN520":"LTE520",
                                "LTE520":"LTE520"
                              }; //serial numbers with auto detect model number.
  //Auto detect make number. 
  var macWithMakeNumber = { "00019F":"READYNET",
                            "000456":"CAMBIUM"
                          }; //OUI with make. (OUI: First 6 digits of MAC)
  // Used to override OUI based make.
  var modelToMake = {
    "JMR1200M":"JIVE"
  }
  var validSerial = false;
  var regexString;

  //Find model number with respect to serial. 
  for (key in serialWithModelNumber) {
    regexString = "\\b" + key;
    var regEx = new RegExp(regexString);

    if (regEx.test(escapedSerial)) {
      validSerial = true;
      model = serialWithModelNumber[key];
      break;
    }
  }

  if(!validSerial) {
    throw new Meteor.Error('denied','Invalid Serial Number');
  }
  var escapedModel = WtManagedRouterMySQL.escape(model);

  var validMac = false;
  //Find make with respect to OUI. 
  for (key in macWithMakeNumber) {
    regexString = "\\b" + key;
    var regEx = new RegExp(regexString);

    if (regEx.test(escapedMAC)) {
      validMac = true;
      make = macWithMakeNumber[key];
      if (modelToMake[model]) make = modelToMake[model]; //override make
      break;
    }
  }

  if(!validMac) {
    throw new Meteor.Error('denied','Invalid Mac Number');
  }
  var escapedMake  = WtManagedRouterMySQL.escape(make);

  // Check for Serial Number Conflict
  fut = new Future();
  sql = 
    "SELECT * FROM " +
    " " + db_name + ".Equipment " +
    "WHERE " + 
    " Equipment.SerialNumber=" + escapedSerial + " AND " +
    " Equipment.Deleted='N'";

  runQuery(sql, fut);

  res = fut.wait();
  if (res.length > 0) throw new Meteor.Error('denied','Serial Number Conflict');

  fut = new Future();

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

  res = fut.wait();
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

  // Add default passphrase
  var passphrase = WtManagedRouterMySQL.escape("UNKNOWN");
  switch (model) {
    case 'WRT500':
      passphrase = WtManagedRouterMySQL.escape("W500" + router.serial.substr(-4));;
      break;
    case 'VWRT510':
      passphrase = WtManagedRouterMySQL.escape("V510" + router.serial.substr(-4));;
      break;
    case 'VWRT520':
      passphrase = WtManagedRouterMySQL.escape("V520" + router.serial.substr(-4));;
      break;
    case 'AC1200M':
      passphrase = WtManagedRouterMySQL.escape("12M-" + router.serial.substr(-4));;
      break;
    case 'AC1200MS':
      passphrase = WtManagedRouterMySQL.escape("12MS" + router.serial.substr(-4));;
      break;
    case 'JMR1200M':
      passphrase = WtManagedRouterMySQL.escape("J12M" + router.serial.substr(-4));;
      break;
    case 'LTE520':
      passphrase = WtManagedRouterMySQL.escape("L520" + router.serial.substr(-4));;
      break;
  }
  // 2.4GHz Passphrase
  fut = new Future();
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

  // 5GHz Passphrase
  fut = new Future();
  sql = 
    "INSERT INTO " +
    " " + db_name + ".ManagedRouterLastSavedValue " +
    "VALUES ( " +
    " " + eId + ", " +
    " 'InternetGatewayDevice.LANDevice.1.WLANConfiguration.5.KeyPassphrase', " +
    " " + passphrase + " " +
    ")";
  runQuery(sql, fut);
  res = fut.wait();

  // Backend Event - Add Equipment
  fut = new Future();
  sql = 
    "INSERT INTO " +
    " " + db_name + ".Changes " +
    "VALUES ( " +
    " null, " +
    " 1, " +
    " 1, " +
    " 'AddUpdateEquipment', " +
    " '', " +
    " " + eId + ", " +
    " null, " +
    " '0000-00-00 00:00:00' " +
    ")";
  runQuery(sql, fut);
  res = fut.wait();

  return search.call(this, router.serial, 1);
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

Meteor.method("wtManagedRouterMySQLUpdate", function(router) {
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;
  var updateRouter = router.new;
  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');
  // Get SubscriberId for Equipment
  var fut = new Future();
  sql = "SELECT SubscriberID FROM "
        + db_name + ".Equipment " + 
        " WHERE EquipmentID = " + equipmentId; 
  runQuery(sql, fut);
  var res = fut.wait();
  var subscriberId = WtManagedRouterMySQL.escape(res[0].SubscriberID);

  var fut = new Future();
  sql = "SELECT * FROM " + 
        db_name + ".Subscriber " +
        "WHERE SubscriberID= " +
        subscriberId + " AND " +
        "SystemID= " + escapedDomain ; 
  runQuery(sql,fut);
  var res = fut.wait();
  if(res.length == 0) throw new Meteor.Error('denied','Domain Error');

  //Update SubscriberName in table Subscriber 
  if (typeof updateRouter["name"] !== "undefined") {
    
    var escapedName =  WtManagedRouterMySQL.escape(updateRouter.name);

    //Update Subscriber name
    var fut = new Future();
    sql = 
      "UPDATE " 
      + db_name + ".Subscriber "
      + "SET SubscriberName = "
      + escapedName +
      " WHERE " + "SubscriberID = " +
      subscriberId;

    runQuery(sql,fut);
    res = fut.wait();
  } //end of Subscriber Name update

  if (typeof updateRouter["mac"] !== "undefined") {
    updateRouter.mac = updateRouter.mac.toUpperCase().replace(/:/g, "").replace(/\./g, "").replace(/-/g, ""); // normalize mac
    var res;
    var escapedMac = WtManagedRouterMySQL.escape(updateRouter.mac); 
    var equipmentId = router.id; 
    
    // Check for duplicate mac
    res = search.call(this, updateRouter.mac);
    if (res.length > 0) throw new Meteor.Error('dup','Duplicate MAC Address', updateRouter.mac);

    //Update Mac
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
  return search.call(this, router.serial, 1);
},{
  url: "/mr/update"
});

Meteor.method("wtManagedRouterMySQLRemove", function(router){
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');

  // Get SubscriberId for Equipment
  var fut = new Future();

  sql = "SELECT SubscriberID FROM "
        + db_name + ".Equipment " + 
        " WHERE EquipmentID = " + equipmentId; 
  runQuery(sql, fut);
  var res = fut.wait();
  var subscriberId = WtManagedRouterMySQL.escape(res[0].SubscriberID);

  var fut = new Future();
  sql = "SELECT * FROM " + 
        db_name + ".Subscriber " +
        "WHERE SubscriberID= " +
        subscriberId + " AND " +
        "SystemID= " + escapedDomain ; 
  runQuery(sql,fut);
  var res = fut.wait();
  
  if(res.length == 0) throw new Meteor.Error('denied','Domain Error');
  
  var fut = new Future();
  sql = "UPDATE " 
        + db_name + ".Equipment "
        + "SET Deleted = 'Y' "
        + "WHERE " + "EquipmentID = "
        + equipmentId;
  runQuery(sql,fut);
  
  var res = fut.wait();
  var response = {
        "id" : equipmentId,
        "status" : "Deleted"
  };

  // Backend Event - Delete Equipment
  fut = new Future();
  sql = 
    "INSERT INTO " +
    " " + db_name + ".Changes " +
    "VALUES ( " +
    " null, " +
    " 1, " +
    " 1, " +
    " 'DeleteEquipment', " +
    " '', " +
    " " + equipmentId + ", " +
    " null, " +
    " '0000-00-00 00:00:00' " +
    ")";
  runQuery(sql, fut);
  res = fut.wait();

  return response;

},{
  url: "/mr/delete"
});

Meteor.method("wtManagedRouterMySQLRestore", function(router){
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized');

  // Get SubscriberId for Equipment
  var fut = new Future();

  sql = "SELECT SubscriberID FROM "
        + db_name + ".Equipment " + 
        " WHERE EquipmentID = " + equipmentId; 
  runQuery(sql, fut);
  var res = fut.wait();
  var subscriberId = WtManagedRouterMySQL.escape(res[0].SubscriberID);

  var fut = new Future();
  sql = "SELECT * FROM " + 
        db_name + ".Subscriber " +
        "WHERE SubscriberID= " +
        subscriberId + " AND " +
        "SystemID= " + escapedDomain ; 
  runQuery(sql,fut);
  var res = fut.wait();
  
  if(res.length == 0) throw new Meteor.Error('denied','Domain Error');
  
  var fut = new Future();
  sql = "UPDATE " 
        + db_name + ".Equipment "
        + "SET Deleted = 'N' "
        + "WHERE " + "EquipmentID = "
        + equipmentId;
  runQuery(sql,fut);
  var res = fut.wait();
  
  // Backend Event - Add/Update Equipment
  fut = new Future();
  sql = 
    "INSERT INTO " +
    " " + db_name + ".Changes " +
    "VALUES ( " +
    " null, " +
    " 1, " +
    " 1, " +
    " 'AddUpdateEquipment', " +
    " '', " +
    " " + equipmentId + ", " +
    " null, " +
    " '0000-00-00 00:00:00' " +
    ")";
  runQuery(sql, fut);
  res = fut.wait();  

  return search.call(this, router.serial, 1);
},{
  url: "/mr/undelete"
});

Meteor.method("wtManagedRouterMySQLReserve", function() {
  var mysqlRes;
  var fut;
  var res;

  if (!this.userId || !Roles.userIsInRole(this.userId, ['admin','reseller'])) throw new Meteor.Error('denied','Not Authorized');

  var db_name = Meteor.settings.managedRouterMySQL.dbName;

  var result = [];

  _.each(arguments, function (item) {
    var itemResult = {
      serial: item.serial,
      result: 'failed'
    }
    if (item.serial && item.domain) {
      var escapedSerial =  WtManagedRouterMySQL.escape(item.serial);
      var escapedDomain =  WtManagedRouterMySQL.escape(item.domain);

      //Delete from reserve
      fut = new Future();
      sql = 
        "DELETE FROM " + 
        " " + db_name + ".EquipmentReserved " +
        "WHERE SerialNumber = " + escapedSerial;
      runQuery(sql,fut);
      res = fut.wait();

      //Insert new reserve
      fut = new Future();
      sql = 
        "INSERT INTO " +
        " " + db_name + ".EquipmentReserved " +
        "VALUES ( " +
        " " + escapedSerial + ", " +
        " " + escapedDomain + " " +
        ")";
      runQuery(sql, fut);
      res = fut.wait();

      itemResult.result = 'success';
    }
    result.push(itemResult);
  });

  return result;

},{
  url: "/mr/reserve"
});