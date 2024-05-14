import { IBook, ICollection, IReview } from "@/types";

export const books: IBook[] = [
  {
    book_id: 1,
    name: "Harry Potter",
    author: "Dmitriy Sibiryak",
    annotation:
      "A popular fantasy series about a young wizard and his adventures.",
    rate: 4,
  },
  {
    book_id: 2,
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    annotation:
      "A classic novel set in 1920s America, exploring themes of wealth, love, and the American Dream.",
    rate: 5,
  },
  {
    book_id: 3,
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    annotation:
      "A powerful story set in the Deep South, tackling themes of racism and injustice through the eyes of a young girl.",
    rate: 4.5,
  },
  {
    book_id: 4,
    name: "1984",
    author: "George Orwell",
    annotation:
      "A dystopian novel that depicts a totalitarian society and the struggles of one man against the oppressive regime.",
    rate: 4.8,
  },
  {
    book_id: 5,
    name: "Pride and Prejudice",
    author: "Jane Austen",
    annotation:
      "A classic romance novel exploring themes of social class, love, and the importance of overcoming prejudice.",
    rate: 4.7,
  },
  {
    book_id: 6,
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    annotation:
      "A coming-of-age novel that follows the rebellious teenager Holden Caulfield as he navigates through life and society.",
    rate: 4.2,
  },
  {
    book_id: 7,
    name: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    annotation:
      "An epic fantasy trilogy that chronicles the journey of a group of characters to destroy a powerful ring and save Middle-earth.",
    rate: 4.9,
  },
  {
    book_id: 8,
    name: "To the Lighthouse",
    author: "Virginia Woolf",
    annotation:
      "A modernist novel that explores the inner thoughts and experiences of characters during a family trip to a lighthouse.",
    rate: 4.3,
  },
  {
    book_id: 9,
    name: "Moby-Dick",
    author: "Herman Melville",
    annotation:
      "A literary masterpiece that follows the obsessive quest of Captain Ahab to hunt down the white whale, Moby-Dick.",
    rate: 4.6,
  },
  {
    book_id: 10,
    name: "The Odyssey",
    author: "Homer",
    annotation:
      "An ancient Greek epic poem that tells the story of Odysseus' journey home after the Trojan War.",
    rate: 4.4,
  },
  {
    book_id: 11,
    name: "Jane Eyre",
    author: "Charlotte Brontë",
    annotation:
      "A classic novel that follows the life of Jane Eyre, a strong-willed young woman, as she faces challenges and finds love.",
    rate: 4.7,
  },
  {
    book_id: 12,
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    annotation:
      "A fantasy novel that serves as a prequel to The Lord of the Rings, recounting the adventures of Bilbo Baggins.",
    rate: 4.5,
  },
  {
    book_id: 13,
    name: "Fahrenheit 451",
    author: "Ray Bradbury",
    annotation:
      "A dystopian novel set in a future society where books are banned and burned, exploring themes of censorship and knowledge.",
    rate: 4.3,
  },
  {
    book_id: 14,
    name: "Brave New World",
    author: "Aldous Huxley",
    annotation:
      "A dystopian novel that presents a futuristic society where individuals are controlled and conditioned for a stable, conformist existence.",
    rate: 4.2,
  },
  {
    book_id: 15,
    name: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    annotation:
      "A classic novel that follows the adventures of Huck Finn and his friend Jim, an escaped slave, as they travel down the Mississippi River.",
    rate: 4.6,
  },
  {
    book_id: 16,
    name: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    annotation:
      "A psychological novel that delves into the mind of a young man, Raskolnikov, who commits a murder and grapples with guilt and redemption.",
    rate: 4.9,
  },
  {
    book_id: 17,
    name: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    annotation:
      "A Gothic novel that tells the story of Dorian Gray, a man who remains eternally youthful while a portrait of him ages and reflects his sins.",
    rate: 4.7,
  },
  {
    book_id: 18,
    name: "The Alchemist",
    author: "Paulo Coelho",
    annotation:
      "A philosophical novel that follows the journey of a young shepherd named Santiago as he seeks his personal legend and discovers the meaning of life.",
    rate: 4.5,
  },
  {
    book_id: 19,
    name: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    annotation:
      "A series of fantasy novels that transport readers to the magical world of Narnia, where they embark on adventures with various characters.",
    rate: 4.8,
  },
  {
    book_id: 20,
    name: "The Kite Runner",
    author: "Khaled Hosseini",
    annotation:
      "A powerful story that explores friendship, betrayal, and redemption against the backdrop of Afghanistan's tumultuous history.",
    rate: 4.6,
  },
  {
    book_id: 21,
    name: "The Hunger Games",
    author: "Suzanne Collins",
    annotation:
      "A dystopian trilogy set in a post-apocalyptic society where teenagers are forced to participate in a televised fight to the death.",
    rate: 4.4,
  },
  {
    book_id: 22,
    name: "The Da Vinci Code",
    author: "Dan Brown",
    annotation:
      "A thrilling mystery novel that follows a symbologist and a cryptologist as they unravel clues and secrets to solve a centuries-old mystery.",
    rate: 4.3,
  },
];

