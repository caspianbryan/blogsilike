const blogRouter = require("express").Router();
const Blog = require("../models/blogs");

// GET resources
blogRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({});
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

// ADD a resource
blogRouter.post("/", async (req, res) => {
    const body = req.body;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
});

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