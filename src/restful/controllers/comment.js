import { Comment } from "../../mongoose/proxy"

export const addComment = async (ctx, next) => {
  const { user, article, type, content } = ctx.request.body
  const data = { user, article, type, content }
  const newComment = await Comment.newAndSave(data)
  const addedComment = await Comment.getCommentById(newComment.id)
  if (!addedComment) {
    throw new Error("服务器内部错误")
  }
  ctx.body = addedComment
}

export const getCommentsByArticle = async (ctx, next) => {
  const { article } = ctx.request.body
  const tempArticle = await Article.getCommentsByArticle(article)
  if (!tempArticle) {
    throw new Error("找不到")
  }
  ctx.body = tempArticle

}
