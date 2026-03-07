export interface User {
  _id: string;
  username: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  caption: string;
  image: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;  
  createdAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  user: User;
  text: string;
  createdAt: string;
}
