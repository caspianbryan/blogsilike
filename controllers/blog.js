const blogRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");
const jwt = require('jsonwebtoken');

// authorization
const getToken = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        return auth.replace('Bearer ', '')
    }
    return null
}


// GET resources
blogRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
});


// GET a resource
blogRouter.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404).json({ error: "Blog not found" });
    } else {
        res.json(blog);
    }
});

// ADD a resource POST
// blogRouter.post('/', async (req, res) => {
//     const body = req.body
//     const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

//     if (!decodedToken.id) {
//         return res.status(401).json({ error: "Token Invalid" })
//     }

//     const user = await User.findById(decodedToken.id)

//     const blog = new Blog({
//         url: body.url,
//         title: body.title,
//         author: body.author,
//         user: user.id,
//         likes: body.likes,

//     })

//     const savedBlog = await blog.save()

//     user.blogs = user.blogs.concat(savedBlog._id)
//     await user.save()

//     res.status(201).json(savedBlog)
// })

// blogRouter.post('/', async (req, res) => {
//     try {
//         const body = req.body;

//         // Verify the token
//         const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
//         console.log('servers verification of token:-', decodedToken);

//         // If the token is invalid, return an error response
//         if (!decodedToken.id) {
//             return res.status(401).json({ error: 'Token Invalid' });
//         }

//         // Fetch the user based on the decoded token
//         const user = await User.findById(decodedToken.id);
//         console.log('servers user:-', user);

//         // Create a new blog
//         const blog = new Blog({
//             url: body.url,
//             title: body.title,
//             author: body.author,
//             user: user.id,
//             likes: body.likes,
//         });
//         console.log('servers blog:-', blog);

//         // Save the blog to the database
//         const savedBlog = await blog.save();

//         // Update the user's blogs array
//         user.blogs = user.blogs.concat(savedBlog._id);
//         await user.save();

//         // Return the created blog in the response
//         res.status(201).json(savedBlog);
//     } catch (error) {
//         // Handle errors
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: 'Token Invalid' });
//         } else if (error.name === 'ValidationError') {
//             return res.status(400).json({ error: error.message });
//         } else {
//             console.error('Error creating blog:', error);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }
// });

// notesRouter.post('/', async (request, response) => {
//     const body = request.body
//     const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
//     if(!decodedToken.id) {
//         return response.status(401).json({ error: "Token Invalid" })
//     }
//     const user = await User.findById(decodedToken.id)

//     const note = new Note({
//         content: body.content,
//         important: body.important || false,
//         user: user.id
//     })

//     const savedNote = await note.save()
//     user.notes =user.notes.concat(savedNote._id)
//     await user.save()

//     response.status(201).json(savedNote)
// })


blogRouter.post('/', async (req, res) => {
    const body = req.body
    console.log('body i sent:-', body);

    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    if(!decodedToken.id) {
        return res.status(401).json({ error: 'token is invalid' })
    }
    const user = await User.findById(decodedToken.id)
    console.log('the said user:-', user);

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        user: user.id
    })
    console.log('data new blog:--', blog);

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})


// UPDATE a resource
blogRouter.put("/:id", async (req, res, next) => {
    const body = req.body;
    try {
        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
        };

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
            new: true,
        });

        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

// DELETE a resource
blogRouter.delete("/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

module.exports = blogRouter;