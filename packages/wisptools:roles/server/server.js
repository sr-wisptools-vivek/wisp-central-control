
Accounts.onCreateUser( function (options, user) {
if(Meteor.users.find().count()<1)
{
    
user.roles = ['admin'];
if ( options.profile )
user.profile ={name:user.username};

if (user.roles.length > 0) {
Roles.addUsersToRoles(user._id,['admin']);
}
return user;
}
else
{
user.roles = ['Customer'];
if ( options.profile )
user.profile = {name:user.username};

if (user.roles.length > 0) {
Roles.addUsersToRoles(user._id,['Customer']);
}
return user;
}
});

