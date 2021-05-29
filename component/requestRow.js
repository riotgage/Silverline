import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from '../ethereum/campaign';
class RequestRow extends Component {
    state={
        Approveloading:false,
        Finalizeloading:false,
    }
    onApprove = async()=>{
        this.setState({
            Approveloading:true
        })
        try{
            const accounts=await web3.eth.getAccounts();
            const campaign=Campaign(this.props.address);
            await campaign.methods.approveRequest(this.props.id).send({
                from:accounts[0],
            })
        }catch(err){
            this.setState({
                Approveloading:false
            })
        }
       
        this.setState({
            Approveloading:false
        })
    }
    onFinalize=async()=>{
        this.setState({
            Finalizeloading:true
        })
        try {
            const accounts=await web3.eth.getAccounts();
            const campaign=Campaign(this.props.address);
            await campaign.methods.finalizeRequest(this.props.id).send({
                from:accounts[0],
    
            })
        } catch (error) {
            this.setState({
                Finalizeloading:false
            })
        }
       
        this.setState({
            Finalizeloading:false
        })
    }
  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readytoFinalize=request.approvalCount>approversCount/2;
    return (
      <Row disabled={request.complete} positive={readytoFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>

        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
            {
                request.complete?null:(
                    <Button color="green" basic onClick={this.onApprove} loading={this.state.Approveloading}>
                    Approve
                  </Button>
                )
            }
         
        </Cell>
        <Cell>
            {
                request.complete ? null:(
                    <Button color="red" basic onClick={this.onFinalize} loading={this.state.Finalizeloading}>
                    Finalize
                  </Button>
                )
            }
         
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
