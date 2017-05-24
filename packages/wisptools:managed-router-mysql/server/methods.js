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

var authorize = function(router) {
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;

  // Check if the user's domain matches the equipment domain

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) throw new Meteor.Error('denied','Not Authorized'); // User not logged in or has no domain

  // Get SubscriberId for Equipment
  var fut = new Future();

  sql = "SELECT SubscriberID FROM "
        + db_name + ".Equipment " + 
        " WHERE EquipmentID = " + equipmentId; 
  runQuery(sql, fut);
  var res = fut.wait();
  if(res.length == 0) throw new Meteor.Error('denied','Router ID Not Found');
  var subscriberId = WtManagedRouterMySQL.escape(res[0].SubscriberID);

  var fut = new Future();
  sql = "SELECT * FROM " + 
        db_name + ".Subscriber " +
        "WHERE SubscriberID= " +
        subscriberId + " AND " +
        "SystemID= " + escapedDomain ; 
  runQuery(sql,fut);
  var res = fut.wait();
  if(res.length == 0) throw new Meteor.Error('denied','Non Authorized Domain');

  // You have the power!
  return true;
}

var search = function(search, limit, page) {
  if (this.userId == null) return [];

  var escapedDomain = getDomain.call(this);
  if (escapedDomain == null) return [];

  var sqlSearch = search || "";
  if (sqlSearch.toString() === "[object Object]") sqlSearch = ''; // handleing default empty object on rest api
  var escapedSearch = WtManagedRouterMySQL.escape("%" + sqlSearch + "%");

  var sqlSearchMAC = sqlSearch.toUpperCase().replace(/:/g, "").replace(/\./g, "").replace(/-/g, "");
  var escapedSearchMAC = WtManagedRouterMySQL.escape("%" + sqlSearchMAC + "%");

  var sqlLimit = limit || 20;
  if (!isNaN(sqlLimit)) sqlLimit == 20;
  //if (sqlLimit.toString() === "[object Object]") sqlLimit = 20; // handleing default empty object on rest api

  var sqlPage = page || 1;
  if (!isNaN(sqlPage)) sqlPage == 1;
  //if (sqlPage.toString() === "[object Object]") sqlPage = 1; // handleing default empty object on rest api

  if (sqlPage != 1) {
    var limitStart = sqlLimit * (sqlPage - 1);
    sqlLimit = limitStart + ',' + sqlLimit;
  }

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

var searchReservation = function(search, limit) {
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
    "  SerialNumber as serial " +
    "FROM " +
    "  " + db_name + ".EquipmentReserved " +
    "WHERE " +
    "  Domain=" + escapedDomain + " AND " +
    "  SerialNumber LIKE " + escapedSearch + " " +
    "ORDER BY SerialNumber DESC " +
    "LIMIT " + sqlLimit;

  runQuery(sql, fut);

  var res = fut.wait();
  return res;
}

Meteor.method("wtManagedRouterMySQLGetMyDomain", function() {
  var domain = WtMangedRouterMySQLDomains.findOne({userId: this.userId});
  if (!domain) return null;
  if (domain.name == "") return null;
  return domain.name;
});

Meteor.method("wtManagedRouterMySQLGetMyDomainId", function(userId) {
  var _userId = userId || this.userId;
  var domain = WtMangedRouterMySQLDomains.findOne({userId: _userId});
  if (!domain) return null;
  if (domain.name == "") return null;
  var domainRecord = Meteor.call('wtManagedRouterGetDomain', domain.name);
  if (!domainRecord) return null;
  return domainRecord._id;
});

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

  router.name = router.name.trim();
  router.serial = router.serial.trim();
  router.mac = router.mac.trim();

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
                                "400FRG":"cnPilot R200x",
                                "WFSH":"cnPilot R200x",
                                "J12M00":"JMR1200M",
                                "LTN520":"LTE520",
                                "LTE520":"LTE520",
                                "L42":"LTE420",
                                "L52":"LTE520",
                                "FLY8417":"FTA1101",
                                "S162V":"EMG3425-Q10A",
                                "S172V":"EMG3425-Q10A",
                                "10M":"AC1000M",
                                "11M":"AC1100M",
                                "FLY611":"AC1000M",
                                "10MS":"AC1000MS",
                                "600347":"BEC 8920NE"
                              }; //serial numbers with auto detect model number.
  //Auto detect make number. 
  var macWithMakeNumber = { "00019F":"READYNET",
                            "000456":"CAMBIUM",
                            "0021F2":"FLYINGVOICE",
                            "603197":"ZyXEL",
                            "600347":"BEC Technologies Inc."
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
  var defaultRemotePassword = WtManagedRouterMySQL.escape("UNKNOWN");
  var passphrase = WtManagedRouterMySQL.escape("UNKNOWN");
  switch (model) {
    case 'WRT500':
      passphrase = WtManagedRouterMySQL.escape("W500" + router.serial.substr(-4));;
      defaultRemotePassword = WtManagedRouterMySQL.escape("pz938q500");
      break;
    case 'VWRT510':
      passphrase = WtManagedRouterMySQL.escape("V510" + router.serial.substr(-4));;
      defaultRemotePassword = WtManagedRouterMySQL.escape("pz938q510");
      break;
    case 'VWRT520':
      passphrase = WtManagedRouterMySQL.escape("V520" + router.serial.substr(-4));;
      break;
    case 'AC1200M':
      passphrase = WtManagedRouterMySQL.escape("12M-" + router.serial.substr(-4));;
      defaultRemotePassword = WtManagedRouterMySQL.escape("pz938q12m");
      break;
    case 'AC1200MS':
      passphrase = WtManagedRouterMySQL.escape("12MS" + router.serial.substr(-4));;
      defaultRemotePassword = WtManagedRouterMySQL.escape("pz938q12ms");
      break;
    case 'JMR1200M':
      passphrase = WtManagedRouterMySQL.escape("J12M" + router.serial.substr(-4));;
      break;
    case 'LTE520':
      passphrase = WtManagedRouterMySQL.escape("L520" + router.serial.substr(-4));;
      break;
  }
  // Default remote management password
  fut = new Future();
  sql = 
    "INSERT INTO " +
    " " + db_name + ".ManagedRouterLastSavedValue " +
    "VALUES ( " +
    " " + eId + ", " +
    " 'InternetGatewayDevice.UserInterface.User.1.Password', " +
    " " + defaultRemotePassword + " " +
    ")";
  runQuery(sql, fut);
  res = fut.wait();
  
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

// srch is a string or an object with "q", "limit" and "type" values
Meteor.method("wtManagedRouterMySQLSearch", function(srch) {
  var str = srch.q || srch;
  var limit = srch.limit || 20;
  var type = srch.type || 'router';
  var page = srch.page || 1;
  if (type == 'reservation') {
    return searchReservation.call(this, str, limit);
  } else {
    return search.call(this, str, limit, page);
  }
},{
  url: "/mr/search"
});


Meteor.method("wtManagedRouterMySQLUpdate", function(router) {
  var res;
  var sql;
  var db_name = Meteor.settings.managedRouterMySQL.dbName;
  var equipmentId = router.id;
  var updateRouter = router.new;

  //Check if user is authorized.
  authorize.call(this, router);

  //Update SubscriberName in table Subscriber 
  if (typeof updateRouter["name"] !== "undefined") {
    
    var escapedName =  WtManagedRouterMySQL.escape(updateRouter.name);

    //Update Subscriber name
    var fut = new Future();
    sql = 
      "UPDATE " 
      + db_name + ".Subscriber, "
      + db_name + ".Equipment "
      + "SET Subscriber.SubscriberName = "
      + escapedName +
      " WHERE " + "Subscriber.SubscriberID = Equipment.SubscriberID "
      + "AND Equipment.EquipmentID = " +
      equipmentId;

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

  //Check if user is authorized.
  authorize.call(this, router);
  
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

  //Check if user is authorized.
  authorize.call(this, router);
  
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
    if (!item.serial) itemResult.result = 'serial value missing';
    if (!item.domain) itemResult.result = 'domain value missing';
    if (item.serial == "") itemResult.result = 'serial cannot be blank';
    if (item.domain == "") itemResult.result = 'domain cannot be blank';
    if (item.serial && item.domain) {
      //Is the domain name exist?
      if (Meteor.call('wtManagedRouterCheckDomain', item.domain)) {
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
      } else {
        itemResult.result = 'non-existing domain';
      }
    }
    result.push(itemResult);
  });

  return result;

},{
  url: "/mr/reserve"
});

