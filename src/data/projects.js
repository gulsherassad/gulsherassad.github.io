const projects = [
  {
    id: 'epl-predictor',
    title: 'EPL Predictor',
    tagline: 'Win, draw and scoreline odds for any Premier League match',
    highlight: '54.9% accuracy over 1,420 matches',
    description:
      'Blends an Elo rating model with a Poisson goals model to forecast Premier League results, served by a FastAPI backend with match and fixture pages. A walk-forward backtest over 1,420 matches reached 54.9% accuracy, in line with betting-market closing odds.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'pandas', 'JavaScript'],
    role: 'Solo',
    year: 2026,
    repo: 'https://github.com/gulsherassad/epl-predictor',
    live: 'https://epl-predictor-xmqs.onrender.com',
    theme: { bg: '#2B0B3F', url: 'epl-predictor-xmqs.onrender.com' },
    images: [
      {
        src: 'projects/epl-1.webp',
        alt: 'EPL Predictor match view with win, draw and away-win probabilities for Arsenal vs Chelsea',
      },
      {
        src: 'projects/epl-2.webp',
        alt: 'EPL Predictor model performance and recent predictions',
      },
    ],
  },
  {
    id: 'querybird',
    title: 'Querybird',
    tagline: 'Ask a database questions in plain English',
    highlight: '64.2% execution accuracy on BIRD',
    description:
      'Turns plain-English questions into SQL by giving an LLM the database schema, then runs the query on a read-only connection that rejects anything but a single SELECT. Reached 64.2% execution accuracy on all 500 BIRD Mini-Dev questions, with prompt changes driven by analysing failed queries.',
    stack: ['Python', 'Claude API', 'FastAPI', 'SQLite', 'JavaScript'],
    role: 'Solo',
    year: 2026,
    repo: 'https://github.com/gulsherassad/querybird',
    live: null,
    theme: { bg: '#D6E2DA', url: 'querybird.local' },
    images: [
      {
        src: 'projects/querybird.webp',
        alt: 'Querybird turning a plain-English question into a SQL query and its result',
      },
    ],
  },
  {
    id: 'scout',
    title: 'Scout',
    tagline: 'Find attacking players who play like a player you name',
    highlight: 'Recall@10 up from 0.205 to 0.258',
    description:
      "Finds attackers in Europe's top five leagues who play like a given player, combining per-90 stats, chance creation and shot locations reduced to six zones with NMF. Evaluated by self-retrieval across 493 players, where adding shot zones raised recall@10 from 0.205 to 0.258; data refreshes weekly via GitHub Actions.",
    stack: [
      'Python',
      'scikit-learn',
      'pandas',
      'FastAPI',
      'React',
      'TypeScript',
    ],
    role: 'Solo',
    year: 2026,
    repo: 'https://github.com/gulsherassad/scout',
    live: null,
    theme: { bg: '#E8E1D3', url: 'scout.local' },
    images: [
      {
        src: 'projects/scout-1.webp',
        alt: 'Scout results listing the players most similar to Bukayo Saka',
      },
      {
        src: 'projects/scout-2.webp',
        alt: 'Scout style map plotting attackers so similar playing styles cluster together',
      },
    ],
  },
  {
    id: 'macro-optimizer',
    title: 'Macro Meal Optimizer',
    tagline: 'Works out how much of each food hits your macros',
    highlight: 'Linear programming with PuLP',
    description:
      'Calculates servings of each food to meet a calorie ceiling, protein floor and optional carb and fat ranges, formulated as a linear program and solved with PuLP. Infeasible plans get a plain-language explanation instead of an error, plans persist in PostgreSQL, and the React frontend installs as a PWA.',
    stack: ['Python', 'FastAPI', 'PuLP', 'PostgreSQL', 'React', 'Docker'],
    role: 'Solo',
    year: 2026,
    repo: 'https://github.com/gulsherassad/macro_optimizer',
    live: null,
    theme: { bg: '#D9E4F4', url: 'macro-optimizer.local' },
    images: [
      {
        src: 'projects/macro-2.webp',
        alt: 'Macro Meal Optimizer day plan with macro targets and solved totals',
      },
      {
        src: 'projects/macro-1.webp',
        alt: 'Macro Meal Optimizer food library',
      },
    ],
  },
  {
    id: 'movie-review-platform',
    title: 'Movie Review Platform',
    tagline: 'Browse movies, rate them, and discuss reviews',
    highlight: 'Team of 4, COSC 310',
    description:
      'A full-stack movie review site built by a team of four: search, ratings, reviews, threaded comments, watchlists and admin moderation, with a FastAPI backend and Next.js frontend run together via Docker Compose. I owned reviews, comments, the watchlist and backend integration tests.',
    stack: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Docker'],
    role: 'Team of 4: reviews, comments, watchlist and backend tests',
    year: 2025,
    repo: 'https://github.com/gulsherassad/movie-review-platform',
    live: null,
    theme: null,
    images: [],
  },
];

export default projects;
