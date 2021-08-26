/// ENVVAR
// - ENABLE_GAS_REPORT
// - CI
// - COMPILE_MODE



const fs = require('fs');
const { task } = require('hardhat/config');
const path = require('path');
const argv = require('yargs/yargs')()
  .env('')
  .options({
    ci: {
      type: 'boolean',
      default: false,
    },
    gas: {
      alias: 'enableGasReport',
      type: 'boolean',
      default: false,
    },
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: [ 'production', 'development' ],
      default: 'development',
    },
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.3',
    },
  })
  .argv;

require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');

if (argv.enableGasReport) {
  require('hardhat-gas-reporter');
}

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

const withOptimizations = argv.enableGasReport || argv.compileMode === 'production';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: argv.compiler,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
            "*": ["storageLayout"],
        },
      },
    },
		metadata: {
			bytecodeHash: 'none'
		}
  },
  networks: {
    docker: {
      url: `http://dapptools:8545`,
    },
    hardhat: {
      hardfork: process.env.COVERAGE ? 'berlin' : 'london',
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    currency: 'USD',
    outputFile: argv.ci ? 'gas-report.txt' : undefined,
  },
};

require('@nomiclabs/hardhat-ethers');

task("erc1155-create", "Create an ERC-1155")
	.addParam('uri', 'the URI for this 1155')
	.setAction(async (args, hre) => {
		const { uri } = args 

		const ERC1155 = await hre.ethers.getContractFactory("ERC1155VulcanizeTest");

		const instance = await ERC1155.deploy(uri);

    console.log("deployed erc1155 token to: ", instance.address);

	});

task("erc20-create", "Create an ERC-20")
	.addParam('name', 'the erc20 name')
	.addParam('symbol', 'the erc20 symbol')
	.setAction(async (args, hre) => {
		const { name, symbol } = args 

		const ERC1155 = await hre.ethers.getContractFactory("ERC20VulcanizeTest");

		const instance = await ERC1155.deploy(name, symbol);

    console.log("deployed erc20 token to: ", instance.address);

	});

task("helper-create", "Deploy helper")
  .addParam('erc1155', 'the address of the ERC1155')
  .addParam('erc20', 'the address of the ERC1155')
  .setAction(async (args, hre) => {
    const { erc1155, erc20 } = args;

    const Helper = await hre.ethers.getContractFactory("VulcanizeTestHelper");

    const instance = await Helper.deploy(erc20, erc1155);

    console.log("deployed helper to:", instance.address);

  });

task('this', 'that')
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners()
    console.log("hre.accounts", accounts[0])
  })

task("helper-init-erc20", "Mint tokens to user via helper")
  .addParam('address', 'the address of the helper')
  .setAction(async (args, hre) => {
      const { erc20 } = args;

      const Helper = await hre.ethers.getContractFactory("VulcanizeTestHelper");

      const instance = await Helper.attach(address);

      const tx = await instance.init20();

      const receipt = await tx.wait();

      if (receipt.events) {

        receipt.events.forEach(event => console.log(event) );

      }

      const accounts = await hre.ethers.getSigners()

      console.log("msg.sender", accounts[0].address)

      console.log("blockHash from init erc20:", receipt.blockHash)

  })

task("helper-init-erc1155", "Mint tokens to user via helper")
  .addParam('address', 'the address of the helper')
  .setAction(async (args, hre) => {
      const { address } = args;

      const Helper = await hre.ethers.getContractFactory("VulcanizeTestHelper");

      const instance = await Helper.attach(address);

      const tx = await instance.init1155();

      const receipt = await tx.wait();

      if (receipt.events) {

        receipt.events.forEach(event => {

          console.log("event", event)

          console.log(event.event, event.args)

        });

      }
  })

task("erc1155-init", "Mint tokens to user")
  .addParam('address', 'the address of the ERC1155')
  .setAction(async (args, hre) => {
    const { address } = args

    const ERC1155 = await hre.ethers.getContractFactory("ERC1155VulcanizeTest");

    const instance = await ERC1155.attach(address);

    const tx = await instance.init();

    const receipt = await tx.wait();

    if (receipt.events) {

			receipt.events.forEach(event => {

        console.log(event.event, event.args)

      });

    }

  })
