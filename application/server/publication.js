Meteor.publish('admin', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Meteor.users.find({});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});

Meteor.publish('roles', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Meteor.roles.find({});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});

/*
Meteor.publish('user', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Meteor.roles.findOne({},{roles:name});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});*/