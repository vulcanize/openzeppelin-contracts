// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../token/ERC1155/utils/ERC1155Receiver.sol";
import "../token/ERC1155/IERC1155.sol";
import "../token/ERC20/IERC20.sol";

interface IERC20VulcanizeTest {
	function init () external;
}
interface IERC1155VulcanizeTest {
	function init () external;
}

contract VulcanizeTestHelper is ERC1155Receiver {

	IERC1155VulcanizeTest public erc1155;
	IERC20VulcanizeTest public erc20;

	event Init(uint indexed number);

	constructor (
		address _erc1155,
		address _erc20
	) { 

		erc20 = IERC20VulcanizeTest(_erc20);

		erc1155 = IERC1155VulcanizeTest(_erc1155);

	}

	function init1155 () public {
		erc1155.init();
		emit Init(1);
		erc1155.init();
		emit Init(2);
	}

	function init20 () public {
		erc20.init();
	}

	function onERC1155Received(
		address operator,
		address from,
		uint256 id,
		uint256 value,
		bytes calldata data
	) external pure override returns (bytes4) {

		return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));

	}

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {

		return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
		
	}

}
