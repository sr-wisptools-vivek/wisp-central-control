Template.wtFreeRouterForm.events({
  'submit #requestFreeRouter': function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Build object with form data
    var formData = {};
    formData.status = "Submitted";
    for (var x = 0; x < e.target.length; x++) {
      if (e.target[x].name) {
        if (e.target[x].type === 'checkbox') {
          formData[e.target[x].name] = e.target[x].checked;
        } else {
          formData[e.target[x].name] = e.target[x].value;
        }
      }
    }
    WtFreeRouter.insert(formData);
    WtGrowl.success('Thank you.');
    Router.go('wtManagedRouterMySQLList');
  }
});