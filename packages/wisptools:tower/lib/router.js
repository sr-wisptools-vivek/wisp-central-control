Router.route('/towers', {
  name: 'towerMap',
  template: 'wtTowers',
  data: function() {
    return WtTower.find();
  }
});

Router.onBeforeAction(function() {
  GoogleMaps.load({libraries: 'geometry'});
  this.next();
}, { only: ['towerMap'] });

Router.route('/routers', {
  name: 'managedRouter',
  template: 'managedRouter',
});

