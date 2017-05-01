(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'react', 'react-autosuggest'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('react'), require('react-autosuggest'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.react, global.reactAutosuggest);
    global.MapzenGeocoder = mod.exports;
  }
})(this, function (module, _react, _reactAutosuggest) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function getSuggestionValue(suggestion) {
    return suggestion.properties.label;
  }

  function renderSuggestion(suggestion) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('i', { className: 'fa fa-map-marker', 'aria-hidden': 'true' }),
      _react2.default.createElement(
        'span',
        null,
        suggestion.properties.label
      )
    );
  }

  function shouldRenderSuggestions(value) {
    return value.trim().length > 2;
  }

  var MapzenGeocoder = _react2.default.createClass({
    displayName: 'MapzenGeocoder',

    propTypes: {
      bounds: _react2.default.PropTypes.object,
      mapzen_api_key: _react2.default.PropTypes.string,
      onSelection: _react2.default.PropTypes.func
    },

    getInitialState: function getInitialState() {
      return {
        value: '',
        suggestions: []
      };
    },
    onSuggestionsFetchRequested: function onSuggestionsFetchRequested(_ref) {
      var value = _ref.value;

      var self = this;

      var apiCall = 'https://search.mapzen.com/v1/autocomplete?text=' + value + '&boundary.rect.min_lon=' + this.props.bounds.minLon + '&boundary.rect.max_lon=' + this.props.bounds.maxLon + '&boundary.rect.min_lat=' + this.props.bounds.minLat + '&boundary.rect.max_lat=' + this.props.bounds.maxLat + '&api_key=' + this.props.mapzen_api_key;

      $.getJSON(apiCall, function (data) {
        // eslint-disable-line no-undef
        self.setState({
          suggestions: data.features
        });
      });
    },
    onSuggestionsClearRequested: function onSuggestionsClearRequested() {
      this.setState({
        suggestions: []
      });
    },
    onChange: function onChange(e, obj) {
      this.setState({
        value: obj.newValue
      });
    },
    onSuggestionSelected: function onSuggestionSelected(e, o) {
      this.setState({
        value: o.suggestionValue
      });

      this.props.onSelection(o.suggestion);
    },
    render: function render() {
      var inputProps = {
        placeholder: 'Search for an address',
        value: this.state.value,
        onChange: this.onChange
      };

      return _react2.default.createElement(_reactAutosuggest2.default, {
        suggestions: this.state.suggestions,
        onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
        onSuggestionsClearRequested: this.onSuggestionsClearRequested,
        getSuggestionValue: getSuggestionValue,
        renderSuggestion: renderSuggestion,
        shouldRenderSuggestions: shouldRenderSuggestions,
        inputProps: inputProps,
        onSuggestionSelected: this.onSuggestionSelected
      });
    }
  });

  module.exports = MapzenGeocoder;
});