export const collections: ICollection[] = [
  {
    id: 1,
    title: "My Caol",
    author: "Tanya",
    books: [
      {
        book_id: 5,
        name: "Pride and Prejudice",
        author: "Jane Austen",
        annotation:
          "A classic romance novel exploring themes of social class, love, and the importance of overcoming prejudice.",
        rate: 4.7,
      },
      {
        book_id: 6,
        name: "The Catcher in the Rye",
        author: "J.D. Salinger",
        annotation:
          "A coming-of-age novel that follows the rebellious teenager Holden Caulfield as he navigates through life and society.",
        rate: 4.2,
      },
      {
        book_id: 7,
        name: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        annotation:
          "An epic fantasy trilogy that chronicles the journey of a group of characters to destroy a powerful ring and save Middle-earth.",
        rate: 4.9,
      },
    ],
  },
  {
    id: 2,
    title: "bububu",
    author: "bububu",
    books: [
      {
        book_id: 22,
        name: "The Da Vinci Code",
        author: "Dan Brown",
        annotation:
          "A thrilling mystery novel that follows a symbologist and a cryptologist as they unravel clues and secrets to solve a centuries-old mystery.",
        rate: 4.3,
      },
    ],
  },
  {
    id: 3,
    title: "bububu",
    author: "bububu",
    books: [
      {
        book_id: 22,
        name: "The Da Vinci Code",
        author: "Dan Brown",
        annotation:
          "A thrilling mystery novel that follows a symbologist and a cryptologist as they unravel clues and secrets to solve a centuries-old mystery.",
        rate: 4.3,
      },
    ],
  },
  {
    id: 4,
    title: "bububu",
    author: "bububu",
    books: [
      {
        book_id: 22,
        name: "The Da Vinci Code",
        author: "Dan Brown",
        annotation:
          "A thrilling mystery novel that follows a symbologist and a cryptologist as they unravel clues and secrets to solve a centuries-old mystery.",
        rate: 4.3,
      },
    ],
  },
];

export const reviews: IReview[] = [
  {
    review_id: 1,
    name: "Aston Ville",
    description:
      "This book was about a bird who didn't yet know how to fly. The bird has to decide if it will try to fly, but it was not sure if it wants to. The bird thought, If I never forever endeavor then I won't ever learn. On one wing, he worries he might fail and on the other wing he thinks of how he may succeed. He worries that if he tries, he may get lost in the world. That makes him want to stay in his nest where he's safe.",
    rating: 4.5,
  },
  {
    review_id: 2,
    name: "The Enchanted Forest",
    description:
      "This story is about a young girl who discovers a magical forest behind her house. In the forest, she encounters talking animals and learns valuable life lessons. She must decide whether to keep the forest a secret or share its wonders with others. The book teaches the importance of friendship and the beauty of nature.",
    rating: 4.2,
  },
  {
    review_id: 3,
    name: "The Secret Journey",
    description:
      "In this adventure-filled novel, a group of friends embarks on a secret journey to find a hidden treasure. Along the way, they face numerous challenges and overcome their fears. The book highlights the power of teamwork, courage, and perseverance. Readers will be captivated by the suspense and excitement throughout the story.",
    rating: 4.7,
  },
  {
    review_id: 4,
    name: "The Mysterious Island",
    description:
      "This thrilling tale follows a group of castaways stranded on a mysterious island after a shipwreck. As they explore the island, they encounter strange creatures, solve puzzles, and uncover hidden secrets. The book combines elements of adventure, mystery, and survival. It keeps readers engaged with its unpredictable twists and turns.",
    rating: 4.3,
  },
  {
    review_id: 5,
    name: "The Magical Amulet",
    description:
      "Join the protagonist on a magical quest to find a legendary amulet that holds immense power. Along the way, they encounter mythical creatures, face dangerous challenges, and discover the true meaning of bravery. This fantasy novel takes readers on a captivating journey filled with enchantment and wonder.",
    rating: 4.8,
  },
  {
    review_id: 6,
    name: "The Art of Persistence",
    description:
      "This inspirational book tells the stories of individuals who overcame adversity and achieved remarkable success through persistence. It offers practical advice and strategies for developing a resilient mindset and never giving up on your dreams. The book encourages readers to embrace challenges and stay determined in the face of obstacles.",
    rating: 4.6,
  },
];
