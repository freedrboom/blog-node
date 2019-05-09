import { Tag } from "../../mongoose/proxy"

export const addTag = async (ctx, next) => {
  const { user, name, description } = ctx.request.body
  const data = { user, name, description }
  const newComment = await Tag.newAndSave(data)
  const addedComment = await Tag.getCommentById(newComment.id)
  if (!addedComment) {
    throw new Error("服务器内部错误")
  }
  ctx.body = addedComment
}

export const getTagsByArticle = async (ctx, next) => {
  const { article } = ctx.request.body
  const tempTags = await Tag.getTagsByArticle(article)
  if (!tempTags) {
    throw new Error("找不到")
  }
  ctx.body = tempTags
}

export const getTagsByUser = async (ctx, next) => {
  const { user } = ctx.request.body
  const tempTags = await Tag.queryTag({ user })
  if (!tempTags) {
    throw new Error("找不到")
  }
  ctx.body = tempTags
}
