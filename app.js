import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_API_KEY;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "来写一些文字吧！鸡毛蒜皮的故纸堆里，也不乏许多的灵光。";
const aboutContent = "这是一个数据库的练手网站，嘻嘻。";
const contactContent = "有缘相见，请你喝杯咖啡";

const main = async function () {
  await mongoose.connect(mongoUrl);

  const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
  });

  const Blog = mongoose.model("Blog", blogSchema);

  const blog1 = new Blog({
    title: "Hi",
    content:
      "Test. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
  });

  // await blog1.save();

  app.get("/", async (req, res) => {
    const foundBlogs = await Blog.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      newPost: foundBlogs,
    });
  });

  app.get("/blogs/:blogId", async (req, res) => {
    const idOfBlog = _.capitalize(req.params.blogId);
    const foundBlog = await Blog.findOne({ _id: idOfBlog });

    if (foundBlog) {
      res.render("post", {
        postTitle: foundBlog.title,
        postContent: foundBlog.content,
      });
    }
  });

  app.get("/about", (req, res) => {
    res.render("about", { startingContent: aboutContent });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", { startingContent: contactContent });
  });

  app.get("/compose", (req, res) => {
    res.render("compose");
  });

  app.post("/compose", async (req, res) => {
    const post = new Blog({
      title: _.capitalize(req.body.title),
      content: req.body.content,
    });

    await post.save();

    res.redirect("/");
  });
};

main().catch((err) => console.log(err));

app.listen(port, function () {
  console.log("Server started on port 3000");
});
