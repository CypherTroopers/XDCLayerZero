import bs58 from 'bs58'
import { BigNumber } from 'ethers'
import { task, types } from 'hardhat/config'
import { ActionType, HardhatRuntimeEnvironment } from 'hardhat/types'

import { makeBytes32 } from '@layerzerolabs/devtools'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import { getLayerZeroScanLink } from '../solana'
import { ethers } from 'ethers'

interface TaskArguments {
    dstEid: number
    amount: string
    to: string
    contractName: string
}

const action: ActionType<TaskArguments> = async (
    { dstEid, amount, to, contractName },
    hre: HardhatRuntimeEnvironment
) => {
    const signer = await hre.ethers.getNamedSigner('deployer')
    // @ts-ignore
    const token = (await hre.ethers.getContract(contractName)).connect(signer)

    const amountLD = BigNumber.from(amount)
    
    // Try with empty options first
    const extraOptions = '0x'

    const sendParam = {
        dstEid,
        to: to.startsWith('0x') 
            ? makeBytes32(ethers.utils.arrayify(ethers.utils.hexZeroPad(to, 32)))
            : makeBytes32(bs58.decode(to)),
        amountLD: amountLD.toString(),
        minAmountLD: amountLD.mul(9_000).div(10_000).toString(),
        extraOptions: extraOptions,
        composeMsg: '0x',
        oftCmd: '0x',
    }
    
    console.log("Quoting send with params:", JSON.stringify(sendParam, null, 2));
    const [msgFee] = await token.functions.quoteSend(sendParam, false)
    console.log("Message fee:", ethers.utils.formatEther(msgFee.nativeFee), "XDC");
    console.log("Amount:", ethers.utils.formatEther(amountLD), "XDC");
    
    // Check if we're using a NativeOFTAdapter or a regular OFT
    const isNativeAdapter = contractName.toLowerCase().includes('nativeoftadapter');
    
    let txValue;
    if (isNativeAdapter) {
        // For NativeOFTAdapter, we need to add the amount to the value
        txValue = msgFee.nativeFee.add(amountLD);
        console.log("Total value (fee + amount):", ethers.utils.formatEther(txValue), "XDC");
    } else {
        // For regular OFT, we only need to send the fee
        txValue = msgFee.nativeFee;
        console.log("Total value (fee only):", ethers.utils.formatEther(txValue), "XDC");
    }
    
    const txResponse = await token.functions.send(sendParam, msgFee, signer.address, {
        value: txValue,
        gasLimit: 500_000,
    })
    
    const txReceipt = await txResponse.wait()
    console.log(`send: ${amount} to ${to}: ${txReceipt.transactionHash}`)
    console.log(
        `Track cross-chain transfer here: ${getLayerZeroScanLink(txReceipt.transactionHash, dstEid == EndpointId.SOLANA_V2_TESTNET)}`
    )
}

task('send', 'Send tokens to a destination chain')
    .addParam('dstEid', 'Destination endpoint ID', undefined, types.int)
    .addParam('amount', 'Amount to send', undefined, types.string)
    .addParam('to', 'Destination address', undefined, types.string)
    .addParam('contractName', 'Contract name', undefined, types.string)
    .setAction(action)
