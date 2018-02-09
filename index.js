const { send, json } = require('micro')
const { ClientRequest, ServerResponse } = require('http')

const request = (req, body) => Object.assign(
  Object.create(ClientRequest.prototype),
  req,
  {
    body,
    get (name) {
      const headersName = name.toLowerCase()
      if (['referer', 'refferer'].includes(headersName))
        return this.headers.referrer || this.headers.referer
      return this.headers[headersName]
    }
  }
)

const response = res => Object.assign(
  Object.create(ServerResponse.prototype),
  res,
  {
    status (code) {
      this.statusCode = code
      return this
    },
    send (body) {
      send(this, this.statusCode, body)
    },
    get (field) {
      return this.getHeader(field)
    },
    set (field, val) {
      if (arguments.length === 2) {
        const value = Array.isArray(val)
          ? val.map(String)
          : String(val)
        this.setHeader(field, value)
      } else {
        for (let key in field) {
          this.set(key, field[key])
        }
      }
      return this;
    },
    append (field, val) {
      const prev = this.get(field)
      let value = val
      if (prev) 
        value = Array.isArray(prev) 
          ? prev.concat(val)
          : Array.isArray(val) 
            ? [prev].concat(val)
            : [prev, val]
      return this.set(field, value)
    }
  }
)

const assist = handler => async (req, res, ...restArgs) => {
  const body = await json(req)
  const _req = request(req, body)
  const _res = response(res)
  return handler(_req, _res, ...restArgs)
}

module.exports = assist
