var planner = require('../')
var plan = planner()

var html = require('choo/html')
document.body.appendChild(html`<div
  style="position: absolute; z-index: 1001; left: 15px; bottom: 15px;">
  <button style="background-color: transparent; border: 1px solid white; color: white;
    padding: 1ex; padding-left: 2ex; padding-right: 2ex;"
    onclick=${clear}>clear</button>
</div>`)

var regl = require('regl')()
var draw = {
  lines: lines(regl)
}
var props = {
  lines: {
    positions: [],
    colors: [],
  },
}
var state = {
  view: {
    size: [ 0.3, 0.3 ],
    center: [ 0.0, 0.0 ],
    box: [ 0.0, 0.0, 0.0, 0.0 ],
  },
}
updateView()
pushLines(bboxToLines(state.view.box), [0.5,0.5,1])
frame()

function updateView() {
  state.view.box[0] = state.view.center[0] - state.view.size[0]/2
  state.view.box[1] = state.view.center[1] - state.view.size[1]/2
  state.view.box[2] = state.view.center[0] + state.view.size[0]/2
  state.view.box[3] = state.view.center[1] + state.view.size[1]/2
}
function clear() {
  props.lines.positions = []
  props.lines.colors = []
  updateView()
  pushLines(bboxToLines(state.view.box), [0.5,0.5,1])
  plan = planner()
  frame()
}
function calculate() {
  var boxes = plan.update(state.view.box)
  for (var i = 0; i < boxes.length; i++) {
    pushLines(bboxToLines(boxes[i]), [1.0,0.5,0.5])
    plan.add(boxes[i])
  }
}

window.addEventListener('resize', frame)
window.addEventListener('mousedown', (ev) => {
  if (ev.target.tagName.toUpperCase() !== 'CANVAS') return
  var x = ev.offsetX/window.innerWidth*2-1
  var y = 1-ev.offsetY/window.innerHeight*2
  state.view.center[0] = x
  state.view.center[1] = y
  state.mousedown = true
  updateView()
  setViewbox(state.view.box)
  frame()
})
window.addEventListener('mousemove', (ev) => {
  if (ev.target.tagName.toUpperCase() !== 'CANVAS') return
  if (!(ev.buttons & 1)) return
  var dx = ev.movementX/window.innerWidth*2
  var dy = ev.movementY/window.innerHeight*2
  state.view.center[0] += dx
  state.view.center[1] -= dy
  updateView()
  setViewbox(state.view.box)
  frame()
})
window.addEventListener('mouseup', (ev) => {
  if (ev.target.tagName.toUpperCase() !== 'CANVAS') return
  calculate()
  state.view.center[0] = 10
  state.view.center[1] = 10
  updateView()
  setViewbox(state.view.box)
  frame()
})

function setViewbox(bbox) {
  var positions = bboxToLines(bbox)
  for (var i = 0; i < positions.length; i++) {
    props.lines.positions[i] = positions[i]
  }
}

function frame() {
  regl.poll()
  regl.clear({ color: [0,0,0,1], depth: true })
  draw.lines(props.lines)
}

function pushLines(positions, color) {
  for (var i = 0; i < positions.length; i+=2) {
    props.lines.colors.push(color)
  }
  props.lines.positions = props.lines.positions.concat(positions)
}

function bboxToLines(bbox) {
  var w = bbox[0], s = bbox[1], e = bbox[2], n = bbox[3]
  return [w,s, w,n, w,n, e,n, e,n, e,s, e,s, w,s]
}

function lines(regl) {
  return regl({
    frag: `
      precision highp float;
      varying vec3 vcolor;
      void main() {
        gl_FragColor = vec4(vcolor,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec3 color;
      varying vec3 vcolor;
      void main() {
        vcolor = color;
        gl_Position = vec4(position,0,1);
      }
    `,
    attributes: {
      position: regl.prop('positions'),
      color: regl.prop('colors'),
    },
    primitive: 'lines',
    count: (context, props) => props.positions.length/2,
  })
}
