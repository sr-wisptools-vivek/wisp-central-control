ManagedRouter = {
  last_clicked: 0,
  toggle_overlay: function(id) {
    this.last_clicked = id;
    el = document.getElementById("overlay_" + id);
    el.style.display = (el.style.display == "block") ? "none" : "block";
    el = document.getElementById("overlay_fade");
    el.style.display = (el.style.display == "block") ? "none" : "block";
  },
  toggle_last: function() {
    this.toggle_overlay(this.last_clicked);
  }
}
