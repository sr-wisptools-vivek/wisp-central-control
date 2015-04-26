if (Meteor.isClient) {

  Template.wtDeleteBtn.events({
    "click .wt-del-btn": function (event) {
      var id = this.id;
      var name = this.name;
      var collection = this.collection;

      bootbox.dialog({
        message: "Are you sure?",
        title: "Delete: " + name,
        buttons: {
          no: {
            label: "No",
            className: "btn-default"
          },
          yes: {
            label: "Yes, delete!",
            className: "btn-danger",
            callback: function () {
              console.log("DELETED: " + id);
              Meteor.call('wtMarkAsDeleted', id, collection);
            }
          }
        }
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.methods({
    wtMarkAsDeleted: function (id, collection) {
      var data = {
        deleted: true,
        deletedOn: new Date().valueOf()
      }
      Mongo.Collection.get(collection).update(id, data);
    }
  });
}