import React, {Component} from 'react';
import './Track.css';

class Track extends Component {

  constructor(props) {
    super(props);
    this.renderAction = this.renderAction.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.moveAction(this.props.track);
  }

  renderAction() {
      return (<a className="Track-action" onClick={this.handleClick}>
        {this.props.isRemoval ? "-" : "+"}
      </a>);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
