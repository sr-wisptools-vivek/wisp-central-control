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