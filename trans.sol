// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenFarm
 * @dev Stake tokens and earn reward tokens over time
 */
contract TokenFarm is Ownable, ReentrancyGuard {
    
    // The token users stake
    IERC20 public stakingToken;
    
    // The reward token distributed to stakers
    IERC20 public rewardToken;
    
    // Reward rate: tokens per second per staked token
    uint256 public rewardRate;
    
    // Total tokens staked in the farm
    uint256 public totalStaked;
    
    // Timestamp when rewards end
    uint256 public rewardsEndTime;
    
    // Last time rewards were calculated
    uint256 public lastUpdateTime;
    
    // Accumulated reward per token staked
    uint256 public rewardPerTokenStored;
    
    // User staking data
    struct UserInfo {
        uint256 stakedAmount;
        uint256 rewardPerTokenPaid;
        uint256 rewards;
        uint256 lastStakeTime;
    }
    
    mapping(address => UserInfo) public userInfo;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward, uint256 duration);
    event RewardRateUpdated(uint256 newRate);
    
    /**
     * @dev Constructor
     * @param _stakingToken Token that users will stake
     * @param _rewardToken Token given as rewards
     * @param _rewardRate Initial reward rate (tokens per second)
     */
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate
    ) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Update reward variables
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        
        if (account != address(0)) {
            UserInfo storage user = userInfo[account];
            user.rewards = earned(account);
            user.rewardPerTokenPaid = rewardPerTokenStored;
        }
        _;
    }
    
    /**
     * @dev Get the last time rewards are applicable
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        if (rewardsEndTime == 0) {
            return block.timestamp;
        }
        return block.timestamp < rewardsEndTime ? block.timestamp : rewardsEndTime;
    }
    
    /**
     * @dev Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored + 
            (((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / totalStaked);
    }
    
    /**
     * @dev Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        UserInfo memory user = userInfo[account];
        return ((user.stakedAmount * (rewardPerToken() - user.rewardPerTokenPaid)) / 1e18) + user.rewards;
    }
    
    /**
     * @dev Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        UserInfo storage user = userInfo[msg.sender];
        
        // Transfer staking tokens from user
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        user.stakedAmount += amount;
        user.lastStakeTime = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw staked tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        
        UserInfo storage user = userInfo[msg.sender];
        require(user.stakedAmount >= amount, "Insufficient staked amount");
        
        user.stakedAmount -= amount;
        totalStaked -= amount;
        
        require(
            stakingToken.transfer(msg.sender, amount),
            "Transfer failed"
        );
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Claim earned rewards
     */
    function claimRewards() public nonReentrant updateReward(msg.sender) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 reward = user.rewards;
        
        if (reward > 0) {
            user.rewards = 0;
            require(
                rewardToken.transfer(msg.sender, reward),
                "Reward transfer failed"
            );
            
            emit RewardsClaimed(msg.sender, reward);
        }
    }
    
    /**
     * @dev Withdraw all staked tokens and claim rewards
     */
    function exit() external {
        withdraw(userInfo[msg.sender].stakedAmount);
        claimRewards();
    }
    
    /**
     * @dev Get staked amount for a user
     */
    function getStakedAmount(address account) external view returns (uint256) {
        return userInfo[account].stakedAmount;
    }
    
    /**
     * @dev Get pending rewards for a user
     */
    function getPendingRewards(address account) external view returns (uint256) {
        return earned(account);
    }
    
    /**
     * @dev Calculate APR (Annual Percentage Rate) - approximate
     * @return APR in basis points (e.g., 1000 = 10%)
     */
    function getAPR() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        // Annual rewards per token staked
        uint256 annualRewards = rewardRate * 365 days;
        
        // APR = (annual rewards / total staked) * 10000 (basis points)
        return (annualRewards * 10000) / totalStaked;
    }
    
    /**
     * @dev Get time staked for a user
     */
    function getTimeStaked(address account) external view returns (uint256) {
        UserInfo memory user = userInfo[account];
        if (user.stakedAmount == 0) return 0;
        return block.timestamp - user.lastStakeTime;
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @dev Set reward rate and duration
     * @param reward Total reward amount to distribute
     * @param duration Duration in seconds
     */
    function notifyRewardAmount(uint256 reward, uint256 duration) 
        external 
        onlyOwner 
        updateReward(address(0)) 
    {
        require(duration > 0, "Duration must be greater than 0");
        
        rewardRate = reward / duration;
        rewardsEndTime = block.timestamp + duration;
        lastUpdateTime = block.timestamp;
        
        emit RewardAdded(reward, duration);
    }
    
    /**
     * @dev Update reward rate
     * @param _rewardRate New reward rate (tokens per second)
     */
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }
    
    /**
     * @dev Emergency withdraw rewards (owner only)
     */
    function emergencyWithdrawRewards(uint256 amount) external onlyOwner {
        require(
            rewardToken.transfer(owner(), amount),
            "Transfer failed"
        );
    }
    
    /**
     * @dev Recover accidentally sent tokens (not staking or reward tokens)
     */
    function recoverToken(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(stakingToken), "Cannot recover staking token");
        require(tokenAddress != address(rewardToken), "Cannot recover reward token");
        
        IERC20(tokenAddress).transfer(owner(), amount);
    }
}
