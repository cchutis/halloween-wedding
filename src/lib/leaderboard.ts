import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface LeaderboardScore {
  id?: string;
  name: string;
  score: number;
  date: string;
  timestamp?: Timestamp;
}

const COLLECTION_NAME = 'leaderboard';

export const submitScore = async (name: string, score: number): Promise<void> => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      name,
      score,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
};

export const getTopScores = async (maxScores: number = 10): Promise<LeaderboardScore[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('score', 'desc'),
      limit(maxScores)
    );
    
    const querySnapshot = await getDocs(q);
    const scores: LeaderboardScore[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        name: data.name,
        score: data.score,
        date: data.date,
        timestamp: data.timestamp
      });
    });
    
    return scores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};
