
Template.wtMenu.helpers({
  dropdown:function() {

    var loggedInUser = Meteor.user();
    var dropdowns = [];

    // get dropdowns based on the user roles
    for (var x = 0; x < WtMenu.dropdown.length; x++) {
      var canSeeTopLevel = false;
      // check if user can see this top level menu
      if (WtMenu.dropdown[x].roles.length == 0) {
        // no roles are set, so everyone can see it.
        canSeeTopLevel = true;
      } else {
        if (Roles.userIsInRole(loggedInUser, WtMenu.dropdown[x].roles)) {
          canSeeTopLevel = true;
        }
      }

      if (WtMenu.dropdown[x].display.get() == false) {
        canSeeTopLevel = false;
      }

      if (canSeeTopLevel) {
        // Now check the items
        var items = [];
        for (var i = 0; i < WtMenu.dropdown[x].items.length; i++) {
          // check if user can see this item
          if (WtMenu.dropdown[x].items[i].roles.length == 0) {
            // no roles are set, so everyone can see it.
            if (WtMenu.dropdown[x].items[i].display.get() == true) {
              items.push(WtMenu.dropdown[x].items[i]);
            }
          } else {
            if (Roles.userIsInRole(loggedInUser, WtMenu.dropdown[x].items[i].roles)) {
              if (WtMenu.dropdown[x].items[i].display.get() == true) {
                items.push(WtMenu.dropdown[x].items[i]);
              }
            }
          }
        }

        // add dropdown
        dropdowns.push({
          dropdownName: WtMenu.dropdown[x].dropdownName,
          dropdownIcon: WtMenu.dropdown[x].dropdownIcon,
          displayOrder: WtMenu.dropdown[x].displayOrder,
          items: items
        });
      }
    }

    return dropdowns.sort(function (a,b) {
      return a.displayOrder > b.displayOrder;
    });

  },
  primary: function() {

    var loggedInUser = Meteor.user();
    var primary = [];

    for (var x = 0; x < WtMenu.primary.length; x++) {
      // check if user can see this item
      if (WtMenu.primary[x].roles.length == 0) {
        // no roles are set, so everyone can see it.
        if (WtMenu.primary[x].display.get() == true) {
          primary.push(WtMenu.primary[x]);
        }
      } else {
        if (Roles.userIsInRole(loggedInUser, WtMenu.primary[x].roles)) {
          if (WtMenu.primary[x].display.get() == true) {
            primary.push(WtMenu.primary[x]);
          }
        }
      }

    }

    return primary;
  }
});
