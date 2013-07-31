var wd = require("wd")
  , assert = require("assert")
  , _ = require("underscore")._;

var config = {
        host: "sebastian.dev.saucelabs.com" // change to localhost for local selenium server set up
      , port: 4444 // change to 4444 for local selenium server set up
      , build: "This_is_my_build"
      , username: "admin" // you can replace this with your sauce username (not require for local selenium server)
      , accessKey: "0e779f56-385a-41be-a562-6f6908bf5acf" // you can replace this with your sauce access key (not require for local selenium server)
      , caps: [
        { browserName: "safari", version: "5", platform: "OS X 10.6", proxy: { proxyType: "direct" } } // if firefox is not working try blank version number
        // , { browserName: "chrome", version: "", platform: "VISTA", proxy: { proxyType: "direct" } }
        // , {browserName: "ipad", version: '', platform: "Mac 10.6", deviceOrientation: "landscape", proxy: {proxyType: 'direct'}}
      ]
    };

(function() {
  var wdi = wd.remote(config.host, config.port, config.username, config.accessKey);

  // Will be called once per browser by the loop far below
  var test = function(driver, cap, callback) {
    cap.name = "I am a large guinea pig using a " + cap.browserName;
    driver.init(cap, function() {
      login(driver, function() {
        post(driver, function() {
          driver.quit(function() {});
        });
      });
    });
  };

  // Test script to fill out and post form
  var post = function(driver, callback) {
    var TITLE = "Guinea pigs are fun";
    driver.get("http://tutorialapp.saucelabs.com/idea_add", function() {
      driver.elementByName("title", function(err, _title) {
        _title.type(TITLE, function() {
          driver.elementByName("tags", function(err, _tags) {
            _tags.type("automated testing", function() {
              driver.elementByName("text", function(err, _text) {
                _text.type("We should have more guinea pigs everywhere. They are fun and love writing automated tests!", function() {
                  driver.elementByName("form.submitted", function(err, _submit) {
                    _submit.click(function() {
                      driver.elementByCss("div#sections h1", function(err, _h1) {
                        _h1.text(function(err, _text) {
                          assert.equal(_text, TITLE);
                          callback();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  // Test script to login to test web application
  var login = function(driver, callback) {
    driver.get("http://tutorialapp.saucelabs.com/", function() {
      driver.elementByName("login", function(err, _login) {
        _login.type("guineapiggy", function() {
          driver.elementByName("password", function(err, _password) {
            _password.type("guineapiggy", function() {
              driver.elementByName("submit", function(err, _submit) {
                _submit.click(function(err) {
                  driver.elementById("message", function(err, _message) {
                    _message.text(function(err, _text) {
                      assert.equal(_text, "Logged in successfully.");
                      driver.waitForElementByLinkText("What's your idea?", 10, function(err) {
                        assert.equal(err, null);
                        callback();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  _.each(config.caps, function(cap) {
    test(wdi, cap, function() {});
  });
})();
