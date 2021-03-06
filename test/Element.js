import { assert } from 'chai'
import * as jsdocx from '../dist/jsdocx'

describe('#Element', () => {
  describe('#src', () => {
    it('should exist after creation', () => {
      let e = new jsdocx.Element()
      assert.equal(e.hasOwnProperty('src'), true)
      assert.equal(typeof e.src, 'object')
    })
    it('should contain given content tree', () => {
      let tree = {
        a: 'Foo',
        b: 'Bar'
      }
      let e = new jsdocx.Element(tree)
      assert.equal(e.hasOwnProperty('src'), true)
      assert.equal(e.src, tree)
    })
  })
  describe('#contents', () => {
    it('should exist after creation', () => {
      let e = new jsdocx.Element()
      assert.equal(e.hasOwnProperty('contents'), true)
      assert.equal(e.contents instanceof Array, true)
      assert.equal(e.contents.length, 0)
    })
    it('should add contents passed as argument', () => {
      let c = new jsdocx.Element('{ "bar" }')
      let e = new jsdocx.Element('{ "foo" }', '["foo"]', [c])
      assert.deepEqual(e.contents, [c])
    })
  })
  describe('#contentHook', () => {
    it('should exist after creation', () => {
      let e = new jsdocx.Element()
      assert.equal(e.hasOwnProperty('contentHook'), true)
      assert.equal(typeof e.contentHook, 'object')
    })
    it('should be "null" if not specified', () => {
      let e = new jsdocx.Element()
      assert.equal(e.contentHook, null)
    })
    it('should be equal to given value', () => {
      let e = new jsdocx.Element({ foo: 'bar' }, '.foo')
      assert.equal(e.contentHook, '.foo')
    })
    it('should throw a TypeError if invalid', () => {
      assert.throws(() => {
        new jsdocx.Element({}, 'a')
      }, TypeError)
    })
  })
  describe('#toJson', () => {
    it('should transfrom "src" in valid JSON syntax', () => {
      let src = {
        'a': 'Foo',
        b: 'Bar'
      }
      let e = new jsdocx.Element(src)
      assert.deepEqual(e.toJson(), {
        'a': 'Foo',
        'b': 'Bar'
      })
    })
    it('should ignore content if hook is null', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {}
      })
      let e = new jsdocx.Element({
        d: 1
      })
      p.contents.push(e)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {}
      })
    })
    it('should insert content at given hook', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {}
      }, '.c')
      let e = new jsdocx.Element({
        d: 1
      })
      p.contents.push(e)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          '#': [{
            'd': 1
          }]
        }
      })
    })
    it('should ignore contents when given hook is an array', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: []
      }, '.c')
      let e = new jsdocx.Element({
        d: 1
      })
      p.contents.push(e)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': []
      })
    })
    it('should append content at given complex hook', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          d: {
            e: {
            }
          }
        }
      }, '.c.d.e')
      let e = new jsdocx.Element({
        f: 1
      })
      p.contents.push(e)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd': {
            'e': {
              '#': [{
                'f': 1
              }]
            }
          }
        }
      })
    })
    it('should ignore contents when given complex hook is an array', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          d: {
            e: []
          }
        }
      }, '.c.d.e')
      let e = new jsdocx.Element({
        f: 1
      })
      p.contents.push(e)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd': {
            'e': []
          }
        }
      })
    })
    it('should insert more contents at given hook', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          d: {
            e: {
            }
          }
        }
      }, '.c.d.e')
      let e1 = new jsdocx.Element({
        f: 1
      })
      let e2 = new jsdocx.Element({
        'g': 2
      })
      p.contents.push(e1)
      p.contents.push(e2)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd': {
            'e': {
              '#': [{
                'f': 1
              }, {
                'g': 2
              }]
            }
          }
        }
      })
    })
    it('should ignore all contents at given hook when is an array', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          d: {
            e: []
          }
        }
      }, '.c.d.e')
      let e1 = new jsdocx.Element({
        f: 1
      })
      let e2 = new jsdocx.Element({
        'g': 2
      })
      p.contents.push(e1)
      p.contents.push(e2)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd': {
            'e': []
          }
        }
      })
    })
    it('should concatenate contents at given hook even if similar', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          d: {
          }
        }
      }, '.c.d')
      let e1 = new jsdocx.Element({
        e: {
          f: 1
        }
      })
      let e2 = new jsdocx.Element({
        'e': 2
      })
      p.contents.push(e1)
      p.contents.push(e2)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd': {
            '#': [{
              'e': {
                'f': 1
              }
            }, {
              'e': 2
            }]
          }
        }
      })
    })
    it('should insert contents at given hook when string keys are used', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
          'd.e': {
            'f': {}
          }
        }
      }, '.c["d.e"].f')
      let e1 = new jsdocx.Element({
        g: 1
      })
      let e2 = new jsdocx.Element({
        h: 2
      })
      p.contents.push(e1)
      p.contents.push(e2)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          'd.e': {
            'f': {
              '#': [{
                'g': 1
              }, {
                'h': 2
              }]
            }
          }
        }
      })
    })
    it('should keep original insertion order of contents', () => {
      let p = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {
        }
      }, '.c')
      let e1 = new jsdocx.Element({
        d: 1
      })
      let e2 = new jsdocx.Element({
        e: 2
      })
      let e3 = new jsdocx.Element({
        d: 1
      })
      p.contents.push(e1)
      p.contents.push(e2)
      p.contents.push(e3)
      assert.deepEqual(p.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          '#': [{
            'd': 1
          }, {
            'e': 2
          }, {
            'd': 1
          }]
        }
      })
    })
    it('should ignore invalid contents', () => {
      let e = new jsdocx.Element({
        'a': 'Foo',
        b: 'Bar',
        c: {}
      }, '.c')
      e.contents.push(null)
      e.contents.push(false)
      e.contents.push(true)
      assert.deepEqual(e.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {}
      })
    })
    it('should return a JSON repr of content tree', () => {
      let e = new jsdocx.Element({
        a: 'Foo',
        b: 'Bar',
        'c': [],
        d: 1
      })
      assert.deepEqual(e.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': [],
        'd': 1
      })
    })
    it('should call "finalize" before converting element to JSON', () => {
      let e = new jsdocx.Element({
        a: 'Foo',
        b: 'Bar',
        'c': {
          '#': [{
            d: 1
          }]
        },
        e: 2
      }, '.c')
      e.finalize = function (contents) {
        contents.push(new jsdocx.Element({
          f: 3
        }))
        contents.unshift(new jsdocx.Element({
          'g': 4
        }))
      }
      assert.deepEqual(e.toJson(), {
        'a': 'Foo',
        'b': 'Bar',
        'c': {
          '#': [{
            'd': 1
          }, {
            'g': 4
          }, {
            'f': 3
          }]
        },
        'e': 2
      })
      assert.equal(e.contents.length, 0)
    })
  })
  describe('#toXml', () => {
    it('should return a XML repr of content tree', () => {
      let e = new jsdocx.Element({
        a: {
          '@foo': 'bar',
          '#': 'Foo'
        },
        b: 'Bar',
        'c': {},
        d: 1
      })
      assert.equal(e.toXml(), '<a foo="bar">Foo</a><b>Bar</b><c></c><d>1</d>')
    })
    it('should return a XML repr of full content tree (with children)', () => {
      let p = new jsdocx.Element({
        a: {
          '@foo': 'bar',
          '#': 'Foo'
        },
        b: 'Bar',
        'c': {},
        d: 1
      }, '.c')
      let e = new jsdocx.Element({
        e: 2
      })
      p.contents.push(e)
      assert.equal(p.toXml(), '<a foo="bar">Foo</a><b>Bar</b><c><e>2</e></c><d>1</d>')
    })
  })
})
