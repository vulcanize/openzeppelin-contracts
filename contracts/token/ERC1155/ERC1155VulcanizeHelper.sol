// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC1155VulcanizeTest {
	function init () external;
}

contract ERC1155VulcanizeHelper {

	IERC1155VulcanizeTest public erc1155;

	constructor (address _erc1155) { 

		erc1155 = IERC1155VulcanizeTest(_erc1155);

	}

	function init () public {
		erc1155.init();
		erc1155.init();
	}

}
