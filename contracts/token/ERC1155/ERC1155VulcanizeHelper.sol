// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/ERC1155Receiver.sol";

interface IERC1155VulcanizeTest {
	function init () external;
}

contract ERC1155VulcanizeHelper is ERC1155Receiver {

	IERC1155VulcanizeTest public erc1155;

	event Init(uint indexed number);

	constructor (address _erc1155) { 

		erc1155 = IERC1155VulcanizeTest(_erc1155);

	}

	function init () public {
		erc1155.init();
		emit Init(1);
		erc1155.init();
		emit Init(2);
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
