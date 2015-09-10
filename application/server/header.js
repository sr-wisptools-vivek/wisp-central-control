/*if(Meteor.users.find().count>1)
{
var users={roles:['admin']}
}
*/

Accounts.onCreateUser(function(options, user){
      var users=[
      {name:user.username,roles:['admin']},
         ];
         
         _.each(users,function(userData)
         {
            username:userData.name;
            
         });
    
});