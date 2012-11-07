var wd = require("wd")
  , assert = require("assert")
  , _ = require("underscore")._;

var config = {
        host: "ondemand.saucelabs.com"
      , port: 80
      , username: process.env.SAUCE_USERNAME
      , accessKey: process.env.SAUCE_ACCESS_KEY
      , caps: [
          { browserName: "firefox", version: "14", platform: "linux", proxy: { proxyType: "direct" } }
        //, { browserName: "chrome", version: "", platform: "VISTA", proxy: { proxyType: "direct" } }
      ]
    };

(function() {
  var wdi = wd.remote(config.host, config.port, config.username, config.accessKey);

  var test = function(driver, cap, callback) {
    cap.name = "I am a large guinea pig";
    driver.init(cap, function() {
      driver.get("https://saucelabs.com/test/guinea-pig", function() {
        driver.elementByName("comments", function(err, elem) {
          driver.type(elem, "Guinea pigs love to write automated tests.", function() {
            driver.quit(function() {
              callback();
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
