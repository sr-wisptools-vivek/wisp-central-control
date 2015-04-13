// Write your package code here!
AccessPoints = {
	map: {},
	groups: [],
	accesspoints: [],
	polygons: [],

	checkGroup: function (groupData, method) {
		if (_.isUndefined(groupData.id)) {
			throw new Meteor.Error(500, 'Error: AccessPoints '+method+' requires an id property');
		}
		if ( (_.isUndefined(groupData.lat) || !_.isFinite(groupData.lat)) && method!='removeGroup' ) {
			throw new Meteor.Error(500, 'Error: AccessPoints '+method+' requires an lat property and must be finite');
		}
		if ( (_.isUndefined(groupData.lng) || !_.isFinite(groupData.lng)) && method!='removeGroup' ) {
			throw new Meteor.Error(500, 'Error: AccessPoints '+method+' requires an lng property and must be finite');
		}
		return true;
	},

	addGroup: function (groupData) {
		if (this.checkGroup(groupData, 'addGroup')) {
			var group = _.pick(groupData, 'id', 'lat', 'lng');
			this.groups.push(group);
			return group;
		}
	},

	updateGroup: function (groupData) {
		if (this.checkGroup(groupData, 'updateGroup')) {
			var group = _.pick(groupData, 'lat', 'lng');
			_.extend(_.findWhere(this.groups, {id: groupData.id}), group);
			//update all the accesspoints in this group
			_.each(_.find(this.accesspoints, {groupId: groupData.id}), function (accesspoint, key) {
				var ap = _.extend(accesspoint, {lat: groupData.lat, lng: groupData.lng});
				this.updateAccessPoint({options: ap});
			});
		}
	},

	removeGroup: function (groupData) {
		if (this.checkGroup(groupData, 'removeGroup')) {
			//remove all accesspoints in the groups
			_.each(_.find(this.accesspoints, {groupId: groupData.id}), function (accesspoint, key) {
				this.removeAccessPoint({options: accesspoint});
			});

			//unset from groups
			this.groups = _.reject(this.group, function (group) {
								return group.id == groupData.id;
			});
		}
	},

	checkAccessPoint: function (ap, property) {
		if (!_.has(ap, property)) {
			throw new Meteor.Error(500, 'Error: AccessPoint requires '+property+' property');
		}
		return true;
	},

	addAccessPoint: function (ap) {
		console.log('addAccessPoint called');
		//console.log(ap);
		this.checkAccessPoint(ap.options, 'id');
		this.checkAccessPoint(ap.options, 'groupId');
		this.checkAccessPoint(ap.options, 'name');
		this.checkAccessPoint(ap.options, 'lat');
		this.checkAccessPoint(ap.options, 'lng');
		this.checkAccessPoint(ap.options, 'azimuth');
		this.checkAccessPoint(ap.options, 'beamwidth');
		this.checkAccessPoint(ap.options, 'distance');
		this.checkAccessPoint(ap.options, 'frequency');
		this.checkAccessPoint(ap.options, 'color');

		var accesspoint = _.pick(ap.options, 'id', 'groupId', 'name', 'lat', 'lng', 'azimuth', 'beamwidth', 'distance', 'frequency', 'color');
		this.accesspoints.push(accesspoint);

		if (typeof _.findWhere(this.groups, {id: accesspoint.groupId}) != 'undefined') {
			var group = {
					id: accesspoint.groupId,
					lat: accesspoint.lat,
					lng: accesspoint.lng
				};
			this.groups.push(group);
		}

		var polygon = new google.maps.Polygon({
			paths: this.getPolygonPoints(accesspoint),
			strokeColor: accesspoint.color,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: accesspoint.color,
			fillOpacity: 0.35,
			properties: accesspoint
		});

		polygon.setMap(this.map);
		this.polygons.push(polygon);
console.log(polygon);
		if (typeof ap.events != "undefined") {
			_.each(ap.events, function (callback, on) {
				google.maps.event.addListener(polygon, on, callback);
			});
		}
	},

	updateAccessPoint: function (ap) {
		console.log('updateAccessPoint called');

		this.checkAccessPoint(ap.options, 'id');
		this.checkAccessPoint(ap.options, 'groupId');

		var updated_accesspoint = _.pick(ap.options, 'id', 'groupId', 'name', 'lat', 'lng', 'azimuth', 'beamwidth', 'distance', 'frequency', 'color');
		var accesspoint = _.findWhere(this.accesspoints, {id: updated_accesspoint.id, groupId: updated_accesspoint.groupId});

		if (
			accesspoint.lat != updated_accesspoint.lat ||
			accesspoint.lng != updated_accesspoint.lng ||
			accesspoint.azimuth != updated_accesspoint.azimuth ||
			accesspoint.beamwidth != updated_accesspoint.beamwidth ||
			accesspoint.distance != updated_accesspoint.distance ||
			accesspoint.color != updated_accesspoint.color
		) {
			_.extend(accesspoint, updated_accesspoint);
			var polygon = _.filter(this.polygons, function (polygon) {
											if (polygon.properties.id === accesspoint.id && polygon.properties.groupId === accesspoint.groupId) {
												return true;
											}
									});
			polygon = _.first(polygon);
			//_.findWhere(this.polygons, {'properties.id': accesspoint.id, 'properties.groupId': accesspoint.groupId});
			console.log(polygon);

			polygon.setOptions({
					paths: this.getPolygonPoints(accesspoint),
					strokeColor: accesspoint.color,
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: accesspoint.color,
					fillOpacity: 0.35,
					properties: accesspoint
			});
			_.extend(
						_.filter(this.polygons, function (p) {
									if (p.properties.id === accesspoint.id && p.properties.groupId === accesspoint.groupId) {
										return true;
									}
							}
						), polygon);
		}
	},

	removeAccessPoint: function (ap) {

	},

	getPolygonPoints: function (ap) {
		//Computing polygon points
		var polygonPoints = new Array();

		var latLng = new google.maps.LatLng(ap.lat, ap.lng);
		polygonPoints.push(latLng);

		var ll = new LatLon(ap.lat, ap.lng);//geodesy
		var l ='';
		var tmpLatLng = '';

		var start = ap.azimuth - (ap.beamwidth/2);
		var end = Number(ap.azimuth) + (Number(ap.beamwidth)/2);

		for (var i=start;i<=end;i++) {
			l = ll.rhumbDestinationPoint(i, ap.distance);
			tmpLatLng = new google.maps.LatLng(l.lat, l.lon);
			polygonPoints.push(tmpLatLng);
		}

		polygonPoints.push(latLng);
		return polygonPoints;
	}
}