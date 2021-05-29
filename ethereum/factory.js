import web3 from './web3'
import campaignFactory from './build/:CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    "0xc146D39f40fcc1C55Fe469c08F1762587043062A"
)

export default instance;