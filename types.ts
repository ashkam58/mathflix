import React from 'react';

export interface Game {
  id: string;
  title: string;
  description: string;
  category: Category;
  grade: string;
  topics: string[];
  subtopics: string[];
  thumbnailUrl: string;
  content: string; // HTML string or URL
  component?: React.ComponentType<any>; // For internally built React games
  type: 'html' | 'url' | 'react';
  isPremium: boolean;
  views: number;
}

export enum Category {
  MATH = 'Math',
  CODING = 'Coding',
  PYTHON = 'Python',
  WEB_DEV = 'Web Development',
  RUBIKS = 'Rubiks Cube',
  SCRATCH = 'Scratch Game',
  LOGIC = 'Logic & Puzzle',
  SCIENCE = 'Science',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  HISTORY = 'History',
  DSA = 'DSA Coding',
  FEATURED = 'Featured'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string; // Added for auth
  password?: string; // Added for mock auth
  isSubscribed: boolean;
  myList: string[];
  isAdmin?: boolean; // Added to protect admin route
}
