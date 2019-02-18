import React, {Component} from 'react';
import "./SearchBar.css";


class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {searchText: ''};
  }

  // on every input change we store its value in state,
  handleChange = (e) => {
    this.setState({searchText: e.target.value});
    e.preventDefault();
  }

  // when user hits Enter - we run search
  handleEnter = (e) => {
    if (e.key === "Enter") {
        this.props.onSearch(this.state.searchText);
        e.preventDefault();
    }
  }

  // we do search only when user actually clicks Search button
  handleSearch = (e) => {
    this.props.onSearch(this.state.searchText);
    e.preventDefault();
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleChange}
          onKeyDown={this.handleEnter}/>

        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
