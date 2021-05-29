import React, { Component } from "react";
import Layout from "../../component/layout";
import "semantic-ui-css/semantic.min.css";
import { Button, Checkbox, Form, Input, Message, Icon } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Link,Router} from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
    hidden:true
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" ,hidden:false});
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
        Router.pushRoute("/");
    } catch (err) {
      this.setState({
        errorMessage: err.message,
      });
    }
    this.setState({ loading: false ,hidden:true});
  };
  render() {
    return (
      <Layout>
        <h1>Create New Campaign</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="Min. Contribution"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({
                  minimumContribution: event.target.value,
                })
              }
            />
          </Form.Field>
          <Message error header="Oops !" content={this.state.errorMessage} />
          

          <Button type="submit" primary loading={this.state.loading}>
            Create Campaign
          </Button>

          <Message icon hidden={this.state.hidden} positive>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Hold Up </Message.Header>
              We are creating a campaign for you.
            </Message.Content>
          </Message>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
