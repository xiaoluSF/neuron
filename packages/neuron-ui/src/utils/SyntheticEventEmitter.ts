class SyntheticEventEmitter {
  handlers: any[]

  constructor(...handlers: any[]) {
    this.handlers = handlers
  }

  send = (channel: string, ...args: any[]) => {
    this.handlers.forEach(handler => handler.send(channel, ...args))
  }

  sendSync = (channel: string, ...args: any[]) => {
    return this.handlers.map(handler => handler.sendSync && handler.sendSync(channel, ...args))
  }

  on = (channel: string, cb: Function) => {
    this.removeAllListeners(channel)
    return this.handlers.map(handler => {
      return handler.on(channel, cb)
    })
  }

  once = (channel: string, cb: Function) => {
    this.removeAllListeners(channel)
    return this.handlers.map(handler => {
      return handler.once(channel, cb)
    })
  }

  removeAllListeners = (channel: string) => {
    this.handlers.forEach(handler => {
      if ('removeAllListeners' in handler) {
        handler.removeAllListeners(channel)
      }
    })
  }

  addEventListener = (event: string, cb: EventListenerOrEventListenerObject) => {
    window.removeEventListener(event, cb)
    window.addEventListener(event, cb)
  }
}

export default SyntheticEventEmitter
