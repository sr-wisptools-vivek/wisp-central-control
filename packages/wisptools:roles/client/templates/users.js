
   

Template.wtRolesUser.created = function(){
var self = this;
Meteor.subscribe('admin');
  self.userList = new ReactiveVar([]);
var data =Meteor.users.find();
var count = Meteor.users.find().count();
 self.userList.set(data);
}

Template.wtRolesUser.helpers({
   userList: function(){ 
       return Template.instance().userList.get();
   }
});

Template.wtRolesUsersSelect.created = function(){
    var sel=this;
    sel.typeList= new ReactiveVar([]);

    
}

Template.wtRolesUsersSelect.helpers({
 userType: function () {
    var User = Template.parentData(1);
   // console.log(User);
    Meteor.subscribe('user');
  //  var data = Meteor.users.findOne({roles: User.name});
    console.log(data);
    // init if not found
   /* if (data == undefined) {
      var webUsername = this.webUsername;
      data = {
        _ID: User._ID,
        username: User.username,
        roles: User.roles
      }
      
    }*/
    return data;
  },
  typeList: function () {
      Meteor.subscribe('roles');
    return Meteor.roles.find();
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});
/*
Template.wtRolesUsersSelect.events({
    "change .type-sel": function (event) {
        var User = Template.parentData(0);
        var CustomerID=User.CustomerID;   
    
        var data = {
          CustomerID: User.CustomerID,
          AccountTypeID: event.target.value
      
        }

        Meteor.call('wtRolesUpdateUser',data.CustomerID,data.AccountTypeID, function (err, res) {
         if (err)
            WtGrowl.fail("Could not update Role type for user " + User.FirstName);
         else
            WtGrowl.success("Role type updated for user " + User.FirstName);

        });
    }
});*/

