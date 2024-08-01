/**
 * Very Minimal (WIP) client-side javascript library to use Telemetry-sh.
 **/
(function() {
  var _props = typeof window === 'undefined' ? {} : window;

  if (!_props.TELEMENTRY_URL) _props.TELEMENTRY_URL = "https://api.telemetry.sh/log";
  if (!_props.TELEMETRY_USER_TABLE_NAME) _props.TELEMETRY_USER_TABLE_NAME = "users";
  var _TELEMETRY;

  function safestring(eventName) {
    return eventName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  _TELEMETRY = {
    init: function (props) {
      _props = Object.assign(_props, props);
    },
    track: function(eventName, eventProperties) {

      if (!_props.TELEMETRY_API_KEY) return console.error('TELEMETRY_API_KEY must be set.');
      var timestamp = new Date().toISOString();

      if (!eventProperties || typeof eventProperties !== 'object' || Array.isArray(eventProperties)) eventProperties = {};
      if (!eventProperties.userId && _props._userId) eventProperties.userId = _props._userId;
      if (!eventProperties.timestamp) eventProperties.timestamp = timestamp;

      var body = {
        table: safestring(eventName),
        data: eventProperties,
      };

      var headers = {
        "Content-Type": "application/json",
        "Authorization": _props.TELEMETRY_API_KEY
      };

      if (_props.TELEMETRY_LOGGING) {
        console.log('[Telemetry] POST URL: ', TELEMENTRY_URL);
        // console.log('[Telemetry] Event / Table Name: ', body.table);
        console.log('[Telemetry] BODY:', body);
      }

      fetch(TELEMENTRY_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then(data => {
          if (_props.TELEMETRY_LOGGING) console.log('[Telemetry] Success:', data)
        })
        .catch((error) => {
          if (_props.TELEMETRY_LOGGING) console.warn('[Telemetry] Error:', error)
        });

    },
    identify: function(userId, userProperties) {

      if (!_props.TELEMETRY_API_KEY) return console.error('TELEMETRY_API_KEY must be set.');
      var timestamp = new Date().toISOString();

      if (!userProperties || typeof userProperties !== 'object' || Array.isArray(userProperties)) userProperties = {};
      if (!userProperties.timestamp) userProperties.timestamp = timestamp;
      if (!userProperties.updated) userProperties.updated = timestamp;
      if (!userProperties.userId) userProperties.userId = userId;

      var body = {
        table: TELEMETRY_USER_TABLE_NAME,
        data: userProperties,
      };

      var headers = {
        "Content-Type": "application/json",
        "Authorization": _props.TELEMETRY_API_KEY
      };

      if (_props.TELEMETRY_LOGGING) {
        console.log('[Telemetry] POST URL: ', TELEMENTRY_URL);
        console.log('[Telemetry] BODY:', body);
      }

      fetch(TELEMENTRY_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then(data => {
          if (_props.TELEMETRY_LOGGING) console.log('[Telemetry] Success:', data)
        })
        .catch((error) => {
          if (_props.TELEMETRY_LOGGING) console.warn('[Telemetry] Error:', error)
        });

    },
    // Todo:
    // page: function(category, name, properties) { console.log('todo') },
    // alias: function(userId, previousId) { console.log('todo') },
    // group: function(groupId, traits) { console.log('todo') },
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { _TELEMETRY };
  }

  if (typeof window !== 'undefined') {
    window.TELEMETRY = _TELEMETRY;
    window.TELEMETRY_ENABLED = true;
  }

})();
