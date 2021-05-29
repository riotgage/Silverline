const assert=require('assert');
const ganache=require('ganache-cli')
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compileFactory=require('../ethereum/build/:CampaignFactory.json');
const compileCampaign=require('../ethereum/build/:Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async function(){
    accounts=await web3.eth.getAccounts();
    factory=await new web3.eth.Contract(JSON.parse(compileFactory.interface))
    .deploy({data:compileFactory.bytecode})
    .send({from:accounts[0],gas:'1000000'});

    await factory.methods.createCampaign('1000')
    .send({from:accounts[0],gas:"1000000"});

    const addresses=await factory.methods.getDeployedCampaigns().call();
    campaignAddress=addresses[0];
    campaign=await new web3.eth.Contract(JSON.parse(compileCampaign.interface),
    campaignAddress);
})

describe('Campaigns',()=>{

    it("deploys a factory and a campaign",()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("Marks caller as the campaign manager",async()=>{
        const manager=await campaign.methods.manager().call();
        assert.equal(manager,accounts[0]);
    })

    it("Makes contributor as approver",async()=>{
        await campaign.methods.contribute().send({
            value:"20000",
            from:accounts[1],
            gas:"1000000"
        })
        const isContributor=await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
        
    })

    it("Requires a minimum contribution",async()=>{
        try{
            await campaign.methods.contribute().send({
                value:"200",
                from:accounts[1],
                gas:"1000000"
            });
            assert(false);
        }catch( err){
            assert(err)
        }
        
    })

    it("allows manager to make payment request",async()=>{
        await campaign.methods.createRequest("Test","100",accounts[3])
        .send({from:accounts[0],gas:"1000000"})

        const requests=await campaign.methods.requests(0).call();
        assert.equal("Test",requests.description);
    })

    it("process Requests",async()=>{
        await campaign.methods.contribute().send({
            from:accounts[1],
            value:web3.utils.toWei("10","ether")
        });

        await campaign.methods
        .createRequest("Test",web3.utils.toWei("5","ether"),accounts[4])
        .send({from:accounts[0],gas:"1000000"})

        await campaign.methods.approveRequest(0).
        send({from:accounts[1],gas:"1000000"})
       
        await campaign.methods.finalizeRequest(0)
        .send({from:accounts[0],gas:"1000000"})
        
        let balance=await web3.eth.getBalance(accounts[4]);
        
        balance=web3.utils.fromWei(balance,'ether');
        balance=parseFloat(balance);
        assert(balance>104);
    })
})