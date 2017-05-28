import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

function getSuggestionValue(suggestion) {
  return suggestion.properties.label;
}

function renderSuggestion(suggestion) {
  return (
    <div><i className="fa fa-map-marker" aria-hidden="true" /><span>{suggestion.properties.label}</span></div>
  );
}

function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}

class MapzenGeocoder extends React.Component {
  getInitialState() {
    return {
      value: '',
      suggestions: [],
    };
  }

  onSuggestionsFetchRequested({ value }) {
    const self = this;

    const apiCall = `https://search.mapzen.com/v1/autocomplete?text=${value}&boundary.rect.min_lon=${this.props.bounds.minLon}&boundary.rect.max_lon=${this.props.bounds.maxLon}&boundary.rect.min_lat=${this.props.bounds.minLat}&boundary.rect.max_lat=${this.props.bounds.maxLat}&api_key=${this.props.mapzen_api_key}`;

    $.getJSON(apiCall, (data) => { // eslint-disable-line no-undef
      self.setState({
        suggestions: data.features,
      });
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  onChange(e, obj) {
    this.setState({
      value: obj.newValue,
    });
  }

  onSuggestionSelected(e, o) {
    this.setState({
      value: o.suggestionValue,
    });

    this.props.onSelection(o.suggestion);
  }

  render() {
    const inputProps = {
      placeholder: 'Search for an address',
      value: this.state.value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}

MapzenGeocoder.propTypes = {
  bounds: PropTypes.object,
  mapzen_api_key: PropTypes.string,
  onSelection: PropTypes.func,
};

module.exports = MapzenGeocoder;
