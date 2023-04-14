//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";

contract WarpDrive is ERC721A {
  constructor() ERC721A("Warp Drive", "WARP") {}
}
