// Main collection for the towers.
WtTower = new WtCollection('wt_towers');
/*
WtTower.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: 'Name',
		max: 50
	},
	loc: {
		type: Object,
	},
	'loc.type': {
		type: String,
		autoform: {
			afFieldInput: {
				type: 'hidden',
				value: 'Point'
			}
		}
	},
	'loc.coordinates': {
		type: Object
	},
	'loc.coordinates[1]': {
		type: String,
		label: 'Latitude'
	},
	'loc.coordinates[0]': {
		type: String,
		label: 'Longitude'
	},
	accesspoints: {
		type: Array,
		optional: true
	},
	'accesspoints.$': {
		type: Object,
		optional: true
	},
	'accesspoints.$.name': {
		type: String,
		label: 'Name',
		max: 50
	},
	'accesspoints.$.azimuth': {
		type: Number,
		label: 'Azimuth',
		decimal: true,
		min: 0,
		max: 360,
		autoform: {
			step: '0.01'
		}
	},
	'accesspoints.$.beamwidth': {
		type: Number,
		label: 'Beamwidth',
		decimal: true,
		min: 0,
		max: 360,
		autoform: {
			step: '0.01'
		}
	},
	'accesspoints.$.distance': {
		type: Number,
		label: 'Range',
		decimal: true,
		autoform: {
			step: '0.01'
		}
	},
	'accesspoints.$.frequency': {
		type: Number,
		label: 'Frequency',
		decimal: true,
		autoform: {
			step: '0.01'
		}
	},
	'accesspoints.$.color': {
		type: String,
		label: 'Color',
		autoform: {
			afFieldInput: {
				class: 'simplecolorpicker'
			}
		}
	}
}));
*/