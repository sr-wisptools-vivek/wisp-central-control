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

		WtTower.find().observe({
			added: function (tower) {
				var objMarker = {
					id: tower._id,
					lat: tower.loc.coordinates[1],
					lng: tower.loc.coordinates[0],
					title: tower.name
				};
				MapControl.addMarker(objMarker, {
					markerOptions: {
						draggable: Session.get('towerDraggable')
					},
					events: {
						'mousedown': function () {
							Session.set('selectedTowerMarker', '');
							Session.set('selectedTowerMarker', objMarker.id);
						},
						'click': function () {
							$('#wtTowerEditFormModal').modal({
								show: true,
								local: '#myCarousel'
							});
							//$('#myCarousel').carousel(0);
						},
						'dragend': function () {
							var ret = WtTower.update({_id: Session.get('selectedTowerMarker')}, {
																						$set: {
																							'loc.coordinates.0': _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lng(),
																							'loc.coordinates.1': _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lat()
																						}
														});
							if (ret) {
								$.growl({
									icon: 'glyphicon glyphicon-ok',
									message: 'Updated Tower'
								},{
									type: 'success'
								});
							} else {
								$.growl({
									icon: 'glyphicon glyphicon-warning-sign',
									message: 'Update Failed. Please try again'
								},{
									type: 'danger'
								});
							}
							//make the computation invalid for the modal form to get new lat/lng
							Session.set('selectedTowerMarker', '');
							Session.set('selectedTowerMarker', objMarker.id);
						}
					}
				});
			},
			changed: function (tower, oldTower) {
				var objMarker = {
					id: tower._id,
					lat: tower.loc.coordinates[1],
					lng: tower.loc.coordinates[0],
					title: tower.name
				};
				MapControl.updateMarker(objMarker);
			},
			removed: function (oldTower) {
				MapControl.removeMarker({id: oldTower.id});
			}
		});

		MapControl.calcBounds();

	});
};