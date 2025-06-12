import { InterviewConfig, Question } from '../types/interview';

const questionDatabase = {
  'web-development': {
    beginner: [
      'What is the difference between HTML, CSS, and JavaScript?',
      'Explain what responsive web design means.',
      'What are semantic HTML elements and why are they important?',
      'How do you center a div in CSS?',
      'What is the box model in CSS?',
      'Explain the difference between var, let, and const in JavaScript.',
      'What is the DOM and how do you manipulate it?',
      'What are CSS selectors and how do they work?',
    ],
    intermediate: [
      'Explain the concept of closures in JavaScript.',
      'What is the difference between synchronous and asynchronous programming?',
      'How does CSS Grid differ from Flexbox?',
      'What are JavaScript promises and how do they work?',
      'Explain event bubbling and event capturing.',
      'What is the virtual DOM and why is it useful?',
      'How do you optimize website performance?',
      'What are RESTful APIs and how do you consume them?',
    ],
    advanced: [
      'Explain the JavaScript event loop and call stack.',
      'How would you implement server-side rendering?',
      'What are web workers and when would you use them?',
      'Explain the concept of progressive web apps.',
      'How do you handle state management in large applications?',
      'What are micro-frontends and their benefits?',
      'Explain browser caching strategies.',
      'How would you implement real-time features in a web app?',
    ],
  },
  'data-structures': {
    beginner: [
      'What is the difference between an array and a linked list?',
      'Explain what a stack is and give an example of its use.',
      'What is a queue and how does it differ from a stack?',
      'What is Big O notation and why is it important?',
      'Explain the concept of recursion with an example.',
      'What is a hash table and how does it work?',
      'What is the difference between linear and binary search?',
      'Explain what a tree data structure is.',
    ],
    intermediate: [
      'How would you detect a cycle in a linked list?',
      'Explain the difference between DFS and BFS.',
      'What is a binary search tree and its properties?',
      'How would you reverse a linked list?',
      'Explain dynamic programming with an example.',
      'What is the difference between a heap and a binary search tree?',
      'How would you find the middle element of a linked list?',
      'Explain the concept of graph algorithms.',
    ],
    advanced: [
      'How would you implement a LRU cache?',
      'Explain the concept of balanced trees like AVL or Red-Black trees.',
      'What are the different types of graph algorithms and their use cases?',
      'How would you design a data structure for autocomplete?',
      'Explain the concept of trie data structure.',
      'What is consistent hashing and where is it used?',
      'How would you implement a distributed hash table?',
      'Explain the concept of bloom filters.',
    ],
  },
  'system-design': {
    beginner: [
      'What is the difference between horizontal and vertical scaling?',
      'Explain what a load balancer is and why it\'s needed.',
      'What is a database and what are the different types?',
      'What is caching and why is it important?',
      'Explain the concept of microservices.',
      'What is the difference between SQL and NoSQL databases?',
      'What is an API and how does it work?',
      'Explain what CDN stands for and its purpose.',
    ],
    intermediate: [
      'How would you design a URL shortener like bit.ly?',
      'Explain the CAP theorem and its implications.',
      'What is database sharding and when would you use it?',
      'How would you design a chat application?',
      'Explain the concept of eventual consistency.',
      'What are message queues and when would you use them?',
      'How would you design a notification system?',
      'Explain the concept of database replication.',
    ],
    advanced: [
      'How would you design a system like Twitter?',
      'Explain the concept of distributed consensus algorithms.',
      'How would you design a global content delivery network?',
      'What are the challenges in designing a distributed database?',
      'How would you design a real-time analytics system?',
      'Explain the concept of event sourcing and CQRS.',
      'How would you design a system to handle millions of concurrent users?',
      'What are the trade-offs in designing a distributed system?',
    ],
  },
  'behavioral': {
    beginner: [
      'Tell me about yourself and your background.',
      'Why are you interested in this position?',
      'What are your greatest strengths?',
      'What is your biggest weakness?',
      'Where do you see yourself in 5 years?',
      'Why are you leaving your current job?',
      'What motivates you at work?',
      'How do you handle stress and pressure?',
    ],
    intermediate: [
      'Tell me about a time you faced a difficult challenge at work.',
      'Describe a situation where you had to work with a difficult team member.',
      'Give an example of when you had to learn something new quickly.',
      'Tell me about a time you made a mistake and how you handled it.',
      'Describe a situation where you had to meet a tight deadline.',
      'Give an example of when you had to persuade someone to see your point of view.',
      'Tell me about a time you received constructive criticism.',
      'Describe a situation where you had to adapt to change.',
    ],
    advanced: [
      'Tell me about a time you had to make a decision with incomplete information.',
      'Describe a situation where you had to lead a team through a crisis.',
      'Give an example of when you had to innovate or think outside the box.',
      'Tell me about a time you had to manage conflicting priorities.',
      'Describe a situation where you had to influence without authority.',
      'Give an example of when you had to take ownership of a failure.',
      'Tell me about a time you had to coach or mentor someone.',
      'Describe your approach to building and maintaining relationships.',
    ],
  },
  'machine-learning': {
    beginner: [
      'What is machine learning and how does it differ from traditional programming?',
      'Explain the difference between supervised and unsupervised learning.',
      'What is overfitting and how can you prevent it?',
      'What is the difference between classification and regression?',
      'Explain what a neural network is.',
      'What is cross-validation and why is it important?',
      'What is the bias-variance tradeoff?',
      'Explain the concept of feature engineering.',
    ],
    intermediate: [
      'How would you evaluate a machine learning model?',
      'Explain the difference between bagging and boosting.',
      'What is regularization and when would you use it?',
      'How do you handle missing data in a dataset?',
      'Explain the concept of dimensionality reduction.',
      'What is the difference between precision and recall?',
      'How would you handle imbalanced datasets?',
      'Explain the concept of ensemble methods.',
    ],
    advanced: [
      'How would you design a recommendation system?',
      'Explain the concept of deep learning and when to use it.',
      'What are the challenges in deploying ML models to production?',
      'How would you handle concept drift in machine learning?',
      'Explain the concept of transfer learning.',
      'What are GANs and how do they work?',
      'How would you design an A/B testing framework for ML models?',
      'Explain the concept of federated learning.',
    ],
  },
  'mobile-development': {
    beginner: [
      'What is the difference between native and hybrid mobile development?',
      'Explain the mobile app development lifecycle.',
      'What are the key considerations for mobile UI/UX design?',
      'How do you handle different screen sizes and orientations?',
      'What is the difference between iOS and Android development?',
      'Explain the concept of mobile app architecture.',
      'What are the common mobile app testing strategies?',
      'How do you optimize mobile app performance?',
    ],
    intermediate: [
      'How do you handle offline functionality in mobile apps?',
      'Explain the concept of push notifications and how to implement them.',
      'What are the security considerations for mobile apps?',
      'How do you handle data synchronization in mobile apps?',
      'Explain the concept of mobile app state management.',
      'What are the best practices for mobile app deployment?',
      'How do you implement deep linking in mobile apps?',
      'Explain the concept of mobile app analytics.',
    ],
    advanced: [
      'How would you design a mobile app architecture for scalability?',
      'Explain the concept of mobile app performance monitoring.',
      'What are the challenges in cross-platform mobile development?',
      'How would you implement real-time features in mobile apps?',
      'Explain the concept of mobile app security best practices.',
      'What are the considerations for mobile app accessibility?',
      'How would you handle mobile app updates and versioning?',
      'Explain the concept of mobile app CI/CD pipelines.',
    ],
  },
};