Meteor.method("wtManagedRouterUpdateUserDomain", function(oldDomainName, newDomainName){
  if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error('denied','Not Authorized');
  WtMangedRouterMySQLDomains.update({name:oldDomainName}, {$set: {name: newDomainName}}, {multi: true});
});

Meteor.method("wtManagedRouterAddUserDomain", function (userId, domain) {
  if (!this.userId || (this.userId && this.userId!=userId)) throw new Meteor.Error('denied','Not Authorized');
  var userDomain = WtMangedRouterMySQLDomains.findOne({userId: userId});
  if (userDomain) {
    WtMangedRouterMySQLDomains.update({userId: userId}, {$set: {name: domain}});
  } else {
    WtMangedRouterMySQLDomains.insert({userId: userId, name: domain});
  }
});

Meteor.method("wtManagedRouterGetUpdateACS", function(getDomain) {
  var domain = WtMangedRouterMySQLDomainsList.findOne({domain: getDomain});
  var updateACS = { "result":false};
  if(domain && domain.updateACS) {
     updateACS.result = true;
  }
  return updateACS;
},{
  url: "/mr/domain/update-acs/:0"
});


Meteor.method("wtManagedRouterACSGet", function(request){
  //Check if user is authorized.
  authorize.call(this, request);

  this.unblock();
  var res = HTTP.call('GET', WtManagedRouterMySQL.makeUrl(request.id, 'ajax/get.php'));
  if (res.data.RESULT != 'SUCCESS') throw new Meteor.Error('error', res.data.ERROR);

  return res.data.REPLY;

},{
  url: "/mr/acs/device/get"
});

