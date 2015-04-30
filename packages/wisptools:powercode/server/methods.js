var Future = Npm.require('fibers/future');

var runQuery = function (sql, future) {
  // Get connection from pool
  WtPowercode.pool.getConnection(function(err, connection) {
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
  wtPowercodeGetAllWebUsers: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var db_name = Meteor.settings.powercode.dbName;
    var sql = 
      "SELECT  " +
      "  w.WebUserID, " +
      "  w.Username,  " +
      "  w.AccessLevel,  " +
      "  w.BadPass,  " +
      "  w.Name,  " +
      "  a.Address1, " +
      "  a.Address2, " +
      "  a.City, " +
      "  a.State, " +
      "  a.ZipCode, " +
      "  p.Number, " +
      "  e.Email  " +
      "FROM  " +
      "  " + db_name + ".WebUser w " +
      "  LEFT JOIN " + db_name + ".Email e ON w.EmailID=e.ID " +
      "  LEFT JOIN " + db_name + ".Phone p ON w.PhoneID=p.ID " +
      "  LEFT JOIN " + db_name + ".Address a ON w.AddressID=a.AddressID " +
      "ORDER BY w.Username ";

    runQuery(sql, fut);

    return fut.wait();
  }
});

var getServicesSQL = function (type) {
  var where = "";
  var db_name = Meteor.settings.powercode.dbName;
  if (type == "Monthly Services") {
    where = "WHERE Type IN ('Monthly','Monthly Internet')";
  }
  return "SELECT ID, Cost, Type, Tax, Status, Discription as Description, CONCAT('$', FORMAT(Cost, 2)) as CostFormat FROM " + db_name + ".Services " + where + " ORDER BY Type, Description";
}

Meteor.methods({
  wtPowercodeGetAllServices: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var sql = getServicesSQL(null);
    runQuery(sql, fut);

    return fut.wait();
  }
});


Meteor.methods({
  wtPowercodeGetAllMonthlyServices: function() {
    if (Meteor.userId() == null) return null;

    var fut = new Future();
    var sql = getServicesSQL("Monthly Services");
    runQuery(sql, fut);

    return fut.wait();
  }
});
