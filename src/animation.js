export let getDOMNode = (selector, _window) => {
  _window = _window || window
  let $node = _window.document.querySelectorAll(selector)
  if ($node.length === 0) throw new Error(`missing DOM node ${selector}`)
  return $node[0]
}

export let getStyle = ($node, style, _window) => {
  _window = _window || window
  if ($node.currentStyle) {
    return $node.currentStyle[style]
  } else if (_window.getComputedStyle) {
    return _window.document.defaultView.getComputedStyle($node, null).getPropertyValue(style)
  }
}

export let setStyle = ($node, style, value) => {
  $node.style[style] = value
  return $node.style[style] === value
}

export let setStyles = ($node, styles) => {
  return Object.keys(styles).map((style) => {
    let value = styles[style]
    return setStyle($node, style, value)
  })
}

export let getCSSUnit = (value) => {
  if (typeof value !== 'string') return ''
  return value.replace(/\d|\-|\./g, '')
}

export let getCSSValue = (value) => {
  if (typeof value !== 'string') return value
  let unit = getCSSUnit(value)
  let strValue = value.replace(unit, '')
  return parseFloat(strValue, 10)
}

export let getNumberOfFrames = (duration, fps) => {
  return (duration / 1000) * fps
}

export let getInterval = (duration, numberOfFrames) => {
  return duration / numberOfFrames
}

export let getIncrementStyles = (fromStyles, toStyles, numberOfFrames) => {
  let increments = {}
  Object.keys(toStyles).forEach((style) => {
    let toStylesValue = toStyles[style]
    let fromStylesValue = fromStyles[style]
    let toUnit = getCSSUnit(toStylesValue)
    let fromUnit = getCSSUnit(fromStylesValue)
    if (toUnit !== fromUnit) throw Error(`incompatable units for ${style}: to uses '${toUnit}' and from uses '${fromUnit}''`)
    let toInt = getCSSValue(toStylesValue)
    let fromInt = getCSSValue(fromStylesValue)
    let distance = Math.abs(toInt - fromInt)
    let increment = distance / numberOfFrames
    if (toUnit !== '') {
      increments[style] = increment + toUnit
    } else {
      increments[style] = increment
    }
  })
  return increments
}

export let getNextFrame = (fromStyles, incrementStyles, frame) => {
  let nextFrame = {}
  Object.keys(fromStyles).forEach((style) => {
    let fromValue = fromStyles[style]
    let incrementValue = incrementStyles[style]
    let unit = getCSSUnit(fromValue)
    let fromInt = getCSSValue(fromValue)
    let incrementInt = getCSSValue(incrementValue)
    let instanceStyleValue = fromInt + (incrementInt * (frame))
    if (unit !== '') {
      instanceStyleValue = instanceStyleValue + unit
    }
    nextFrame[style] = instanceStyleValue
  })
  return nextFrame
}

export let getFrameStyles = (fromStyles, toStyles, numberOfFrames) => {
  let frameStyles = Array.from(new Array(Math.ceil(numberOfFrames)), (x, i) => i)
  let incrementStyles = getIncrementStyles(fromStyles, toStyles, numberOfFrames)
  return frameStyles.map((frame) => {
    frame = frame + 1
    return getNextFrame(fromStyles, incrementStyles, frame)
  })
}

export let getFromStyles = ($node, fromStyles, toStyles, _window) => {
  _window = _window || window
  let styles = {}
  Object.keys(toStyles).forEach((style) => {
    if (typeof fromStyles[style] !== 'undefined') {
      styles[style] = fromStyles[style]
    } else {
      let DOMStyle = getStyle($node, style, _window)
      if (DOMStyle !== '') {
        styles[style] = DOMStyle
      } else {
        let unit = getCSSUnit(toStyles[style])
        if (unit !== '') {
          styles[style] = 0 + unit
        } else {
          styles[style] = 0
        }
      }
    }
  })
  return styles
}

export let runAnimation = (nodeSelector, duration, rawFromStyles = {}, toStyles, fps, _window) => {
  if (!nodeSelector) throw new Error('missing node property')
  let $node = getDOMNode(nodeSelector, _window)
  let fromStyles = getFromStyles($node, rawFromStyles, toStyles, _window)
  let numberOfFrames = getNumberOfFrames(duration, fps  )
  let interval = getInterval(duration, numberOfFrames)
  let frameStyles = getFrameStyles(fromStyles, toStyles, numberOfFrames)
  let frame = 0
  let intervalEvent = setInterval(() => {
    setStyles($node, frameStyles[frame])
    console.log(frame)
    frame = frame + 1
    if (frameStyles.length <= frame) {
      clearInterval(intervalEvent)
    }
  }, interval)
}

export function Animation (obj, _window) {
  this.run = (duration) => {
    runAnimation(obj.node, duration, obj.from, obj.to, obj.fps || 30, _window)
    return this
  }
  return this
}

export default Animation
