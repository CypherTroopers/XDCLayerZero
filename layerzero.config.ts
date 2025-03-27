import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { config } from 'process'

// Note:  Do not use address for EVM OmniPointHardhat contracts.  Contracts are loaded using hardhat-deploy.
// If you do use an address, ensure artifacts exists.
const xdcContract: OmniPointHardhat = {
    eid: EndpointId.XDC_V2_MAINNET,
    contractName: 'XDCNativeOFTAdapter',
}

const baseContract: OmniPointHardhat = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'XDCOFT',
}

const arbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'XDCOFT',
}

const ethereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'XDCOFT',
}

const solanaContract: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_MAINNET,
    address: 'GtLniirqT25acV3jBSTZeHD7RgfrrBUk52oqu5ieZsxG', // NOTE: update this with the OFTStore address.
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 200000,
        value: 0,
    },
]

const SOLANA_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
    {
        // Solana options use (gas == compute units, value == lamports)
        msgType: 2,
        optionType: ExecutorOptionType.COMPOSE,
        index: 0,
        gas: 0,
        value: 0,
    },
]

// Learn about Message Execution Options: https://docs.layerzero.network/v2/developers/solana/oft/account#message-execution-options
// Learn more about the Simple Config Generator - https://docs.layerzero.network/v2/developers/evm/technical-reference/simple-config
export default async function () {
    // note: pathways declared here are automatically bidirectional
    // if you declare A,B there's no need to declare B,A
    const connections = await generateConnectionsConfig([
        [
            xdcContract, // Chain A contract
            solanaContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            ethereumContract, // Chain A contract
            solanaContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            baseContract, // Chain A contract
            solanaContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            arbitrumContract, // Chain A contract
            solanaContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            xdcContract, // Chain A contract
            ethereumContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            xdcContract, // Chain A contract
            baseContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            xdcContract, // Chain A contract
            arbitrumContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            ethereumContract, // Chain A contract
            baseContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            ethereumContract, // Chain A contract
            arbitrumContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
        [
            baseContract, // Chain A contract
            arbitrumContract, // Chain B contract
            [['LayerZero Labs', 'Nethermind'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
            [6, 6], // [A to B confirmations, B to A confirmations]
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
        ],
    ])

    return {
        contracts: [
            { 
                contract: xdcContract,
                config: {
                    owner: '0xbE7c7e4307CdC819F2c2e54a62034AB813E4ec30',
                    delegate: '0xbE7c7e4307CdC819F2c2e54a62034AB813E4ec30',
                }
            },
            { 
                contract: solanaContract,
                config: {
                    owner: '4ZV26MoKRLmPdt52bX4FVHtuN62bwk1zguzvtV2EBVgz',
                    delegate: '4ZV26MoKRLmPdt52bX4FVHtuN62bwk1zguzvtV2EBVgz',
                }
            },
            { 
                contract: ethereumContract,
                config: {
                    owner: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                    delegate: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                }
            },
            { 
                contract: baseContract,
                config: {
                    owner: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                    delegate: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                }
            },
            { 
                contract: arbitrumContract,
                config: {
                    owner: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                    delegate: '0x0A3036a69A78f819fE811f4dBF500Db7E7b749D4',
                }
            },
        ],
        connections,
    }
}
