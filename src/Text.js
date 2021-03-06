import Element from './Element'

export default class extends Element {
  constructor (str, space) {
    super({
      'w:t': {
        '#': str || null,
        '@xml:space': space || 'preserve'
      }
    }, '["w:t"]')
  }

  getString () {
    return this.src['w:t']['#']
  }

  setString (str) {
    this.src['w:t']['#'] = str
  }

  getSpaceAttr () {
    return this.src['w:t']['@xml:space']
  }

  setSpaceAttr (value) {
    this.src['w:t']['@xml:space'] = value
  }
}
