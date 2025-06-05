
export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  characterClass: CharacterClass;
  stats: PlayerStats;
  inventory: InventoryItem[];
  achievements: string[];
  currentQuests: string[];
  completedQuests: string[];
  guildId?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface PlayerStats {
  strength: number;
  intelligence: number;
  creativity: number;
  social: number;
  wisdom: number;
  luck: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  type: QuestType;
  xpReward: number;
  statRewards: Partial<PlayerStats>;
  timeEstimate: number;
  deadline?: Date;
  prerequisites: string[];
  isCompleted: boolean;
  completedAt?: Date;
  streak?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirements: AchievementRequirement[];
  rewards: AchievementReward;
  isHidden: boolean;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: AchievementRarity;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  effect?: ItemEffect;
  quantity: number;
  acquiredAt: Date;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  members: string[];
  leader: string;
  level: number;
  totalXP: number;
  challenges: GuildChallenge[];
  createdAt: Date;
}

export type CharacterClass = 'scholar' | 'athlete' | 'creator' | 'social' | 'explorer';
export type QuestCategory = 'health' | 'learning' | 'social' | 'work' | 'creative' | 'personal';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type QuestType = 'daily' | 'weekly' | 'main' | 'side';
export type AchievementCategory = 'milestone' | 'streak' | 'social' | 'skill' | 'hidden' | 'rare';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'powerup' | 'cosmetic' | 'reward' | 'badge';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementRequirement {
  type: 'quest_complete' | 'level_reach' | 'stat_reach' | 'streak_reach' | 'xp_earn';
  value: number;
  questId?: string;
  stat?: keyof PlayerStats;
}

export interface AchievementReward {
  xp: number;
  items: string[];
  stats: Partial<PlayerStats>;
}

export interface ItemEffect {
  type: 'xp_multiplier' | 'stat_boost' | 'extra_quest_slot';
  value: number;
  duration: number;
}

export interface GuildChallenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date;
  rewards: AchievementReward;
}
