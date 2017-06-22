import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Autosuggest from 'react-autosuggest';
import _ from 'underscore';

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

class Search extends React.Component {

  static displayName = 'Search';

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) ||
           !_.isEqual(this.state, nextState);
  }

  onSuggestionsFetchRequested = ({ value }) => {
    let apiCall = `https://search.mapzen.com/v1/autocomplete?text=${value}`;

    if (this.props.bounds) {
      apiCall += `&boundary.rect.min_lon=${this.props.bounds.minLon}&boundary.rect.max_lon=${this.props.bounds.maxLon}&boundary.rect.min_lat=${this.props.bounds.minLat}&boundary.rect.max_lat=${this.props.bounds.maxLat}`;
    }

    apiCall += `&api_key=${this.props.mapzen_api_key}`;

    $.getJSON(apiCall, (data) => { // eslint-disable-line no-undef
      this.setState({
        suggestions: data.features,
      });
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  onChange = (e, obj) => {
    this.setState({
      value: obj.newValue,
    });
  }

  onSuggestionSelected = (e, o) => {
    this.setState({
      value: o.suggestionValue,
    });

    // pass up to Jane to create/update Marker
    this.props.onGeocoderSelection(o.suggestion, o.suggestion.properties.name);
  }

  clearInput= () => {
    // tell Jane to hide Marker
    this.props.onClear();

    // set the input field to ''
    this.setState({
      value: '',
    });
  }

  render() {
    const inputProps = {
      placeholder: 'Search for an address',
      value: this.state.value,
      onChange: this.onChange,
    };

    return (
      <div
        className={'mui-toolbar-container search-filter-toolbar'}
        style={{ left: this.props.leftOffset }}
      >
        <Toolbar
          className="mui-toolbar"
          noGutter
          style={{ /* Must be defined here to override material-ui inline styles*/
            backgroundColor: '#fff',
            height: '48px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)',
            borderRadius: '2px',
          }}
        >
          <ToolbarGroup>
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
            <IconButton>
              {this.props.selectionActive ?
                <FontIcon className={'fa fa-times'} onClick={this.clearInput} /> :
                <FontIcon className={'fa fa-search'} />
              }
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

Search.propTypes = {
  bounds: PropTypes.object,
  mapzen_api_key: PropTypes.string,
  onGeocoderSelection: PropTypes.func,
  onClear: PropTypes.func,
  selectionActive: PropTypes.bool,
  leftOffset: PropTypes.number,
};

module.exports = Search;
