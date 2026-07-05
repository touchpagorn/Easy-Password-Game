/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PasswordStrength = 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';

export interface PasswordOption {
  id: string;
  text: string;
  isCorrect: boolean;
  strength: PasswordStrength;
  reason: string;
}

export interface Level {
  id: number;
  timeLimit: number;
  questionText: string;
  options: PasswordOption[];
  learningTip: string;
  focusTopic: string;
  focusTopicColor?: string;
}

export type GameState = 'start' | 'playing' | 'answer-feedback' | 'game-over' | 'victory';

export type Difficulty = 'easy' | 'medium' | 'hard';