Meteor.method("wtManagedRouterACSSet", function(request){
  //Check if user is authorized.
  authorize.call(this, request);

  //Build Request Values.  Add "item_" to each item id.
  var params = {};
  for (var x = 0; x < request.values.length; x++) {
    params["item_" + request.values[x].item_id] = request.values[x].value;
  }

  this.unblock();
  var res = HTTP.call('POST', WtManagedRouterMySQL.makeUrl(request.id, 'ajax/save_to_acs.php'), {params:params});
  if (res.data.RESULT != 'SUCCESS') throw new Meteor.Error('error', res.data.ERROR);
  
  return {'acs_reply':'accepted'};
  
},{
  url: "/mr/acs/device/set"
});

Meteor.method("wtManagedRouterACSReboot", function(request){
  //Check if user is authorized.
  authorize.call(this, request);

  this.unblock();
  var res = HTTP.call('GET', WtManagedRouterMySQL.makeUrl(request.id, 'ajax/send_reboot.php'));
  if (res.data.RESULT != 'SUCCESS') throw new Meteor.Error('error', res.data.ERROR);
  
  return {'acs_reply':'accepted'};
},{
  url: "/mr/acs/device/reboot"
});

Meteor.method("wtManagedRouterACSRefresh", function(request){
  //Check if user is authorized.
  authorize.call(this, request);

  this.unblock();
  var res = HTTP.call('GET', WtManagedRouterMySQL.makeUrl(request.id, 'ajax/refresh_v2.php'));
  if (res.data.RESULT != 'SUCCESS') throw new Meteor.Error('error', res.data.ERROR);
  
  return {'acs_reply':'accepted'};
},{
  url: "/mr/acs/device/refresh"
});

Meteor.method("wtManagedRouterIsOnline", function(request){
  //Check if user is authorized.
  authorize.call(this, request);

  this.unblock();
  var res = HTTP.call('GET', WtManagedRouterMySQL.makeUrl(request.id, 'ajax/is_recent_checkin.php'));
  if (res.data.RESULT != 'SUCCESS') throw new Meteor.Error('error', res.data.ERROR);
  return res.data.REPLY;
},{
  url: "/mr/acs/device/online"
});
