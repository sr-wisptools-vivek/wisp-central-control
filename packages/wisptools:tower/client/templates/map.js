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
	
		MapControl.map = GoogleMaps.maps.towerMap.instance;
	
		Deps.autorun(function() {
			var towers = WtTower.find().fetch();
			var towerIds = [];
	
			_.each(towers, function(tower) {
				//{ loc: { type: "Point", coordinates: [ 40, 5 ] } }
				var objMarker = {
					id: tower._id,
					lat: tower.loc.coordinates[1],
					lng: tower.loc.coordinates[0],
					title: tower.name
				};
		
				// check if marker already exists
				if (!MapControl.markerExists('id', objMarker.id))
					MapControl.addMarker(objMarker, {
						markerOptions: {},
						events: {
							'click': function () {
								Session.set('selectedTowerMarker', objMarker.id);
								$('#wtTowerEditFormModal').modal('show');
							}
						}
					});
				else
					MapControl.updateMarker(objMarker);
		
				// pushing to ids to remove towers
				towerIds.push(tower._id);
			});
		
			//removed towers
			_.each(_.difference(MapControl.towerIds, towerIds), function (id) {
				MapControl.removeMarker({id: id});
			});
	
			MapControl.calcBounds();
		});
	});
};

Template.wtTowerEditFormModal.helpers({
	towerName: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined") {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).title;
		} else {
			return '';
		}
	},
	towerDraggable: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined") {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getDraggable();
		} else {
			return false;
		}
	},
	towerId: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined") {
			return Session.get('selectedTowerMarker');
		} else {
			return false;
		}
	}
});