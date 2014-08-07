var m = require('mithril');
var _ = require('lodash');
var GoogleAPI = require('gapi');

var login = {
  state: function() {
    this.loggedIn = m.prop(false);
  },
  controller: function() {
    this.state = new login.state();

    this.GAPI = new GoogleAPI(function(authResult) {
      this.state.loggedIn(!!(authResult && !authResult.error));
      m.route('/inbox');
    }.bind(this));

    this.login = function(e) {
      e.preventDefault();
      this.GAPI.loginClick();
    }.bind(this);

  },
  view: function(ctrl) {
    return m(".login", [
      m('form', { onsubmit: ctrl.login }, [
        m('button', 'Login')
      ])
    ]);
  }
};

var inbox = {
  user: function() {
    this.name = m.prop('');
    this.image = m.prop('');
    this.threads = m.prop([]);
  },
  controller: function() {
    this.user = new inbox.user();

    gapi.client.plus.people.get({ 'userId': 'me' }).execute(function(resp) {
      this.user.image(resp.image.url);
      this.user.name(resp.displayName);
      m.redraw();
    }.bind(this));

    gapi.client.gmail.users.threads.list({ 'userId': 'me', 'labelIds': ['INBOX'], 'q': '-in:chats' }).execute(function(resp) {
      resp.threads.map(function(thread) {
        gapi.client.gmail.users.threads.get({ 'userId': 'me', 'id': thread.id }).execute(function(thread) {
          gapi.client.gmail.users.messages.get({ 'userId': 'me', 'id': thread.messages[0].id }).execute(function(message) {
            this.user.threads().push(_.extend(thread, {
              newestMessage: message
            }));
            m.redraw();
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));

  },
  view: function(ctrl) {
    return m(".app", [
      m('.user', [
        m('.user__name', ctrl.user.name()),
        m('img.user__image', { src: ctrl.user.image() })
      ]),
      m('ul.threads', ctrl.user.threads().map(function(thread) {
        
        var subjectHeader = _.find(thread.newestMessage.payload.headers, function(header) { return header.name == "Subject"; });

        return m("li", { onclick: function() {
          return m.route('/inbox/' + thread.id);
        } }, ((subjectHeader && subjectHeader.value) || thread.messages[0].snippet) + '[' + thread.messages.length + ']');
      }))
    ]);
  }
};

var thread = {
  thread: function() {
    this.messages = m.prop([]);
  },
  controller: function() {
    this.thread = new thread.thread();
    gapi.client.gmail.users.threads.get({ 'userId': 'me', 'id': m.route.param('id') }).execute(function(resp) {
      this.thread.messages(resp.messages);
      m.redraw();
    }.bind(this));
  },
  view: function(ctrl) {
    return m('ul.threads', ctrl.thread.messages().map(function(message) {
      console.log(message);
      return m("li", message.snippet);
    }));
  }
};

m.route(document.getElementById("app"), "/", {
    "/": login,
    "/inbox": inbox,
    "/inbox/:id": thread
});
