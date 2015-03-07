mapControl = {

  // google markers objects
  markers: [],

  // google lat lng objects
  latLngs: [],

  // our formatted marker data objects
  markerData: [],

  // add a marker given our formatted marker data object
  addMarker: function(marker) {
    var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
    var gMarker = new google.maps.Marker({
      position: gLatLng,
      map: GoogleMaps.maps.towerMap.instance,
      title: marker.title,
      // animation: google.maps.Animation.DROP,
      icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    this.latLngs.push(gLatLng);
    this.markers.push(gMarker);
    this.markerData.push(marker);
    return gMarker;
  },

  // calculate and move the bound box based on our markers
  calcBounds: function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
      bounds.extend(this.latLngs[i]);
    }
    GoogleMaps.maps.towerMap.instance.fitBounds(bounds);
  },

  // check if a marker already exists
  markerExists: function(key, val) {
    _.each(this.markers, function(storedMarker) {
      if (storedMarker[key] == val)
        return true;
    });
    return false;
  }
};