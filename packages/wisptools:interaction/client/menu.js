Template.wtInteractionDropdownMenu.helpers({
  menu: function () {
    return WtInteractionConfig.findOne({type: "menu"});
  },
  dropdownItems: function () {
    return WtInteractionConfig.find({type: "dropdown"}, {sort: {display_order: 1}});
  }
});