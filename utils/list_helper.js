const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return null
    }
    const mostLikes = blogs.reduce((maxLikes, currentBlog) => {
        return currentBlog.likes > maxLikes ? currentBlog : maxLikes
    }, blogs[0])

    return mostLikes
}

module.exports = {
    dummy, totalLikes, favoriteBlog
}