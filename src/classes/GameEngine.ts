import { Player, Quest, Achievement, PlayerStats, InventoryItem } from '../types/GameTypes';

export class GameEngine {
  private static instance: GameEngine;
  private players: Map<string, Player> = new Map();
  private quests: Map<string, Quest> = new Map();
  private achievements: Map<string, Achievement> = new Map();

  private constructor() {
    this.initializeGameData();
  }

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  // XP and Level Calculations
  public calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  public calculateLevelFromXP(xp: number): number {
    let level = 1;
    let totalXP = 0;
    while (totalXP <= xp) {
      totalXP += this.calculateXPForLevel(level);
      level++;
    }
    return level - 1;
  }

  public awardXP(playerId: string, xpAmount: number): { leveledUp: boolean; newLevel: number } {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    const oldLevel = player.level;
    player.xp += xpAmount;
    
    const newLevel = this.calculateLevelFromXP(player.xp);
    const leveledUp = newLevel > oldLevel;
    
    if (leveledUp) {
      player.level = newLevel;
      this.handleLevelUp(playerId, newLevel);
    }

    player.xpToNextLevel = this.calculateXPForLevel(newLevel + 1) - (player.xp - this.calculateXPForLevel(newLevel));
    
    return { leveledUp, newLevel };
  }

  // Quest Management
  public completeQuest(playerId: string, questId: string): void {
    const player = this.players.get(playerId);
    const quest = this.quests.get(questId);
    
    if (!player || !quest) return;

    // Award XP with class bonuses
    let xpMultiplier = this.getClassMultiplier(player.characterClass, quest.category);
    const totalXP = Math.floor(quest.xpReward * xpMultiplier);
    
    const { leveledUp } = this.awardXP(playerId, totalXP);

    // Award stat bonuses
    this.awardStats(playerId, quest.statRewards);

    // Mark quest as completed
    quest.isCompleted = true;
    quest.completedAt = new Date();
    player.completedQuests.push(questId);
    player.currentQuests = player.currentQuests.filter(id => id !== questId);

    // Check for achievements
    this.checkAchievements(playerId);

    console.log(`Quest completed: ${quest.title} (+${totalXP} XP)${leveledUp ? ' LEVEL UP!' : ''}`);
  }

  public createTaskFromData(playerId: string, taskData: TaskCreationData): Quest {
    const player = this.players.get(playerId);
    if (!player) throw new Error('Player not found');

    const quest: Quest = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      difficulty: taskData.difficulty,
      type: 'daily',
      xpReward: taskData.finalXP,
      statRewards: this.calculateStatRewards(taskData.category, taskData.finalXP),
      timeEstimate: this.estimateTime(taskData.difficulty),
      prerequisites: [],
      isCompleted: false,
      urgency: taskData.urgency,
      bonuses: taskData.bonuses
    };

    this.quests.set(quest.id, quest);
    player.currentQuests.push(quest.id);
    
