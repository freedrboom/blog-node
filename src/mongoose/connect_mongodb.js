import mongoose from 'mongoose'
mongoose.Promise = global.Promise
const url = 'mongodb://teemo:toor@localhost:27017/graphql'
const options = { }
export default mongoose.connect(url, options)
// db.createUser({
//   user: "teemo",
//   pwd: "toor",
//   roles: [{role: "readWrite",db: "graphql"}]
// })
