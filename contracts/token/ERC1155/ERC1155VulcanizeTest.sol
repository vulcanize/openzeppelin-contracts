// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC1155.sol";

contract ERC1155VulcanizeTest is ERC1155 {
	constructor (string memory uri_) ERC1155(uri_) { }

	function init () public {
		_mint(msg.sender, 1, 1, "");
		_mint(msg.sender, 2, 2e18, "");
		_mint(msg.sender, 3, 3e25, "");
		_mint(msg.sender, 4, 4e20, "");
	}

}
