import assert from 'assert'
import fs from 'fs'
import {env} from 'jsdom'
import Promise from 'bluebird'

import {
  getDOMNode,
  getStyle,
  setStyle,
  setStyles,
  getCSSUnit,
  getCSSValue,
  getNumberOfFrames,
  getInterval,
  getIncrementStyles,
  getFrameStyles,
  getFromStyles
} from '../src/animation.js'

let jsdom = Promise.promisify(env)
let html = fs.readFileSync('./index.html', 'utf8')
let dom = jsdom(html)

/* global describe, it */

describe('getStyle', () => {
  it('should get the margin from the dom', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)
      let marginVal = getStyle($node, 'margin', window)
      assert.equal(marginVal, '10px')
    })
  })
})

describe('setStyle', () => {
  it('should get set margin from the dom', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)
      setStyle($node, 'margin', '30px')
      let marginVal = getStyle($node, 'margin', window)
      assert.equal(marginVal, '30px')
      // undo DOM manipulation
      setStyle($node, 'margin', '10px')
    })
  })
})

describe('setStyles', () => {
  it('should get set margin from the dom', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)
      setStyles($node, {
        'margin': '100px'
      })
      let marginVal = getStyle($node, 'margin', window)
      assert.equal(marginVal, '100px')
      // undo DOM manipulation
      setStyle($node, 'margin', '10px')
    })
  })
})

describe('getCSSUnit', () => {
  it('should get unit type', () => {
    assert.equal(getCSSUnit('64px'), 'px')
    assert.equal(getCSSUnit('32em'), 'em')
    assert.equal(getCSSUnit('5%'), '%')
    assert.equal(getCSSUnit('-5%'), '%')
    assert.equal(getCSSUnit('2.00009px'), 'px')
  })
})

describe('getCSSValue', () => {
  it('should get css intiger value from string', () => {
    assert.equal(getCSSValue('64px'), 64)
    assert.equal(getCSSValue('1002px'), 1002)
    assert.equal(getCSSValue('32em'), 32)
    assert.equal(getCSSValue('5%'), 5)
    assert.equal(getCSSValue('-5%'), -5)
    assert.equal(getCSSValue('2.00009px'), 2.00009)
  })
})

describe('getNumberOfFrames', () => {
  it('should get total number of frames', () => {
    assert.equal(getNumberOfFrames(2000, 2), 4)
  })
})

describe('getInterval', () => {
  it('should get interval between frames', () => {
    assert.equal(getInterval(2000, 4), 500)
  })
})

describe('getIncrementStyles', () => {
  it('should get increment style value for margin', () => {
    assert.deepEqual(getIncrementStyles({
      margin: '0px'
    }, {
      margin: '20px'
    }, 4), {
      margin: '5px'
    })

    assert.deepEqual(getIncrementStyles({
      margin: '10px'
    }, {
      margin: '30px'
    }, 9), {
      margin: ((Math.abs(10 - 30) / 9)) + 'px'
    })
  })
})

describe('getFrameStyles', () => {
  it('should get frame styles for opacity with 4 frames', () => {
    assert.deepEqual(getFrameStyles({
      margin: '10px'
    }, {
      margin: '30px'
    }, 9), [
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 1 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 2 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 3 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 4 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 5 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 6 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 7 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 8 + 'px'
      },
      {
        margin: 10 + ((Math.abs(10 - 30) / 9)) * 9 + 'px'
      }
    ])
  })

  it('should get frame styles for opacity with 4 frames', () => {
    assert.deepEqual(getFrameStyles({
      opacity: 0
    }, {
      opacity: 1
    }, 4), [
      {
        opacity: 0.25
      },
      {
        opacity: 0.5
      },
      {
        opacity: 0.75
      },
      {
        opacity: 1
      }
    ])
  })
  it('should get frame styles for opacity with 5 frames', () => {
    assert.deepEqual(getFrameStyles({
      opacity: 0
    }, {
      opacity: 1
    }, 5), [
      {
        opacity: 0.2
      },
      {
        opacity: 0.4
      },
      {
        opacity: 0.6000000000000001
      },
      {
        opacity: 0.8
      },
      {
        opacity: 1
      }
    ])
  })
  it('should get frame styles for margin with 4 frames', () => {
    assert.deepEqual(getFrameStyles({
      margin: '-20px'
    }, {
      margin: '40px'
    }, 4), [
      {
        margin: '-5px'
      },
      {
        margin: '10px'
      },
      {
        margin: '25px'
      },
      {
        margin: '40px'
      }
    ])
  })
})

describe('getFromStyles', () => {
  it('should return opacity set to 0', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)

      assert.deepEqual(getFromStyles($node, {
        margin: '10px'
      }, {
        opacity: 1
      }, window), {
        opacity: 0
      })
    })
  })

  it('should return opacity and margin', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)

      assert.deepEqual(getFromStyles($node, {
        margin: '10px'
      }, {
        opacity: 1,
        margin: '4px'
      }, window), {
        opacity: 0,
        margin: '10px'
      })
    })
  })

  it('should return margin set to 0px', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)

      assert.deepEqual(getFromStyles($node, {
        'opacity': 0
      }, {
        padding: '4px'
      }, window), {
        padding: '0px'
      })
    })
  })

  it('should return margin set from DOM', () => {
    return dom.then((window) => {
      let $node = getDOMNode('#main', window)

      assert.deepEqual(getFromStyles($node, {
        'opacity': 0
      }, {
        margin: '4px'
      }, window), {
        margin: '10px'
      })
    })
  })
})
