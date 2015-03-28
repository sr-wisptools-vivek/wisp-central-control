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
			//Update Tower
			var ret = WtTower.update({_id: Session.get('selectedTowerMarker')}, {
				$set: {
					name: event.target.name.value,
					"loc.coordinates.0": event.target.lng.value,
					"loc.coordinates.1": event.target.lat.value
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
			MapControl.updateMarker({
				id: Session.get('selectedTowerMarker'),
				title: event.target.name.value,
				lat: event.target.lat.value,
				lng: event.target.lng.value
			});
		} else {
			//Add Tower
			var ret = WtTower.insert({
				name: event.target.name.value,
				loc: {
					type: 'Point',
					coordinates: [event.target.lng.value, event.target.lat.value]
				}
			});
			if (ret) {
				$.growl({
					//icon: 'glyphicon glyphicon-ok',
					message: 'Added Tower'
				},{
					type: 'success'
				});
			} else {
				$.growl({
					icon: 'glyphicon glyphicon-warning-sign',
					message: 'Insert Failed. Please try again'
				},{
					type: 'danger'
				});
			}
		}
		$('#wtTowerEditFormModal').modal('hide');
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
});