Template.wtInteraction.helpers({
	isDefault: function() {
		if (this.type != 'sales' && this.type != 'support' && this.type != 'service') {
			return true
		}
		return false
	},
	isSales: function() {
		if (this.type == 'sales') {
			return true
		}
		return false
	},
	isSupport: function() {
		if (this.type == 'support') {
			return true
		}
		return false
	},
	isService: function() {
		if (this.type == 'service') {
			return true
		}
		return false
	},
});

Template.wtNewInteraction.helpers({
	gotoIdPage: function() {
		Router.go('interactionById', {_id: this._id});
	}
});