import Animation from './animation'

let animation = new Animation({
  'node': '#main',
  'to': {
    'margin': '30px'
  },
  'fps': 60
})

let $button = document.querySelectorAll('#action')[0]

$button.onclick = () => {
  console.log('Click event fired')
  animation.run(300)
}
