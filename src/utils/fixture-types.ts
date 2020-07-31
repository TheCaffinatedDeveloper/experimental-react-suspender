interface IComment {
  id: number,
  body: string,
  postId: number,
}

interface IPost {
  id: number,
  title: string,
}

interface IPosts {
  posts: IPost[],
}

interface IPostData {
  data: IPost[],
}

interface IComments {
  comments: IComment[],
}

interface ICommentData {
  data: IComment[],
}

export {
  IComment,
  IComments,
  IPost,
  IPosts,
  IPostData,
  ICommentData,
};
