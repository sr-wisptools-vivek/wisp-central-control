if (Meteor.isClient) {
  WtGrowl = {
    success: function (msg) {
     $.growl({
          icon: 'glyphicon glyphicon-ok',
          message: ' ' + msg
      },{
          type: 'success'
      });
    },
    fail: function (msg) {
     $.growl({
          icon: 'glyphicon glyphicon-remove',
          message: ' ' + msg
      },{
          type: 'danger'
      });
    }
  }
}
