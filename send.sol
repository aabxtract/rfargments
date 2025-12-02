// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev Complete ERC20 token with advanced features
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    
    // Token metadata
    uint8 private _decimals;
    
    // Maximum supply (0 = unlimited)
    uint256 public maxSupply;
    
    // Minting control
    bool public mintingEnabled;
    
    // Tax/fee settings (in basis points, 100 = 1%)
    uint256 public transferTaxRate;
    address public taxRecipient;
    
    // Blacklist mapping
    mapping(address => bool) public blacklisted;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event MintingStatusChanged(bool enabled);
    event TaxRateUpdated(uint256 newRate);
    event TaxRecipientUpdated(address newRecipient);
    event AddressBlacklisted(address indexed account);
    event AddressWhitelisted(address indexed account);
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial token supply
     * @param decimals_ Token decimals (usually 18)
     * @param maxSupply_ Maximum supply (0 for unlimited)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimals_,
        uint256 maxSupply_
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = decimals_;
        maxSupply = maxSupply_;
        mintingEnabled = true;
        
        if (initialSupply > 0) {
            if (maxSupply_ > 0) {
                require(initialSupply <= maxSupply_, "Initial supply exceeds max supply");
            }
            _mint(msg.sender, initialSupply * 10 ** decimals_);
        }
    }
    
    /**
     * @dev Returns the number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint new tokens
     * @param to Address to receive tokens
     * @param amount Amount to mint (in token units, not wei)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(mintingEnabled, "Minting is disabled");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 amountWithDecimals = amount * 10 ** _decimals;
        
        if (maxSupply > 0) {
            require(
                totalSupply() + amountWithDecimals <= maxSupply,
                "Would exceed max supply"
            );
        }
        
        _mint(to, amountWithDecimals);
        emit TokensMinted(to, amountWithDecimals);
    }
    
    /**
     * @dev Mint tokens with wei precision
     * @param to Address to receive tokens
     * @param amount Amount in smallest unit (wei)
     */
    function mintExact(address to, uint256 amount) public onlyOwner {
        require(mintingEnabled, "Minting is disabled");
        require(to != address(0), "Cannot mint to zero address");
        
        if (maxSupply > 0) {
            require(totalSupply() + amount <= maxSupply, "Would exceed max supply");
        }
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens
     * @param amount Amount to burn (in token units)
     */
    function burn(uint256 amount) public virtual override {
        uint256 amountWithDecimals = amount * 10 ** _decimals;
        super.burn(amountWithDecimals);
        emit TokensBurned(msg.sender, amountWithDecimals);
    }
    
    /**
     * @dev Enable or disable minting
     */
    function setMintingEnabled(bool enabled) external onlyOwner {
        mintingEnabled = enabled;
        emit MintingStatusChanged(enabled);
    }
    
    /**
     * @dev Pause all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Set transfer tax rate
     * @param rate Tax rate in basis points (100 = 1%, 1000 = 10%)
     */
    function setTransferTax(uint256 rate, address recipient) external onlyOwner {
        require(rate <= 1000, "Tax rate too high (max 10%)");
        require(recipient != address(0), "Invalid tax recipient");
        
        transferTaxRate = rate;
        taxRecipient = recipient;
        
        emit TaxRateUpdated(rate);
        emit TaxRecipientUpdated(recipient);
    }
    
    /**
     * @dev Add address to blacklist
     */
    function blacklistAddress(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(account != owner(), "Cannot blacklist owner");
        blacklisted[account] = true;
        emit AddressBlacklisted(account);
    }
    
    /**
     * @dev Remove address from blacklist
     */
    function whitelistAddress(address account) external onlyOwner {
        blacklisted[account] = false;
        emit AddressWhitelisted(account);
    }
    
    /**
     * @dev Batch blacklist addresses
     */
    function batchBlacklist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0) && accounts[i] != owner()) {
                blacklisted[accounts[i]] = true;
                emit AddressBlacklisted(accounts[i]);
            }
        }
    }
    
    /**
     * @dev Override transfer to add tax and blacklist checks
     */
    function _update(address from, address to, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        // Check blacklist
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        
        // Apply transfer tax if set (not on minting/burning)
        if (transferTaxRate > 0 && from != address(0) && to != address(0) && taxRecipient != address(0)) {
            uint256 taxAmount = (amount * transferTaxRate) / 10000;
            uint256 amountAfterTax = amount - taxAmount;
            
            // Transfer tax to recipient
            super._update(from, taxRecipient, taxAmount);
            // Transfer remaining to recipient
            super._update(from, to, amountAfterTax);
        } else {
            super._update(from, to, amount);
        }
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        uint256 tokenMaxSupply,
        bool isMintingEnabled,
        uint256 taxRate
    ) {
        return (
            name(),
            symbol(),
            _decimals,
            totalSupply(),
            maxSupply,
            mintingEnabled,
            transferTaxRate
        );
    }
    
    /**
     * @dev Airdrop tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts (in token units)
     */
    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            uint256 amountWithDecimals = amounts[i] * 10 ** _decimals;
            _transfer(msg.sender, recipients[i], amountWithDecimals);
        }
    }
    
    /**
     * @dev Recover accidentally sent ERC20 tokens
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(this), "Cannot recover own token");
        IERC20(tokenAddress).transfer(owner(), amount);
    }
    
    /**
     * @dev Recover accidentally sent ETH
     */
    function recoverETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
}
