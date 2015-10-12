

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
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return _.findWhere(MapControl.markers, {id: Session.get('selectedTowerMarker')}).getPosition().lat();
		} else {
			return '';
		}
	},
	towerLng: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
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
	},
	tower: function () {
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			return WtTower.findOne({_id: Session.get('selectedTowerMarker')});
		}
	},
	log: function () {
		console.log(this);
	}
});

Template.wtTowerEditFormModal.events({
	'submit form': function (event) {
	
		if (typeof Session.get('selectedTowerMarker') != "undefined" && Session.get('selectedTowerMarker') != '') {
			//Update Tower
			var s=Array();


			/*console.log(event.target['ap[][name]'].value);
			console.log(event.target['ap[][azimuth]'].value);
			console.log(event.target['ap[][beamwidth]'].value);
			console.log(event.target['ap[][distance]'].value);
			console.log(event.target['ap[][frequency]'].value);
			console.log('no of elements:'+document.querySelectorAll("[name='ap[][name]']").length);*/

			
		for(var i=0; i<document.querySelectorAll("[name='ap[][name]']").length; i++)
		{
			var color = document.querySelectorAll("[name='ap[][color]']")[i].value;
			var name = document.querySelectorAll("[name='ap[][name]']")[i].value;
			var azimuth = document.querySelectorAll("[name='ap[][azimuth]']")[i].value;
			var beamwidth = document.querySelectorAll("[name='ap[][beamwidth]']")[i].value;
			var distance = document.querySelectorAll("[name='ap[][distance]']")[i].value;
			var frequency = document.querySelectorAll("[name='ap[][frequency]']")[i].value;
			s.push({
					'name': name,
					'azimuth': azimuth,
					'beamwidth': beamwidth,
					'distance': distance,
					'frequency': frequency,
					'color': color
				});
		}
			
		//console.log(s);
		
			
		var ret = WtTower.update({_id: Session.get('selectedTowerMarker')}, {
			$set: {
				name: event.target.name.value,
				"loc.coordinates.0": event.target.lng.value,
				"loc.coordinates.1": event.target.lat.value,
				"accesspoints":s
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
					icon: 'glyphicon glyphicon-ok',
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
	},
	'mousewheel #wtTowerEditFormModal': function (event) {
		if(event.originalEvent.wheelDelta /120 < 0) {
			$("#myCarousel").carousel('next');
		}
		else {
			$("#myCarousel").carousel('prev');
		}
	},
	'slid.bs.carousel #myCarousel': function () {
		$('.simplecolorpicker.fontawesome').show();
	}
});
