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
  wtManagedRouterMySQLGetAll: function() {
    if (Meteor.userId() == null) return null;

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
      " Equipment.Model=ManagedRouter.CSGModel ";

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

    var res = fut.wait();
    res = _.map(res, function(r) {
      // add on the URL
      r.url = WtManagedRouterMySQL.makeUrl(r.EquipmentID);
      return r;
    });
    return res;
  }
});



