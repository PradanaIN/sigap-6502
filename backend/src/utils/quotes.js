const fs = require('fs/promises');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'templates', 'quotes.txt');

const FALLBACK_QUOTES = [
  'Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill',
  'The only way to do great work is to love what you do. — Steve Jobs',
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  'Don’t watch the clock; do what it does. Keep going. — Sam Levenson',
  'Quality means doing it right when no one is looking. — Henry Ford',
  'Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau',
  'Discipline is the bridge between goals and accomplishment. — Jim Rohn',
  "Opportunities don't happen. You create them. — Chris Grosser",
  'Hard work beats talent when talent doesn’t work hard. — Tim Notke',
  'Excellence is not an act, but a habit. — Aristotle',
  'What you do today can improve all your tomorrows. — Ralph Marston',
  'Dream big. Start small. Act now. — Robin Sharma',
  'Your work is going to fill a large part of your life… — Steve Jobs',
  'Great things are done by a series of small things brought together. — Vincent Van Gogh',
  'The secret of getting ahead is getting started. — Mark Twain',
  'Perseverance is not a long race; it is many short races one after the other. — Walter Elliot',
  'You don’t have to be great to start, but you have to start to be great. — Zig Ziglar',
  'Success is liking yourself, liking what you do, and liking how you do it. — Maya Angelou',
  'Make each day your masterpiece. — John Wooden',
  'Work hard in silence, let success make the noise. — Frank Ocean',
  'A little progress each day adds up to big results. — Satya Nani',
  "Push yourself, because no one else is going to do it for you.",
  'Great things never come from comfort zones.',
  'Success doesn’t come from what you do occasionally, it comes from what you do consistently. — Marie Forleo',
  'Stay positive, work hard, make it happen.',
  'If everything seems under control, you’re not going fast enough. — Mario Andretti',
  'Never give up on a dream just because of the time it will take to accomplish it. — Earl Nightingale',
  'Don’t limit your challenges. Challenge your limits.',
  'If you get tired, learn to rest, not quit. — Banksy',
  "Your limitation—it's only your imagination.",
  'The harder you work for something, the greater you’ll feel when you achieve it.',
  'Sometimes we’re tested not to show our weaknesses, but to discover our strengths.',
  'Do something today that your future self will thank you for.',
  'Don’t wait for opportunity. Create it.',
  'Push yourself again and again. Don’t give an inch until the final buzzer sounds. — Larry Bird',
  'Success is walking from failure to failure with no loss of enthusiasm. — Winston Churchill',
  'The expert in anything was once a beginner.',
  'Small progress is still progress.',
  'It’s not about having time. It’s about making time.',
  'Winners are not people who never fail, but people who never quit.',
  'Success is the sum of small efforts, repeated day-in and day-out. — Robert Collier',
  'Hustle in silence and let your success make the noise.',
  'Believe in yourself and all that you are. — Christian D. Larson',
  'Strive for progress, not perfection.',
  'The difference between ordinary and extraordinary is that little extra.',
  'Start where you are. Use what you have. Do what you can. — Arthur Ashe',
  'The future depends on what you do today. — Mahatma Gandhi',
  'Success doesn’t just find you. You have to go out and get it.',
  'The key to success is to focus on goals, not obstacles.',
  'There is no substitute for hard work. — Thomas Edison',
];

async function getQuotes() {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8');
    const list = raw
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);
    if (list.length > 0) return list;
    return FALLBACK_QUOTES;
  } catch (err) {
    // Do not log noisily; simply fallback
    return FALLBACK_QUOTES;
  }
}

async function getRandomQuote() {
  const list = await getQuotes();
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = { getQuotes, getRandomQuote };
