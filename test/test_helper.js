const Blog = require('../models/blogs')
const User = require('../models/users')

const initialBlogs = [
    {
        title: 'Bugs are Considered Harmful',
        author: 'Edsger van Dijk',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'CRUD works',
        author: 'Halland Brown',
        url: 'wil add ',
        likes: 56,
    }
]

const blogsInDb = async () => {
    const blog = await Blog.find({})
    return blog.map(n => n.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

console.log(usersInDb());

module.exports = {
    blogsInDb,
    usersInDb,
    initialBlogs
};