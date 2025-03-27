import { ethers } from 'ethers';

// Function to generate mnemonic and first private key
function generateMnemonicAndPrivateKey() {
    // Generate a random mnemonic
    const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
    
    console.log("Mnemonic:", mnemonic);

    // Create a wallet using the mnemonic
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");

    // Log the private key of the first account
    console.log("First Private Key:", wallet.privateKey);

    // Log the address of the first account
    console.log("Address:", wallet.address);
}

// Run the function
generateMnemonicAndPrivateKey();