import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { Row, Col } from "../Grid";
import More from "material-ui/svg-icons/navigation/expand-more";
import Less from "material-ui/svg-icons/navigation/expand-less";
import "./CardDetails.sass";

class CardDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      showFullDescription: false
    };
  }

  handleFullDescription() {
    const showFullDescription = !this.state.showFullDescription;
    this.setState({ showFullDescription });
  }

  classNames() {
    return ["card-details", this.state.showFullDescription ? "show-full-description" : ""].join(" ");
  }

  render() {
    return (
      <div className={this.classNames()}>
        <Row>
          <Col lg="12" md="12" sm="12" xs="12">
            <Col lg="4" md="2" sm="3" xs="12">
              {this.props.cardImage}
            </Col>
            <Col lg="8" md="10" sm="9" sx="12">
              <h3>
                {this.props.cardDetails.name} - 阿尔卡纳 {this.props.cardNumber}
              </h3>
              <br />
              <p>
                <h3>正位: </h3>
                {this.props.cardDetails.meaning}
              </p>
              <p>
                <h3>逆位: </h3>
                {this.props.cardDetails.inverse}
              </p>
              <div className="description">
                <h3>{this.props.cardDetails.attribute}</h3>
                <p>{this.props.cardDetails.description}</p>
              </div>
              <RaisedButton label={this.state.showFullDescription ? "收起" : "更多"} labelPosition="before" icon={this.state.showFullDescription ? <Less /> : <More />} onClick={() => this.handleFullDescription()} />
              <hr style={{ opacity: 0.1 }} />
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CardDetails;
