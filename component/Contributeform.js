import React, { Component } from "react";
import { Form, Input, Message, Button ,Icon} from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from  '../routes'

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage:"",
    loading:false
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:''});

    const campaign=new Campaign(this.props.address);
    try{
        const accounts=await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
            from:accounts[0],
            value:web3.utils.toWei(this.state.value,'ether')
        })
        Router.replaceRoute(`/campaigns/${this.props.address}`)
    }catch(err){
        this.setState({errorMessage:err.message});
    }   

    this.setState({loading:false,value:""});
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            placeholder="Ether Contribution"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Button loading={this.state.loading}primary>Contribute</Button>
        <Message error header="Oops !" content={this.state.errorMessage} />
        <Message icon hidden={!this.state.loading} positive>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Hold Up </Message.Header>
              We value your contribution to this campaign
            </Message.Content>
          </Message>
      </Form>
    );
  }
}

export default ContributeForm;
