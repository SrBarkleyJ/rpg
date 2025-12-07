const Task = require('../models/Task');
const User = require('../models/User');

const listTasks = async (req, res, next) => {
  try {
    // We need the user to check their focus areas
    // req.user is set by authMiddleware, but might be just { _id: ... } depending on implementation
    // Let's fetch full user to be safe
    const user = await User.findById(req.user._id);

    let query = {};

    // If user has defined focus areas, filter system tasks
    if (user && user.focusAreas && user.focusAreas.length > 0) {
      query = {
        $or: [
          { type: 'user', _id: { $in: user.taskHistory.map(h => h.taskId) } }, // Or however user-custom tasks work
          { type: 'system', category: { $in: user.focusAreas } },
          { type: 'system', category: 'General' } // Always include General if exists
        ]
      };
      // Fallback: If strict filtering returns too few, maybe just return all?
      // For now, let's allow "Discover" mode in frontend if needed, but here we strictly filter
      // Actually, let's keep it simple: Return ALL tasks, but let frontend highlight recommended.
      // But the prompt asked for "Personalized".

      // Let's go with: Return tasks matching categories OR all if array empty.
      query = {
        $or: [
          { category: { $in: user.focusAreas } },
          { category: { $exists: false } } // Tasks without category
        ]
      };
    }

    // IF we want to return ALL tasks if the user has NO preferences, the query remains {}
    // IF the user HAS preferences, we filter.

    const tasks = await Task.find(query);
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

    // --- COOLDOWN & VALIDATION LOGIC ---
    // Check history for this specific task
    // We filter history to find completions for this task
    const completions = user.taskHistory.filter(h => h.taskId === taskId);

    // Sort by date descending (newest first)
    completions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    const lastCompletion = completions.length > 0 ? completions[0] : null;

    const now = new Date();

    if (task.repeatType === 'once') {
      if (lastCompletion || user.completedQuests.includes(taskId)) {
        return res.status(400).json({ message: 'Task already completed' });
      }
    } else if (task.repeatType === 'daily') {
      if (lastCompletion) {
        const lastDate = new Date(lastCompletion.completedAt);
        // Check if last completion was TODAY (same year, month, day)
        if (lastDate.toDateString() === now.toDateString()) {
          // Calculate time until reset (midnight tomorrow)
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          const msRemaining = tomorrow - now;
          const hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60));

          return res.status(400).json({
            message: `Daily task already completed. Resets in ${hoursRemaining}h.`
          });
        }
      }
    } else if (task.repeatType === 'weekly') {
      // Implement similar logic for weekly if needed, or keep simple counter
      // For strict weekly: reset on specific day (e.g., Monday)
      if (lastCompletion) {
        const lastDate = new Date(lastCompletion.completedAt);
        // Get week numbers or just check if > 7 days passed? 
        // Better: Check if in same ISO week
        // For MVP simplicity: weekly resets 7 days after completion
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        if (now - lastDate < oneWeekMs) {
          return res.status(400).json({ message: 'Weekly task already completed this week.' });
        }
      }

      user.weeklyTasksCompleted += 1;
      if (user.weeklyTasksCompleted >= 5) {
        user.skillPoints += 1;
        user.weeklyTasksCompleted = 0;
      }
    }
    // -----------------------------------

    // Add rewards
    user.xp += task.rewardXP;
    user.gold += task.rewardGold;

    // Update history tracking
    if (!user.completedQuests.includes(taskId)) {
      user.completedQuests.push(taskId);
    }
    user.taskHistory.push({ taskId: taskId, completedAt: now });

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
