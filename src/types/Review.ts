export interface IReview {
  review_id: number;
  name: string;
  description: string;
  rating: number;
  book_name?: string;
}

export interface IReviewComment {
  review_comment_id: number;
  review_id: number;
  user_id: number;
  txt: string;
  date: string;
  user_avatar?: string;
}

export interface IFullReview {
  review_id: number;
  user_id: number;
  book_id: number;
  rate: number;
  txt: string;
  date: string;
}
