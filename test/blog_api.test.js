const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blogs')

//initializing a database before every test and ensure its empty so the helper has data to be tested
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject =helper.initialBlogs.map(blog => new Blog(blog))

    const promiseArray = blogObject.map(blogs => blogs.save())
    await Promise.all(promiseArray)
}, 20000)

//testing the GET method i.e all data is returned
test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
}, 20000);

//testing unique identifier
test('unique identifier is named', async () => {
    const blogsIds = await helper.blogsInDb()

    blogsIds.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
}, 10000)

//testing the POST method
// test('successful creation of a new blog post', async () => {
//     const newBlog = {
//         title: 'Bugs are Considered Harmful',
//         author: 'Edsger van Dijk',
//         url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//         likes: 5,
//     }

//     await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//     const blogsAtEnd = await helper.blogsInDb()
//     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

//     const contents = blogsAtEnd.map(n => n.title)
//     expect(contents).toContain('Bugs are Considered Harmful')
// }, 10000)

//Checking for 0 likes
// test('creatiion of blogs with 0 likes', async () => {
//     const newBlog = {
//         title: 'A happy coder',
//         author: 'Brian Me',
//         url: 'its me'
//     }

//     const res = await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//     expect(res.body.likes).toBe(0)

//     const blogsAtEnd = await helper.blogsInDb()
//     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

//     const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
//     expect(addedBlog.likes).toBe(0)
// }, 10000)

// didnt test fully the put method
//testing PUT method
test('test for updating an info', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    const changedTitle = 'updated title';

    const newInfo = {
        title: 'CRUD WORKS i just made it',
        author: 'Halland Brown',
        url: 'wil add',
        likes: 56,
        id: '65b67efc38a85583733bedde'
    }

    const newBlog = await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send({ title: changedTitle, ...newInfo })
        .send(200)
        .expect('Content-Type', /text\/html/)

    console.log('newBlog bosy==ds', newBlog.body);
    // expect(newBlog.body.title).toEqual(newInfo.title)

})



//testing DELETE method
test('testing whether i can delete', async () => {
    const blogData = await helper.blogsInDb()
    const blogToView = blogData[0]

    await api
        .delete(`/api/blogs/${blogToView.id}`)
        .expect(204)

    const remainingNotes = await helper.blogsInDb()
    expect(remainingNotes).toHaveLength(blogData.length - 1)

    const ids = remainingNotes.map(r => r.title)
    expect(ids).not.toContain(blogToView.title)
}, 10000)

//closing the connection to the database
afterAll(async () => {
    await mongoose.connection.close()
})