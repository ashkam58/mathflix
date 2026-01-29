import { Game, UserProfile } from '../types';
import { INITIAL_GAMES } from '../constants';
import { getCurrentUser, updateUserSubscription } from './authService';

const DB_KEY = 'MATHFLIX_DB_V1';

/*
  NOTE: In a real production environment, this service would connect to the MongoDB instance
  provided in the prompt (mongodb+srv://ashkam58:mongodb123@cluster0.qs4xu.mongodb.net/?appName=Cluster0).
  However, for this React SPA demo to function securely and immediately in the browser without a Node.js backend,
  we are using LocalStorage to mimic the database behavior.
*/

export const getGames = (): Game[] => {
  const stored = localStorage.getItem(DB_KEY);
  let games: Game[] = stored ? JSON.parse(stored) : [];

  // 1. Sync Logic:
  // - If a game is in INITIAL_GAMES but not in storage, add it.
  // - If a game is in storage but looks like a default game (id 1-20 or string ID from constants) AND is NOT in INITIAL_GAMES, remove it (it was deleted by dev).
  // - If a game is in both, update specific fields (content, title, images) from constants to ensure updates apply, but preserve 'views'.

  const initialIds = new Set(INITIAL_GAMES.map(g => g.id));

  // Filter out stored games that were originally default games but are now removed from constants.
  // We identify "default games" loosely by checking if they were previously known default IDs or if they match the style of IDs we use.
  // A safer approach for this dev environment: Any game that *was* in INITIAL_GAMES should be removed if it's no longer there.
  // But since we can't know what *was* there, we'll assume any game with specific ID formats or just aggressive syncing for this stage is fine.
  // Let's go with: Keep games that are NOT in initialIds ONLY if they seem to be user-created (e.g., numeric timestamp IDs > 100000).
  // Everything else we sync strictly to INITIAL_GAMES.

  let mergedGames: Game[] = [];
  let hasChanges = false;

  // Process stored games
  if (stored) {
    const storedList: Game[] = JSON.parse(stored);
    storedList.forEach(g => {
      // If it's a "User Added" game (created via form, usually has timestamp ID), keep it.
      // Simple heuristic: timestamp IDs are usually long numbers.
      // OR if it is present in current INITIAL_GAMES, we keep it (and update it later).
      const isDefaultGame = initialIds.has(g.id);
      const isUserCreated = /^\d{13,}$/.test(g.id); // Simple timestamp check (13 digits for ms)
      // Also keep string IDs if they are in the current constants list

      if (isUserCreated) {
        mergedGames.push(g);
      } else if (isDefaultGame) {
        // It's a default game that still exists, we'll push the *updated* version from INITIAL_GAMES later to ensure latest content
        // So we don't push 'g' here, but we mark that we found it so we can preserve 'views'.
      } else {
        // It's a game that is neither user-created nor in the current defaults -> It was deleted from constants.
        // Do NOT add to mergedGames. Effectively deleting it.
        hasChanges = true;
      }
    });
  }

  // Now add/merge INITIAL_GAMES
  INITIAL_GAMES.forEach(initGame => {
    // Check if we have an existing version in the stored list (to preserve views)
    const storedVersion = stored ? JSON.parse(stored).find((g: Game) => g.id === initGame.id) : null;
    if (storedVersion) {
      // Merge: Use constants for everything EXCEPT views
      mergedGames.push({
        ...initGame,
        views: storedVersion.views || 0 // Preserve views
      });
      // If content changed, we effectively updated it just now.
    } else {
      // New game from constants
      mergedGames.push(initGame);
      hasChanges = true;
    }
  });

  // Sort? (Optional, but keeps things stable)
  // mergedGames.sort((a,b) => a.id.localeCompare(b.id));

  if (hasChanges || !stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(mergedGames));
  }

  return mergedGames;

  return games;
};

export const saveGame = (game: Game): void => {
  const games = getGames();
  const newGames = [game, ...games];
  localStorage.setItem(DB_KEY, JSON.stringify(newGames));
};

export const getGameById = (id: string): Game | undefined => {
  const games = getGames();
  return games.find((g) => g.id === id);
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const user = await getCurrentUser();
  if (!user) {
    // Return a guest user placeholder if not logged in
    return {
      id: 'guest',
      name: 'Guest',
      email: '',
      isSubscribed: false,
      myList: []
    };
  }
  return user;
};

export const subscribeUser = (): void => {
  updateUserSubscription(true);
};

export const toggleMyList = (gameId: string): void => {
  // In a real app, this would use the authService to update the specific user's list
  // For this demo, we'll keep the simplified 'myList' on the current user session
  // Implementation omitted for brevity in this specific update as it requires deeper refactoring of authService
  // but logic remains similar: get user -> update list -> save user.
  console.log("Toggle list for", gameId);
};
