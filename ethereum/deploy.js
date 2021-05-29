// Web3 helps us connect with blockchain network
// To connect with network we need a provider which, in layman terms , is wallet which has keys, some ether (Our Account)
// HDWalletProvider helps us create that wallet with a mnemonic (Account private key) and infura node ,

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const campaignFactory = require("./build/:CampaignFactory.json");

// Create a provider here
const provider=new HDWalletProvider(
  "mind unveil milk inhale program bone turn repair poet private caution magnet",
  "https://rinkeby.infura.io/v3/a646c4b445e14243a7ee8b96cbf7a9cd"
);


// Create web3 instance here
const web3 = new Web3(provider);

// To deploy we need a account on network, contract interface , contract bytecode , some ether 

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(campaignFactory.interface))
    .deploy({ data: campaignFactory.bytecode})
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};

deploy();