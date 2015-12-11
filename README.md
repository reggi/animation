# miyazaki

# Install

npm install miyazaki

# Usage

With `NPM`

```js
import Animation from 'miyazaki'

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
```

With inline `<script>`

```html
<script src="./node_modules/miyazaki/dist/bundle.js"></script>
```
