import React, { Component } from "react";
import {Button, Form, Message,Table} from 'semantic-ui-react';
import Layout from "../../../component/layout";
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../component/requestRow';
import "semantic-ui-css/semantic.min.css";

class RequestIndex extends Component {
    static async getInitialProps(props){
        const{address}=props.query;
        const campaign=Campaign(address);
        const requestCount=await campaign.methods.getRequestsCount().call();
        const approversCount=await campaign.methods.approversCount().call();

        console.log(requestCount);
        const requests=(await Promise.all(   
            Array(parseInt(requestCount))
            .fill()
            .map((element,index)=>{
                return campaign.methods.requests(index).call()
            })
        ))

        return {address,requests,requestCount,approversCount};
    }

    renderRow(){
        return this.props.requests.map((request,index)=>{
            const r=request;
            return (<RequestRow request={r} id={index} key={index} address={this.props.address} approversCount={this.props.approversCount}
            />)
        })
    }

  render() {
      const {Header,Row,HeaderCell,Body}=Table
    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new `}>
            <a>
                <Button primary floated='right' style={{marginBottom:10}}>Add Request</Button>
            </a>
        </Link>
        <Table>
            <Header>
                <Row>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Recipient</HeaderCell>
                    <HeaderCell>Approval Count</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalize</HeaderCell>
                </Row>
            </Header>
            <Body>
                {this.renderRow()}
            </Body>
        </Table>
        <div>Found {this.props.requestCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
