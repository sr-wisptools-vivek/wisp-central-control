Router.route('/towers', {
  name: 'towerMap',
  template: 'wtTowers',
  data: function() {
    return WtTower.find();
  }
});

Router.onBeforeAction(function() {
  GoogleMaps.load();
  this.next();
}, { only: ['towerMap'] });
