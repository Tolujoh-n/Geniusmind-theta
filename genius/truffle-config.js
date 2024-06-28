require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    theta: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          "https://eth-rpc-api-testnet.thetatoken.org/rpc"
        ),
      network_id: 365, // Theta Testnet ID
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
