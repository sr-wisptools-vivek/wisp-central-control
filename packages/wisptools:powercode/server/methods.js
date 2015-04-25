var Future = Npm.require('fibers/future');

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

    WtPowercode.pool.getConnection(function(err, connection) {
      if (err) { throw new Meteor.Error(err); }
      connection.query(sql, [], function(err, results) {
        connection.release(); // always put connection back in pool after last query
        if(err) { throw new Meteor.Error(err); }
        fut.return(results);
      });
    });

    return fut.wait();
  }
});
