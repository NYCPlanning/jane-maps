(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'react', 'material-ui/Toolbar', 'material-ui/FontIcon', 'material-ui/IconButton', 'react-autosuggest'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('react'), require('material-ui/Toolbar'), require('material-ui/FontIcon'), require('material-ui/IconButton'), require('react-autosuggest'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.react, global.Toolbar, global.FontIcon, global.IconButton, global.reactAutosuggest);
    global.Search = mod.exports;
  }
})(this, function (module, _react, _Toolbar, _FontIcon, _IconButton, _reactAutosuggest) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _FontIcon2 = _interopRequireDefault(_FontIcon);

  var _IconButton2 = _interopRequireDefault(_IconButton);

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

  var Search = _react2.default.createClass({
    displayName: 'Search',

    propTypes: {
      bounds: _react2.default.PropTypes.object,
      mapzen_api_key: _react2.default.PropTypes.string,
      onGeocoderSelection: _react2.default.PropTypes.func,
      onClear: _react2.default.PropTypes.func,
      selectionActive: _react2.default.PropTypes.bool
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

      var apiCall = 'https://search.mapzen.com/v1/autocomplete?text=' + value;

      if (this.props.bounds) {
        apiCall += '&boundary.rect.min_lon=' + this.props.bounds.minLon + '&boundary.rect.max_lon=' + this.props.bounds.maxLon + '&boundary.rect.min_lat=' + this.props.bounds.minLat + '&boundary.rect.max_lat=' + this.props.bounds.maxLat;
      }

      apiCall += '&api_key=' + this.props.mapzen_api_key;

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

      // pass up to Jane to create/update PoiMarker
      this.props.onGeocoderSelection(o.suggestion, o.suggestion.properties.name);
    },
    clearInput: function clearInput() {
      // tell Jane to hide PoiMarker
      this.props.onClear();

      // set the input field to ''
      this.setState({
        value: ''
      });
    },
    render: function render() {
      var inputProps = {
        placeholder: 'Search for an address',
        value: this.state.value,
        onChange: this.onChange
      };

      return _react2.default.createElement(
        'div',
        {
          className: 'mui-toolbar-container search-filter-toolbar'
        },
        _react2.default.createElement(
          _Toolbar.Toolbar,
          {
            className: 'mui-toolbar',
            noGutter: true,
            style: { /* Must be defined here to override material-ui inline styles*/
              backgroundColor: '#fff',
              height: '48px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)',
              borderRadius: '2px'
            }
          },
          _react2.default.createElement(
            _Toolbar.ToolbarGroup,
            null,
            _react2.default.createElement(_reactAutosuggest2.default, {
              suggestions: this.state.suggestions,
              onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
              onSuggestionsClearRequested: this.onSuggestionsClearRequested,
              getSuggestionValue: getSuggestionValue,
              renderSuggestion: renderSuggestion,
              shouldRenderSuggestions: shouldRenderSuggestions,
              inputProps: inputProps,
              onSuggestionSelected: this.onSuggestionSelected
            }),
            _react2.default.createElement(
              _IconButton2.default,
              null,
              this.props.selectionActive ? _react2.default.createElement(_FontIcon2.default, { className: 'fa fa-times', onClick: this.clearInput }) : _react2.default.createElement(_FontIcon2.default, { className: 'fa fa-search' })
            )
          )
        )
      );
    }
  });

  module.exports = Search;
});