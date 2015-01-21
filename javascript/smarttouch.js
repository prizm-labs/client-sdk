

SmartTouch = function(id, x, y){

  this.id = id;
  this.x = x;
  this.y = y;
  this.clean = false;
  this.state = this.States.began;

  // this.identifier = identifier;
  // this.target = target;
  // this.clientX = pos.clientX + deltaX;
  // this.clientY = pos.clientY + deltaY;
  // this.screenX = pos.screenX + deltaX;
  // this.screenY = pos.screenY + deltaY;
  // this.pageX = pos.pageX + deltaX;
  // this.pageY = pos.pageY + deltaY;
};

SmartTouch.prototype = {

  States: {
    began: 0,
    moved: 1,
    fixed: 2,
    ended: 3
  }
};

SmartTouchClient = {

  delegate: null,
  buffer: "",
  touches: {},

  bindToServer: function(host,port) {
    var self = this;

    var net = new WebTCP('localhost', 9999)

    var socket = net.createSocket(host, port);

    // On connection callback
    socket.on('connect', function(){
      console.log('connected');
    })

    // This gets called every time new data for this socket is received
    socket.on('data', function(data) {
      console.log("received: " + data);

      self.parseData(data);
      self.fireEvents();
    });

    socket.on('end', function(data) {
      console.log("socket is closed ");
    });
  },

  touchesFromBuffer: function(data) {

    this.buffer += data;

    var endOfPacket = false;
    // indexOf test

    if (endOfPacket) {
      return JSON.parse(this.buffer);
    } else {
      return false;
    }
  },

  parseData: function(data) {

    // check for incomplete packet
    var touches = this.touchesFromBuffer(data);
    
    if (!touches) return;
    this.buffer = '';

    if (touches.length==0) {
      // all touches ended

      return;
    }

    _.each(touches, function(touch){
      
      // if id in touches, update touch
      if (_.contains(_.keys(this.touches),touch.id) {
        this.updateTouch(touch.id, touch.x, touch.y);
      // else new touch
      } else {
        this.touches[thouch.id] = new SmartTouch(touch.id, touch.x, touch.y);
      }

      // clean touches were not in packet, so they have ended
      _.each(this.touches, function(touch){
        
        if (touch.clean) {
          touch.state = touch.States.ended;
        }
      }, this);

    }, this);

  },

  updateTouch: function(id, x, y) {
    var touch = this.touches[id];

    if (touch.x!==x && touch.y!==y) {
      touch.x = x;
      touch.y = y;
      touch.state = touch.States.moved;
    } else {
      touch.state = touch.States.fixed;
    }

    touch.clean = false;
  },

  fireEvents: function(){
    _.each(this.touches, this.fireEvent, this);
  },

  fireEvent: function(touch){
    switch (touch.state) {
      case touch.States.began:
        this.delegate.windowEvent('touchesBegan',touch);
        this.delegate.event('touchesBegan',touch);
        touch.clean = true;
        break;
      case touch.States.moved:
        this.delegate.windowEvent('touchesMoved',touch);
        this.delegate.event('touchesMoved',touch);
        touch.clean = true;
        break;
      case touch.States.ended:
        this.delegate.windowEvent('touchesEnded',touch);
        this.delegate.event('touchesEnded',touch);
        this.touches = _.omit(this.touches, touch);
        break;
    }
  }
};

SmartTouchDelegate = {
  target: null,
  interactionManager: null,
  init: function(target, interactionManager){

    this.target = target;
    this.interactionManager = interactionManager;

    //target.view.addEventListener("touchstart", this.onTouchStart.bind(this), true);
    //target.view.addEventListener("touchend", this.onTouchEnd.bind(this), true);
    //target.view.addEventListener("touchmove", this.onTouchMove.bind(this), true);
  },

  // Emulate Touch Events into entire browser window

  windowEvent: function(state, touch) {
    if (this.interactionManager!=null) return;



  },

  // Emulate Touch Events into PixiJS view
  // http://hammerjs.github.io/touch-emulator/
  event: function(state, touch) {

    if (this.interactionManager==null) return;

    // wrap event as mobile touch event
    // http://www.goodboydigital.com/pixijs/docs/files/pixi_InteractionManager.js.html
    var event = {
      preventDefault: function(){},
      changedTouches: [
        {identifier: touch.id, clientX: touch.x, clientY: touch.y}
      ]
    };

    switch (state) {
      case touch.States.began:
        this.interactionManager.onTouchStart.apply(this.interactionManager,event);
        break;
      case touch.States.moved:
        this.interactionManager.onTouchMove.apply(this.interactionManager,event);
        break;
      case touch.States.ended:
        this.interactionManager.onTouchEnd.apply(this.interactionManager,event);
        break;
    }
    

  }
}
