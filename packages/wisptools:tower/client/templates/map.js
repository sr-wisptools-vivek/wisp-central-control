Template.wtTowers.helpers({
  mapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };
    }
  }
});

Template.wtTowers.created = function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('towerMap', function(map) {
    // Add a marker to the map once it's ready

    Deps.autorun(function() {
      var towers = WtTower.find().fetch();

      _.each(towers, function(tower) {
        //{ loc: { type: "Point", coordinates: [ 40, 5 ] } }
        var objMarker = {
          id: tower._id,
          lat: tower.loc.coordinates[1],
          lng: tower.loc.coordinates[0],
          title: tower.name
        };

        // check if marker already exists
        if (!mapControl.markerExists('id', objMarker.id))
          mapControl.addMarker(objMarker);
      });
    });
    //var marker = new google.maps.Marker({
    //  position: map.options.center,
    //  map: map.instance
    //});
  });
};