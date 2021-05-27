# viewbox-query-planner

calculate rectangular bbox regions to query as a viewbox pans across 2d data

If you have a spatial database, you can query rectangular regions by the bboxes emitted from the
`update()` function as a user pans a map. You'll also want to cull the results from old bboxes as
keeping old bboxes around that don't intersect the current viewbox slows down the polygon
operations.

In the future this module might use polygon clipping routines specific to rectilinear polygon
geometry, which might speed things up considerably.

# example

``` js
var vplan = require('viewbox-query-planner')()
vplan.add([0.5,0.5,1.5,1.5])
vplan.add([0.2,-0.1,1.1,0.6])

var boxes = vplan.update([0,0,1,1])
console.log(boxes) // [ [ 0, 0, 0.2, 1 ], [ 0.2, 0.6, 0.5, 1 ] ]
```

There is a more involed graphical demo in example/demo.js which you can view here:
https://substack.net/demo/viewbox-planner.html

# api

``` js
var viewboxQueryPlanner = require('viewbox-query-planner')
```

## var vplan = viewboxQueryPlanner()

Create a new viewbox query planner instance `vplan`.

The planner will maintain a rectilinear polygon that you can grow or shrink with bboxes.

Ususally you will want to `vplan.add()` the boxes you get back from `vplan.update()` and cull old
boxes that no longer intersect the viewbox.

## vplan.add(bbox)

Add a `bbox` of the form `[xmin,ymin,xmax,ymax]` to the rectilinear polygon.

## vplan.subtract(bbox)

Subtract a `bbox` of the form `[xmin,ymin,xmax,ymax]` from the rectilinear polygon.

## var boxes = vplan.update(viewbox)

Return an array of bboxes of the form `[xmin,ymin,xmax,ymax]` that completely cover without
overlapping the parts of the `viewbox` (of the form `[xmin,ymin,xmax,ymax]`) that are not covered by
the internal rectilinear polygon.

# install

```
npm install viewbox-query-planner
```

# license

bsd
