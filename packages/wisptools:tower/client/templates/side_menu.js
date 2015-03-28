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
		if (Session.get('towerDraggable')) {
			$.growl({
				icon: 'glyphicon glyphicon-ok',
				message: 'You may now click and drag Towers to change the location'
			},{
				type: 'success'
			});
		}
	},
	'click #addTowerBtn': function () {
		Session.set('selectedTowerMarker', '');
		$('#wtTowerEditFormModal').modal('show');
	}
};