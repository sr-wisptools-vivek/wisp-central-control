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

Template.wtTowerEditFormModal.helpers({
	towerName: function (head) {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).title;
		} else {
			if (head == 'true')
				return 'Add Tower';
			else
				return '';
		}
	},
	towerLat: function () {
		console.log("wtTowerEditFormModal towerLat");
		if (typeof Session.get('selectedTowerMarker') != "undefined") {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lat();
		} else {
			return '';
		}
	},
	towerLng: function () {
		console.log("wtTowerEditFormModal towerLng");
		if (typeof Session.get('selectedTowerMarker') != "undefined") {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lng();
		} else {
			return '';
		}
	},
	btnContent: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return 'Save';
		} else {
			return 'Add';
		}
	}
});

Template.wtTowerEditFormModal.events({
	'submit form': function (event) {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			WtTower.update({_id: Session.get('selectedTowerMarker')}, {
				$set: {
					name: event.target.name.value,
					"loc.coordinates.0": event.target.lng.value,
					"loc.coordinates.1": event.target.lat.value
				}
			});
			MapControl.updateMarker({
				id: Session.get('selectedTowerMarker'),
				title: event.target.name.value,
				lat: event.target.lat.value,
				lng: event.target.lng.value
			});
		} else {
			WtTower.insert({
				name: event.target.name.value,
				loc: {
					type: 'Point',
					coordinates: [event.target.lng.value, event.target.lat.value]
				}
			});
		}
		$('#wtTowerEditFormModal').modal('hide');
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
});

Template.wtTowerDraggable.helpers({
	dragTextBlock: function () {
		if (Session.get('towerDraggable')) {
			return '';
		} else {
			return 'hide';
		}
	}
});

Template.wtTowerControls.helpers({
	dragBtnClass: function () {
		if (Session.get('towerDraggable')) {
			return 'btn-success';
		} else {
			return 'btn-primary';
		}
	},
	dragBtnDisplay: function () {
		if (Session.get('towerDraggable')) {
			return 'On';
		} else {
			return 'Off';
		}
	}
});

Template.wtTowerControls.events = {
	'click #dragBtn': function () {
		Session.set('towerDraggable', ! Session.get('towerDraggable'));
	},
	'click #addTowerBtn': function () {
		Session.set('selectedTowerMarker', '');
		$('#wtTowerEditFormModal').modal('show');
	}
};