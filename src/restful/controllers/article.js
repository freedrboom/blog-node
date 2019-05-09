import { User, Article } from "../../mongoose/proxy"

export const addArticle = async (ctx, next) => {
  const {
    user,
    tags,
    title,
    content,
    release = false,
    cover
  } = ctx.request.body
  const data = { user, tags, title, content, release, cover }
  const newArtile = await Article.newAndSave(data)
  const addedArticle = await Article.getArticleById(newArtile.id)
  if (!addedArticle) {
    throw new Error("服务器内部错误")
  }
  ctx.body = addedArticle
}

export const getArticleById = async (ctx, next) => {
  const { id } = ctx.params
  const tempArticle = await Article.getArticleById(id)
  if (!tempArticle) {
    throw new Error("找不到")
  }
  ctx.body = tempArticle
}

export const getArticleByUser = async (ctx, next) => {
  const { user } = ctx.params
  const tempArticle = await Article.queryArticle({ user })
  if (!tempArticle) {
    throw new Error("找不到")
  }
  ctx.body = tempArticle
}

export const getAllArticles = async (ctx, next) => {
  const { user } = ctx.request.body
  const tempArticle = await Article.queryArticle()
  if (!tempArticle) {
    throw new Error("找不到")
  }
  ctx.body = tempArticle
}
