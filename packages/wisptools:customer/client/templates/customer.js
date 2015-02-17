
Template.wtCustomerEditForm.helpers({
  formId: function () {
    return "customer_edit_form";    
  },
  schema: schema.customer,
  customerData: function () {
    return WtCustomer.findOne(this.id);
  }
});