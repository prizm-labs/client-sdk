Package = {foo:'bar'};
Package2 = {foo:'bar'};


Astral = {

  cachePrefix: "__astral__",

  store: function(){

  },

  init: function(options){
    this.restoreSession();

    // Store an object literal - store.js uses JSON.stringify under the hood
    store.set('user', { name: 'marcus', likes: 'javascript' })

    // Get the stored object - store.js uses JSON.parse under the hood
    var user = store.get('user')
    console.log(user.name + ' likes ' + user.likes)

    // Get all stored values
    store.getAll().user.name == 'marcus'

  },

  restoreSession: function(){
    // load all keys with library prefix


  },

  connect: function(host){
    try {
      if (typeof this.Server != "undefined") throw new Error('Server already connected');
      this.Server = new Server(host);
    } catch (e) {
      console.log(e.name);     // 'MyError'
      console.log(e.message);  // 'Default Message'
    }
    
  },

  // Subscribe to all nodes in session
  subscribe: function(){
    this.Server.subscribe('nodes');
  },

  // Bind reactive document to game node
  bind: function(documentId, node, changeHandler){

    var nodes = this.Server.getCollection("nodes");

    var documentQuery = tasks.reactiveQuery({id: documentId});
    // Log the array of results
    console.log(documentQuery.result);
    // Listen for changes
    documentQuery.on("change", function (id) {
      console.log(id, documentQuery.result);
      changeHandler(documentQuery.result);
    });
  },

  loginWithFacebook: function(){
    return this.Server.connection.loginWithFacebook();
  },

  loginWithGoogle: function(successHandler,errorHandler){
    var promise = this.Server.connection.loginWithGoogle();
    promise.then(
      function (result) {
        if (successHandler) successHandler(result);
      }, 
      function (reason) {
        if (errorHandler) errorHandler(reason);
      });
  }, 

  loginWithPassword: function(username,password,successHandler,errorHandler){
    var promise = this.Server.connection.loginWithPassword(username,password);
    promise.then(
      function (result) {
        if (successHandler) successHandler(result);
      }, 
      function (reason) {
        if (errorHandler) errorHandler(reason);
      });
  },

  onLogin: function(loginHandler) {
    if (typeof this.Server == "undefined") throw new Error('Server not connected');

    this.Server.connection.on("login",function(userId){
      loginHandler(userId);
    })
  },

  logout: function(){
    this.Server.connection.logout();
  }
};

function Server(host){
  // Connect to a Meteor backend
  this.connection = new Asteroid(host);

  // Use real-time collections
  this.collections = {};
  this.subscriptions = {};
  // tasks = ceres.getCollection("tasks");
  // subscription = ceres.subscribe("tasks");
}

Server.protoype = {
  subscribe: function(name){
    this.subscriptions[name] = this.connection.subscribe(name);
  },
  getCollection: function(name){
    this.collections[name] = this.connection.getCollection(name);
  }
};


User = {
  login: function(){

  }
};

// Log user in
// and save salted hash as cookie

// Request fullscreen