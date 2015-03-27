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
	//Initiating the draggable setting
	Session.set('towerDraggable', true)

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
				if (!MapControl.markerExists('id', objMarker.id)) {
					MapControl.addMarker(objMarker, {
						markerOptions: {
							draggable: Session.get('towerDraggable')
						},
						events: {
							'mousedown': function () {
								Session.set('selectedTowerMarker', objMarker.id);
							},
							'click': function () {
								$('#wtTowerEditFormModal').modal('show');
							},
							'dragend': function () {
								WtTower.update({_id: Session.get('selectedTowerMarker')}, {
																							$set: {
																								'loc.coordinates.0': _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lng(),
																								'loc.coordinates.1': _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lat()
																							}
															});
								//make the computation invalid for the modal form to get new lat/lng
								var temp = Session.get('selectedTowerMarker');
								Session.set('selectedTowerMarker', '');
								Session.set('selectedTowerMarker', temp);
							}
						}
					});
				} else {
					MapControl.updateMarker(objMarker, {
						markerOptions: {
							draggable: Session.get('towerDraggable')
						}
					});
				}

				// pushing to ids to remove towers
				towerIds.push(tower._id);
			});
		
			//removed towers
			_.each(_.difference(MapControl.towerIds, towerIds), function (id) {
				MapControl.removeMarker({id: id});
			});
		});
		MapControl.calcBounds();
	});
};

Template.wtTowerDraggable.helpers({
	dragTextBlock: function () {
		if (Session.get('towerDraggable')) {
			return '';
		} else {
			return 'hide';
		}
	}
});