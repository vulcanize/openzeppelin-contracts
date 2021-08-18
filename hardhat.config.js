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

		const THING = await ERC1155.deploy(uri);

    const tx = await THING.init();

    const receipt = await tx.wait();

		if (receipt.events) {
			receipt.events.forEach(event => console.log(event.event, event.args));
		}

	});
