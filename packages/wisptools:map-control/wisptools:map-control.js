MapControl = {
	// map object
	map: {},
	
	// google markers objects
	markers: [],
	
	// google lat lng objects
	latLngs: [],
	
	// our formatted marker data objects
	markerData: [],
	
	// tower ids to track removed towers
	towerIds: [],

	// add a marker given our formatted marker data object
	addMarker: function(marker, markerMap) {
		var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
		_.extend(gLatLng, {id: marker.id});

		var markerOptions = {
			position: gLatLng,
			map: this.map,
			title: marker.title,
			// animation: google.maps.Animation.DROP,
			icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		};
		if (typeof markerMap != "undefined" && typeof markerMap.markerOptions != "undefined") {
			_.extend(markerOptions, markerMap.markerOptions)
		}
		var gMarker = new google.maps.Marker(markerOptions);

		if (typeof markerMap != "undefined" && typeof markerMap.events != "undefined") {
			_.each(markerMap.events, function (callback, on) {
				google.maps.event.addListener(gMarker, on, callback);
			});
		}

		_.extend(gMarker, {id: marker.id});

		this.latLngs.push(gLatLng);
		this.markers.push(gMarker);
		this.markerData.push(marker);
		this.towerIds.push(marker.id);

		return gMarker;
	},

	//update marker
	updateMarker: function(marker, markerMap) {
		var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
		_.extend(gLatLng, {id: marker.id});

		var markerOps = {
			position: gLatLng,
			title: marker.title,
		};
		if (typeof markerMap != "undefined" && typeof markerMap.markerOptions != "undefined") {
			_.extend(markerOps, markerMap.markerOptions);
		}
		_.findWhere(this.markers, {id: marker.id}).setOptions(markerOps);

		if (typeof markerMap != "undefined" && typeof markerMap.events != "undefined") {
			_.each(markerMap.events, function (callback, on) {
				google.maps.event.addListener(gMarker, on, callback);
			});
		}

		_.extend(_.findWhere(this.latLngs, {id: marker.id}), gLatLng);
		_.extend(_.findWhere(this.markerData, {id: marker.id}), marker);

		return _.findWhere(this.markers, {id: marker.id});
	},

	//remove marker
	removeMarker: function(marker) {
		_.findWhere(this.markers, {id: marker.id}).setMap(null);
		this.latLngs =_.reject(this.latLngs, function (obj) {
			return obj.id == marker.id;
		});
		this.markers =_.reject(this.markers, function (obj) {
			return obj.id == marker.id;
		});
		this.markerData =_.reject(this.markerData, function (obj) {
			return obj.id == marker.id;
		});
		this.towerIds = _.difference(this.towerIds, [marker.id]);
	},

	// calculate and move the bound box based on our markers
	calcBounds: function() {
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
			bounds.extend(this.latLngs[i]);
		}
		this.map.fitBounds(bounds);
	},

	// check if a marker already exists
	markerExists: function(key, val) {
		var c = {};
		c[key] = val;
		return typeof _.findWhere(this.markerData, c) != "undefined";
	}
};