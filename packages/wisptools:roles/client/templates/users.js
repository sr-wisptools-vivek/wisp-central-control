Template.wtRolesUser.created = function(){
 /*   var self=this;
    self.userList=new ReactiveVar([]);
*/
    
   
}

Template.wtRolesuser.helpers({
  /* userList: function(){ 

       return Template.instance().userList.get();

     
   }*/
});

Template.wtRolesCustomerSelect.created = function(){
    var sel=this;
    sel.typeList= new ReactiveVar([]);

    
}

Template.wtRolesCustomerSelect.helpers({
    userType: function () {
        var User = Template.parentData(1);
       ;
        var data;
        if (data == undefined) {
    
          data = {
           
        
            }
      
        }
  
      return data;
    },
    typeList: function () {
        return Template.instance().typeList.get();  
    },
    selected: function (a, b) {
        return a == b ? 'selected' : '';
    }
});

Template.wtRolesCustomerSelect.events({
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
});

