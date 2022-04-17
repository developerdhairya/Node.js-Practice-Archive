const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');


//REGISTER
router.post('/register', async (req, res) => {
  try {

    //check if user is already registered
    if(await User.findOne({email:req.body.email})){
      return res.status(404).json("User with this email already exists.");
    }

    if(await User.findOne({username:req.body.username})){
      return res.status(404).json("Username already taken!");
    }

    //salting & hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating user in db
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    return res.status(200).json(savedUser);

  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN
router.post('/login',async (req, res) => {
  try{

    if(req.body.email===undefined || req.body.password===undefined){
      return res.status(404).json("Incomplete Credentials");
    }

    const user=await User.findOne({email:req.body.email});
    if(!user){
      return res.status(404).json("user not found");
    }

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
      return res.status(404).json("Invalid Password");
    }

    res.status(200).json(user);

  }catch(err){
    console.log(err);
    res.status(500).json("Server error");
  }

});





module.exports = router;