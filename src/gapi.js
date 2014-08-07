var GoogleAPI = function(handleAuthResult) {
  var _this = this;

  _this.apiKey = "AIzaSyArbc--v1Q8ba3HeDYNvRN3QEx7tmPlVR8";
  _this.clientId = '564869641094-hpifiolcp93ns42g0jsin7ba0n4a5d4f.apps.googleusercontent.com';
  _this.scopes = 'https://www.googleapis.com/auth/gmail.readonly';

  this.init = function() {
    gapi.client.setApiKey(_this.apiKey);
    gapi.client.load('plus', 'v1', function() {
      gapi.client.load('gmail', 'v1', function() {
        window.setTimeout(_this.authorize(true),1);
      });
    });
  };

  this.authorize = function(immediate) {
    gapi.auth.authorize({
      client_id: _this.clientId,
      scope: _this.scopes,
      immediate: immediate,
      approval_prompt: immediate ? '' : 'force',
      use_ssl: 1
    }, handleAuthResult);
  };

  this.loginClick = function() {
    _this.authorize(false);
  };

  

  window.handleGoogleClientLoad = _this.init;
};

module.exports = GoogleAPI;
