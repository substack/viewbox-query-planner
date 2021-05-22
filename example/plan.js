var vplan = require('../')()
vplan.add([0.5,0.5,1.5,1.5])
vplan.add([0.2,-0.1,1.1,0.6])

var boxes = vplan.update([0,0,1,1])
console.log(boxes) // [ [ 0, 0, 0.2, 1 ], [ 0.2, 0.6, 0.5, 1 ] ]
