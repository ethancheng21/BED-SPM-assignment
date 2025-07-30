
/* global L */
L.Polyline.include({
  _snakeLatLngs: [],
  _snakingLayers: [],
  _snaking: false,
  _snakeIdx: 0,
  _snakeProgress: 0,
  _snakeTimer: 0,

  snakeIn: function () {
    if (this._snaking) return;
    this._snaking = true;

    if (!this._map) return;

    this._snakeLatLngs = this._latlngs;
    if (this._snakeLatLngs.length === 0) return;

    this._snakeIdx = 0;
    this._snakeProgress = 0;

    this._latlngs = [this._snakeLatLngs[0]];
    this.setLatLngs(this._latlngs);
    this._update();

    this._snakeTimer = setInterval(this._snakeForward.bind(this), 50);

    return this.fire('snakestart');
  },

  _snakeForward: function () {
    if (this._snakeIdx >= this._snakeLatLngs.length - 1) {
      clearInterval(this._snakeTimer);
      this._snaking = false;
      this.setLatLngs(this._snakeLatLngs);
      this.redraw();
      return this.fire('snakeend');
    }

    var current = this._snakeLatLngs[this._snakeIdx];
    var next = this._snakeLatLngs[this._snakeIdx + 1];

    var dist = current.distanceTo(next);
    var step = dist / 10;

    this._snakeProgress += step;

    if (this._snakeProgress >= dist) {
      this._snakeIdx++;
      this._latlngs.push(next);
      this.setLatLngs(this._latlngs);
      this.redraw();
      this._snakeProgress = 0;
    } else {
      var heading = current.bearingTo(next);
      var newPoint = current.destinationPoint(this._snakeProgress, heading);
      this._latlngs[this._latlngs.length - 1] = newPoint;
      this.setLatLngs(this._latlngs);
      this.redraw();
    }

    this._update();
  }
});

L.LatLng.prototype.destinationPoint = function (distance, heading) {
  heading = heading * Math.PI / 180;
  var radius = 6378137;

  var δ = distance / radius;
  var θ = heading;

  var φ1 = this.lat * Math.PI / 180;
  var λ1 = this.lng * Math.PI / 180;

  var φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) +
                     Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));

  var λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
                           Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

  return new L.LatLng(φ2 * 180 / Math.PI, λ2 * 180 / Math.PI);
};

L.LatLng.prototype.bearingTo = function (other) {
  var φ1 = this.lat * Math.PI / 180;
  var φ2 = other.lat * Math.PI / 180;
  var Δλ = (other.lng - this.lng) * Math.PI / 180;

  var y = Math.sin(Δλ) * Math.cos(φ2);
  var x = Math.cos(φ1) * Math.sin(φ2) -
          Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  var θ = Math.atan2(y, x);

  return (θ * 180 / Math.PI + 360) % 360;
};
