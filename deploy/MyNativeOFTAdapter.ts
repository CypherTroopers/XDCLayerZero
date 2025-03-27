import assert from 'assert'
import { parseEther } from 'ethers/lib/utils'

import { type DeployFunction } from 'hardhat-deploy/types'
import { EndpointId } from '@layerzerolabs/lz-definitions'

const contractName = 'XDCNativeOFTAdapter'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // Define rate limits - 100K from native chain to any chain
    // Window is 86400 seconds (24 hours)
    const rateLimitConfigs = [
        {
            dstEid: EndpointId.ETHEREUM_V2_MAINNET,
            limit: parseEther('100000'),
            window: 86400
        },
        {
            dstEid: EndpointId.BASE_V2_MAINNET,
            limit: parseEther('100000'),
            window: 86400
        },
        {
            dstEid: EndpointId.ARBITRUM_V2_MAINNET,
            limit: parseEther('100000'),
            window: 86400
        },
        {
            dstEid: EndpointId.SOLANA_V2_MAINNET,
            limit: parseEther('100000'),
            window: 86400
        }
    ]

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   fuji: {
    //     ...
    //     eid: EndpointId.AVALANCHE_V2_TESTNET
    //   }
    // }
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            rateLimitConfigs,
            18, // TODO update this with native local decimals
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
