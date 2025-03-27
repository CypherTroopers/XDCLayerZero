// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { NativeOFTAdapter } from "@layerzerolabs/oft-evm/contracts/NativeOFTAdapter.sol";
import { RateLimiter } from "@layerzerolabs/oapp-evm/contracts/oapp/utils/RateLimiter.sol";

contract XDCNativeOFTAdapter is RateLimiter, NativeOFTAdapter {
    constructor(
        RateLimitConfig[] memory _rateLimitConfigs,
        uint8 _localDecimals,
        address _lzEndpoint,
        address _delegate
    ) NativeOFTAdapter(_localDecimals, _lzEndpoint, _delegate) Ownable(_delegate) {
        _setRateLimits(_rateLimitConfigs);
    }

    function setRateLimits(RateLimitConfig[] memory _rateLimitConfigs) external onlyOwner {
        _setRateLimits(_rateLimitConfigs);
    }
}
