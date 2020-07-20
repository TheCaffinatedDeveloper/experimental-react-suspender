export interface IComment {
  id: string,
  body: string,
}

export interface IPost {
  id: number,
  title: string,
}

export interface IPostData {
  data: IPost[],
}

export interface IPosts {
  posts: IPostData,
}

export interface ICommentData {
  data: IComment[],
}

export interface IComments {
  comments: ICommentData,
}