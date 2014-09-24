/**
 * @const
 * @type {Number}
 */
L.Circle.SECTIONS_COUNT = 64;

/**
 * Static
 * @param  {L.Circle} circle
 * @param  {Number?}  vertices
 * @param  {L.Map?}   map
 * @return {Array.<L.LatLng>}
 */
L.Circle.toPolygon = function(circle, vertices, map) {
    map = map || circle._map;
    if (!map) {
        throw Error("Can't figure out points without adding the feature to the map");
    }

    var points = [],
        crs = map.options.crs,
        DOUBLE_PI = Math.PI * 2,
        angle = 0.0,
        projectedCentroid, radius,
        point, project, unproject;

    if (crs === L.CRS.EPSG3857) {
        project = map.latLngToLayerPoint.bind(map);
        unproject = map.layerPointToLatLng.bind(map);
        radius = circle._radius;
    } else { // especially if we are using Proj4Leaflet
        project = crs.projection.project.bind(crs.projection);
        unproject = crs.projection.unproject.bind(crs.projection);
        radius = circle._mRadius;
    }

    projectedCentroid = project(circle._latlng)

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

/**
 * As a method
 * @param  {Number?} vertices
 * @param  {L.Map?}  map
 * @return {Array.<L.LatLng>}
 */
L.Circle.prototype.toPolygon = function(vertices, map) {
    return L.Circle.toPolygon(this, vertices, map || this._map);
};
