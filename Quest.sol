// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is Ownable {
    struct Submission {
        address user;
        string submissionLink;
    }

    struct Task {
        address creator;
        address tokenGate; // Token or NFT contract to gate submissions
        address rewardToken; // ERC20 token for reward
        uint256 rewardAmount;
        Submission[] submissions;
        bool isClosed;
        address winner;
    }

    uint256 public taskCounter;
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => mapping(address => bool)) public hasSubmitted;

    event TaskCreated(uint256 indexed taskId, address indexed creator);
    event Submitted(uint256 indexed taskId, address indexed user, string submissionLink);
    event WinnerPicked(uint256 indexed taskId, address indexed winner);

    /**
     * @notice Create a new task with a token gating condition and ERC20 reward
     * @param _tokenGate The address of the token/NFT required to submit
     * @param _rewardToken The ERC20 token address used for rewards
     * @param _rewardAmount The total reward amount to be distributed
     */
    function createTask(
        address _tokenGate,
        address _rewardToken,
        uint256 _rewardAmount
    ) external {
        require(_rewardToken != address(0), "Invalid reward token");
        require(_rewardAmount > 0, "Reward must be > 0");

        // Transfer ERC20 tokens from creator to this contract
        IERC20(_rewardToken).transferFrom(msg.sender, address(this), _rewardAmount);

        Task storage task = tasks[taskCounter];
        task.creator = msg.sender;
        task.tokenGate = _tokenGate;
        task.rewardToken = _rewardToken;
        task.rewardAmount = _rewardAmount;

        emit TaskCreated(taskCounter, msg.sender);
        taskCounter++;
    }

    /**
     * @notice Submit to a task with a link
     * @param _taskId The ID of the task to submit to
     * @param _submissionLink The link to the user's submission (IPFS, website, etc.)
     */
    function submitToTask(uint256 _taskId, string memory _submissionLink) external {
        Task storage task = tasks[_taskId];
        require(!task.isClosed, "Task closed");
        require(!hasSubmitted[_taskId][msg.sender], "Already submitted");
        require(task.submissions.length < 3, "Submission limit reached");
        require(bytes(_submissionLink).length > 0, "Submission link required");

        hasSubmitted[_taskId][msg.sender] = true;
        task.submissions.push(Submission({ user: msg.sender, submissionLink: _submissionLink }));

        emit Submitted(_taskId, msg.sender, _submissionLink);
    }

    /**
     * @notice Pick a winner and send reward
     * @param _taskId The ID of the task
     * @param _winner The address of the winner (must have submitted)
     */
    function pickWinner(uint256 _taskId, address _winner) external {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.creator || msg.sender == owner(), "Not authorized");
        require(!task.isClosed, "Task already closed");
        require(hasSubmitted[_taskId][_winner], "Winner did not submit");

        task.isClosed = true;
        task.winner = _winner;
        IERC20(task.rewardToken).transfer(_winner, task.rewardAmount);

        emit WinnerPicked(_taskId, _winner);
    }

    /**
     * @notice Get all submission links for a task
     * @param _taskId The ID of the task
     * @return An array of submission links
     */
    function getSubmissions(uint256 _taskId) external view returns (string[] memory) {
        Task storage task = tasks[_taskId];
        uint256 length = task.submissions.length;
        string[] memory links = new string[](length);
        for (uint256 i = 0; i < length; i++) {
            links[i] = task.submissions[i].submissionLink;
        }
        return links;
    }

    /**
     * @notice Get details of a task
     */
    function getTask(uint256 _taskId) external view returns (
        address creator,
        address tokenGate,
        address rewardToken,
        uint256 rewardAmount,
        Submission[] memory submissions,
        bool isClosed,
        address winner
    ) {
        Task storage task = tasks[_taskId];
        return (
            task.creator,
            task.tokenGate,
            task.rewardToken,
            task.rewardAmount,
            task.submissions,
            task.isClosed,
            task.winner
        );
    }
}
