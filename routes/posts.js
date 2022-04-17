const router = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

//CREATE POST
router.post("/", async (req, res) => {
    //check if userId belongs to user
    const post = await new Post({
        "userId": req.body.userId,
        "desc": ('desc' in req.body) ? req.body.desc : "",
        "img": ('img' in req.body) ? req.body.img : ""
    });
    try {
        const savedPost = await post.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json("server error");
    }
});

//GET POST BY ID
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json("Invaid request");
        }
        return res.send(200).json(post);
    } catch (err) {
        res.status(500).json("server error");
    }
});

//UPDATE POST BY ID
router.put("/:postId", async (req, res) => {
    //check if userId exists,belongs to user
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json("Invaid request");
        }
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            return res.status(200).json("Post updated successfully");
        } else {
            return res.status(403).json("You are not authorized to update this post");
        }
    } catch (err) {
        return res.send(500).json("Server error");
    }

});

//DELETE POST BY ID
router.put("/:postId", async (req, res) => {
    //check if userId exists,belongs to user

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json("Invaid request");
        }
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("Post updated successfully");
        } else {
            return res.status(403).json("You are not authorized to delete this post");
        }
    } catch (err) {
        return res.send(500).json("Server error");
    }

});

//Liking a post
router.put("/:postId/like", async (req, res) => {
    //check if userId exists,belongs to user
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json("Invaid request");
        }
        if (post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            return res.status(200).json("Post liked successfully");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            return res.status(200).json("Post unliked successfully");
        }
    } catch (err) {
        res.status(500).json("Server Error");
    }
});

//Get User Timeline
router.get("/:userId/timeline", async (req, res) => {
    //check if userId exists,belongs to user
    try {
        const user =await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: req.params.userId });
        if(user.following.length==0){
            return res.status(200).json(userPosts);
        }
        const followingPosts = await Promise.all(
            user.following.map((followingUserId) => {
                return Post.find({ userId: followingUserId });
            })
        );

        return res.status(200).json(userPosts.concat(...followingPosts));
    }catch(err){
        console.log(err);
        res.status(500).json("server error");
    }
});


module.exports = router

