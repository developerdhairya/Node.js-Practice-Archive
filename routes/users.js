const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');



//UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res.status(403).json("Access Denied");
  }

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json("Invalid Request");
  }

  try {
    //encoding password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    //main functionality
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if(user===null){
      return res.status(403).json("invalid request");
    }

    res.status(200).json("Updation Successfull!");

  } catch (err) {
    console.log(err);
    res.status(500).json("server error");
  }

});

//DELETE USER
router.delete("/:id", async (req, res) => {


  if (req.body.userId !== req.params.id) {
    return res.status(403).json("Access Denied!");
  }

  try {
    const user = await User.findByIdAndDelete(req.body.userId.toString());
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json("Invalid request");
    console.log(err);
  }

});

//FIND USER BY ID

router.get("/:id", async (req, res) => {
  try {

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json("Invalid Request");
    }

    const user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(404).json("Invalid Request");
    }

    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});


//FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  try {

    if (!req.body.userId.match(/^[0-9a-fA-F]{24}$/) || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json("Invalid Request");
    }

    if (req.body.userId === req.params.id) {
      return res.status(403).json("You can't follow yourself");
    }


    const currentUser = await User.findById(req.body.userId);
    const user = await User.findById(req.params.id);

    if (user === null || currentUser === null) {
      return res.status(404).json("invalid request");
    }

    if (user.followers.includes(req.body.userId)) {
      return res.status(403).json("You are already following this user.");
    }

    await user.updateOne({ $push: { followers: req.body.userId } });
    await currentUser.updateOne({ $push: { following: req.params.id } });

    return res.status(200).json("User has been followed");
  } catch (err) {
    console.log(err);
    return res.status(500).json("Error!");
  }
});

//UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  try {

    if (!req.body.userId.match(/^[0-9a-fA-F]{24}$/) || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json("Invalid Request");
    }

    if (req.body.userId === req.params.id) {
      return res.status(403).json("You can't follow yourself");
    }


    const currentUser = await User.findById(req.body.userId);
    const user = await User.findById(req.params.id);

    if (user === null || currentUser === null) {
      return res.status(404).json("invalid request");
    }

    if (!user.followers.includes(req.body.userId)) {
      return res.status(403).json("You are not following this user.");
    }

    await user.updateOne({ $pull: { followers: req.body.userId } });
    await currentUser.updateOne({ $pull: { following: req.params.id } });

    return res.status(200).json("User has been unfollowed");
  } catch (err) {
    console.log(err);
    return res.status(500).json("Error!");
  }

});



module.exports = router;