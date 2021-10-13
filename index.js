var rectDecomp = require('rectangle-decomposition')
var pclip = require('polygon-clipping')

module.exports = Planner

function Planner() {
  if (!(this instanceof Planner)) return new Planner
  this.polygon = []
}

Planner.prototype.add = function(bbox) {
  var w = bbox[0], s = bbox[1], e = bbox[2], n = bbox[3]
  var bshape = [[[w,s],[w,n],[e,n],[e,s]]]
  if (this.polygon.length === 0) {
    this.polygon = bshape
  } else {
    this.polygon = pclip.union(this.polygon, bshape)
  }
}

Planner.prototype.subtract = function(bbox) {
  var w = bbox[0], s = bbox[1], e = bbox[2], n = bbox[3]
  if (this.polygon.length > 0) {
    this.polygon = pclip.difference([[[w,s],[w,n],[e,n],[e,s]]], this.polygon)
  }
}

Planner.prototype.update = function(bbox) {
  var w = bbox[0], s = bbox[1], e = bbox[2], n = bbox[3]
  if (this.polygon.length > 0) {
    var shapes = pclip.difference([[[w,s],[w,n],[e,n],[e,s]]], this.polygon)
    var rects = []
    for (var i = 0; i < shapes.length; i++) {
      rects = rects.concat(rectDecomp(shapes[i]).map(rectToBbox))
    }
    return rects
  } else {
    return [[w,s,e,n]]
  }
}

function rectToBbox(rect) {
  var xmin = rect[0][0], xmax = rect[0][0]
  var ymin = rect[0][1], ymax = rect[0][1]
  for (var i = 1; i < rect.length; i++) {
    xmin = Math.min(xmin, rect[i][0])
    ymin = Math.min(ymin, rect[i][1])
    xmax = Math.max(xmax, rect[i][0])
    ymax = Math.max(ymax, rect[i][1])
  }
  return [xmin,ymin,xmax,ymax]
}
