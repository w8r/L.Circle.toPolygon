/**
 * @const
 * @type {Number}
 */
L.Circle.SECTIONS_COUNT = 64;

/**
 * @param  {Number?} vertices
 * @return {Array.<L.LatLng>}
 */
L.Circle.prototype.toPolygon = function(vertices) {
    if (!this._map) {
        throw Error("Can't figure out points without adding the feature to the map");
    }

    var points = [],
        crs = this._map.options.crs,
        DOUBLE_PI = Math.PI * 2,
        angle = 0.0,
        projectedCentroid, radius,
        point, project, unproject;

    if (crs === L.CRS.EPSG3857) {
        project = this._map.latLngToLayerPoint.bind(this._map);
        unproject = this._map.layerPointToLatLng.bind(this._map);
        radius = this._radius;
    } else { // especially if we are using Proj4Leaflet
        project = crs.projection.project.bind(crs.projection);
        unproject = crs.projection.unproject.bind(crs.projection);
        radius = this._mRadius;
    }

    projectedCentroid = project(this._latlng)

    vertices = vertices || L.Circle.SECTIONS_COUNT;

    for (var i = 0; i < vertices; i++) {
        angle += (DOUBLE_PI / vertices);
        point = new L.Point(
            projectedCentroid.x + (radius * Math.cos(angle)),
            projectedCentroid.y + (radius * Math.sin(angle))
        );
        points.push(unproject(point));
    }

    return points;
};