    return quest;
  }

  private calculateStatRewards(category: string, xpReward: number): Partial<PlayerStats> {
    const baseStatReward = Math.max(1, Math.floor(xpReward / 20));
    
    switch (category) {
      case 'health':
        return { strength: baseStatReward };
      case 'learning':
        return { intelligence: baseStatReward };
      case 'creative':
        return { creativity: baseStatReward };
      case 'social':
        return { social: baseStatReward };
      case 'personal':
        return { wisdom: baseStatReward };
      default:
        return { wisdom: baseStatReward };
    }
  }

  private estimateTime(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 45;
      case 'hard': return 120;
      case 'epic': return 300;
      default: return 45;
    }
  }

  private getClassMultiplier(characterClass: string, category: string): number {
    const bonuses: Record<string, Record<string, number>> = {
      scholar: { learning: 1.5, work: 1.2 },
      athlete: { health: 1.5, personal: 1.2 },
      creator: { creative: 1.5, personal: 1.2 },
      social: { social: 1.5, work: 1.2 },
      explorer: { personal: 1.5, social: 1.2 }
    };
    
    return bonuses[characterClass]?.[category] || 1.0;
  }

  private awardStats(playerId: string, statRewards: Partial<PlayerStats>): void {
    const player = this.players.get(playerId);
    if (!player) return;

    Object.entries(statRewards).forEach(([stat, value]) => {
      if (value && stat in player.stats) {
        (player.stats as any)[stat] += value;
      }
    });
  }

  private handleLevelUp(playerId: string, newLevel: number): void {
    const player = this.players.get(playerId);
    if (!player) return;

    // Award level up bonuses
    const bonusStats: Partial<PlayerStats> = {
      strength: 1,
      intelligence: 1,
      creativity: 1,
      social: 1,
      wisdom: 1,
      luck: 1
    };
    
    this.awardStats(playerId, bonusStats);

    // Check for level-based achievements
    this.checkLevelAchievements(playerId, newLevel);
  }

  // Achievement System
  private checkAchievements(playerId: string): void {
    const player = this.players.get(playerId);
    if (!player) return;

    this.achievements.forEach((achievement, achievementId) => {
      if (achievement.isUnlocked || player.achievements.includes(achievementId)) return;

      const isUnlocked = achievement.requirements.every(req => 
        this.checkAchievementRequirement(player, req)
      );

      if (isUnlocked) {
        this.unlockAchievement(playerId, achievementId);
      }
    });
  }

  private checkAchievementRequirement(player: Player, requirement: any): boolean {
    switch (requirement.type) {
      case 'quest_complete':
        return player.completedQuests.length >= requirement.value;
      case 'level_reach':
        return player.level >= requirement.value;
      case 'stat_reach':
        return player.stats[requirement.stat as keyof PlayerStats] >= requirement.value;
      case 'xp_earn':
        return player.xp >= requirement.value;
      default:
        return false;
    }
  }

  private checkLevelAchievements(playerId: string, level: number): void {
    const milestones = [5, 10, 25, 50, 100];
    milestones.forEach(milestone => {
      if (level >= milestone) {
        this.unlockAchievement(playerId, `level_${milestone}`);
      }
    });
  }

  private unlockAchievement(playerId: string, achievementId: string): void {
    const player = this.players.get(playerId);
    const achievement = this.achievements.get(achievementId);
    
    if (!player || !achievement || player.achievements.includes(achievementId)) return;

    achievement.isUnlocked = true;
    achievement.unlockedAt = new Date();
    player.achievements.push(achievementId);

    // Award achievement rewards
    this.awardXP(playerId, achievement.rewards.xp);
    this.awardStats(playerId, achievement.rewards.stats);

    console.log(`🏆 Achievement Unlocked: ${achievement.title}!`);
  }

  // Data Management
  public getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  public createPlayer(playerData: Omit<Player, 'id' | 'createdAt' | 'lastActive'>): Player {
    const player: Player = {
      ...playerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    this.players.set(player.id, player);
    return player;
  }

  public getAvailableQuests(playerId: string): Quest[] {
    const player = this.players.get(playerId);
    if (!player) return [];

    return Array.from(this.quests.values()).filter(quest => 
      !quest.isCompleted && 
      !player.currentQuests.includes(quest.id) &&
      quest.prerequisites.every(req => player.completedQuests.includes(req))
    );
  }

  public getQuestsByCategory(category: string): Quest[] {
    return Array.from(this.quests.values()).filter(quest => quest.category === category);
  }

  public getUnlockedAchievements(playerId: string): Achievement[] {
    const player = this.players.get(playerId);
    if (!player) return [];

    return Array.from(this.achievements.values()).filter(achievement => 
      player.achievements.includes(achievement.id)
    );
  }

  private initializeGameData(): void {
    // Initialize sample quests and achievements
    this.loadSampleQuests();
    this.loadSampleAchievements();
  }

  private loadSampleQuests(): void {
    const sampleQuests: Quest[] = [
      {
        id: 'daily_water',
        title: 'Hydration Hero',
        description: 'Drink 8 glasses of water today',
        category: 'health',
        difficulty: 'easy',
        type: 'daily',
        xpReward: 10,
        statRewards: { strength: 1 },
        timeEstimate: 5,
        prerequisites: [],
        isCompleted: false
      },
      {
        id: 'daily_reading',
        title: 'Knowledge Seeker',
        description: 'Read for 30 minutes',
        category: 'learning',
        difficulty: 'easy',
        type: 'daily',
        xpReward: 15,
        statRewards: { intelligence: 2 },
        timeEstimate: 30,
        prerequisites: [],
        isCompleted: false
      },
      {
        id: 'weekly_exercise',
        title: 'Fitness Warrior',
        description: 'Exercise 5 times this week',
        category: 'health',
        difficulty: 'medium',
        type: 'weekly',
        xpReward: 100,
        statRewards: { strength: 10 },
        timeEstimate: 300,
        prerequisites: [],
        isCompleted: false
      }
    ];

    sampleQuests.forEach(quest => this.quests.set(quest.id, quest));
  }

  private loadSampleAchievements(): void {
    const sampleAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first quest',
        icon: '🌟',
        category: 'milestone',
        requirements: [{ type: 'quest_complete', value: 1 }],
        rewards: { xp: 50, items: [], stats: { wisdom: 5 } },
        isHidden: false,
        isUnlocked: false,
        rarity: 'common'
      },
      {
        id: 'level_10',
        title: 'Rising Star',
        description: 'Reach level 10',
        icon: '⭐',
        category: 'milestone',
        requirements: [{ type: 'level_reach', value: 10 }],
        rewards: { xp: 200, items: [], stats: { luck: 10 } },
        isHidden: false,
        isUnlocked: false,
        rarity: 'uncommon'
      }
    ];

    sampleAchievements.forEach(achievement => 
      this.achievements.set(achievement.id, achievement)
    );
  }
}
