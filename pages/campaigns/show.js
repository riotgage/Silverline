import React, { Component } from "react";
import Layout from "../../component/layout";
import Campaign from "../../ethereum/campaign";
import "semantic-ui-css/semantic.min.css";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../component/Contributeform";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      approversCount,
      requestsCount,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "address of manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (in Wei)",
        description: "Minimum Contribution to become approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of requests",
        description: "Payment Requests created by Manager",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of approvers. Approvers must approve payment requests",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (Ether)",
        description:
          "The balance is how much money is remaining in this campaign",
      },
    ];

    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Column width={6}>
            <ContributeForm address={this.props.address}></ContributeForm>
          </Grid.Column>
          <Grid.Column width={10}>
            <h3>{this.renderCards()}</h3>
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <a>
                <Button primary>
                    View Requests
                </Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
