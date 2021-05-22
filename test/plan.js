var planner = require('../')
var test = require('tape')

test('simple case', function (t) {
  var start = now()
  var p = planner()
  p.add([0.5,0.5,1.5,1.5])
  p.add([0.2,-0.1,1.1,0.6])
  var boxes = p.update([0,0,1,1])
  var elapsed = now() - start
  console.log(`elapsed: ${elapsed} ms`)
  t.deepEqual(boxes.sort(), [
    [ +0.0, +0.0, +0.2, +1.0 ],
    [ +0.2, +0.6, +0.5, +1.0 ],
  ])
  t.end()
})

test('case with updates', function (t) {
  var start = now()
  var p = planner()
  p.add([0.5,0.5,1.5,1.5])
  p.add([0.2,-0.1,1.1,0.6])
  var boxes = p.update([0,0,1,1])
  for (var i = 0; i < boxes.length; i++) {
    p.add(boxes[i])
  }
  var boxes = p.update([-0.3,-0.3,0.7,0.7])
  var elapsed = now() - start
  console.log(`elapsed: ${elapsed} ms`)
  t.deepEqual(boxes.sort(), [
    [ -0.3, -0.3, +0.0, +0.7 ],
    [ +0.0, -0.3, +0.2, +0.0 ],
    [ +0.2, -0.3, +0.7, -0.1 ],
  ])
  t.end()
})

function now() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now()
  } else {
    var time = process.hrtime()
    return (time[0] + time[1]/1e9)*1000
  }
}
