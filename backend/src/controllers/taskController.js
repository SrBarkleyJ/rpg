const Task = require('../models/Task');
const User = require('../models/User');

const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    // Map tasks to flatten title for frontend if needed, or frontend handles it
    // For now, let's return as is, but frontend needs to handle title.en/es
    res.json(tasks);
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const { title, xpReward, goldReward, rewardXP, rewardGold } = req.body;

    // Handle title: if string, make it object for both en/es
    let taskTitle = title;
    if (typeof title === 'string') {
      taskTitle = { en: title, es: title };
    }

    // Handle rewards: map frontend fields to backend fields if necessary
    const finalRewardXP = rewardXP || xpReward || 10;
    const finalRewardGold = rewardGold || goldReward || 5;

    const t = await Task.create({
      ...req.body,
      title: taskTitle,
      rewardXP: finalRewardXP,
      rewardGold: finalRewardGold
    });
    res.status(201).json(t);
  } catch (err) { next(err); }
};

// Complete task: give rewards, mark completed
const completeTask = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const user = await User.findById(req.user._id);

    // FIX: Use completedQuests instead of completedTasks
    if (task.repeatType === 'once' && user.completedQuests.includes(taskId)) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Add rewards
    user.xp += task.rewardXP;
    user.gold += task.rewardGold;
    user.completedQuests.push(taskId);

    // Weekly task progression for skill points
    if (task.repeatType === 'weekly') {
      user.weeklyTasksCompleted += 1;
      if (user.weeklyTasksCompleted >= 5) {
        user.skillPoints += 1;
        user.weeklyTasksCompleted = 0;
      }
    }

    // Level logic with skill point rewards
    const oldLevel = user.level;
    let leveledUp = false;
    let skillPointsGained = 0;

    // FIX: Recalculate xpToLevel for each level inside the loop
    while (true) {
      const xpToLevel = 100 + (user.level - 1) * 50;

      if (user.xp < xpToLevel) break;

      user.level += 1;
      user.xp -= xpToLevel;
      leveledUp = true;

      // Award skill point every level
      user.skillPoints += 1;
      skillPointsGained += 1;

      console.log(`User leveled up to ${user.level}, XP remaining: ${user.xp}, Next level requires: ${100 + (user.level - 1) * 50}`);
    }

    // Initialize response object early
    const response = {
      xpGained: task.rewardXP,
      goldGained: task.rewardGold
    };

    // RETROACTIVE FIX: Ensure skill points match level (1 point per level)
    // This fixes issues where seeded users or skipped levels didn't award points
    const expectedSkillPoints = user.level - 1;

    // We only update if current points are less than expected (to avoid removing spent points if we tracked that)
    // Note: This is a simplistic fix. In a real app we'd track spent points separately.
    if (user.skillPoints < expectedSkillPoints) {
      user.skillPoints = expectedSkillPoints;
    }

    await user.save();

    // Add user to response after save
    response.user = user;

    if (leveledUp) {
      response.leveledUp = true;
      response.newLevel = user.level;
    }

    if (user.skillPoints > 0) {
      response.skillPointsAvailable = user.skillPoints;
    }

    res.json(response);
  } catch (err) { next(err); }
};

module.exports = { listTasks, createTask, completeTask };
