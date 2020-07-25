interface IComment {
  id: number,
  body: string,
  postId: number,
}

interface IPost {
  id: number,
  title: string,
}

interface IPostData {
  data: IPost[],
}

interface IPosts {
  posts: IPostData,
}

interface ICommentData {
  data: IComment[],
}

interface IComments {
  comments: ICommentData,
}

export {
  IComment,
  ICommentData,
  IComments,
  IPost,
  IPostData,
  IPosts,
};