const keywordMappings = {
  'web-development': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'responsive', 'DOM', 'API', 'REST', 'HTTP', 'browser', 'frontend', 'backend'],
  'data-structures': ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'hash', 'algorithm', 'complexity', 'Big O', 'recursion', 'sorting', 'searching'],
  'system-design': ['scalability', 'load balancer', 'database', 'caching', 'microservices', 'API', 'distributed', 'consistency', 'availability', 'partition', 'sharding'],
  'behavioral': ['teamwork', 'leadership', 'communication', 'problem-solving', 'adaptability', 'conflict resolution', 'time management', 'collaboration'],
  'machine-learning': ['supervised', 'unsupervised', 'neural network', 'overfitting', 'cross-validation', 'feature', 'model', 'training', 'prediction', 'accuracy'],
  'mobile-development': ['native', 'hybrid', 'iOS', 'Android', 'React Native', 'Flutter', 'responsive', 'performance', 'offline', 'push notifications'],
};

export const generateQuestions = (config: InterviewConfig): Question[] => {
  const domainQuestions = questionDatabase[config.domain as keyof typeof questionDatabase];
  const difficultyQuestions = domainQuestions?.[config.difficulty] || [];
  const keywords = keywordMappings[config.domain as keyof typeof keywordMappings] || [];

  // Shuffle and select questions
  const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, config.questionCount);

  return selectedQuestions.map((text, index) => ({
    id: `q_${index + 1}`,
    text,
    category: config.domain,
    difficulty: config.difficulty,
    expectedKeywords: keywords.slice(0, Math.floor(Math.random() * 5) + 3), // 3-7 keywords per question
    timeLimit: config.mode === 'timed' ? 180 : undefined, // 3 minutes per question in timed mode
  }));
};