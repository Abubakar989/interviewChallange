const config = require("../config/auth.config");
const User = require("../models/user.model");
const Post = require("../models/post.model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Resize = require("../utils/resize");
const path = require('path');
const fs = require('fs');
const uploadToAws = require('../utils/helper');


exports.signup = async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.firstName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const token = jwt.sign({ user_id: user._id }, config.secret, {
    expiresIn: "86400", //24h
  });

  // save user token
  user.token = token;

  const save = await user.save((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    return res.status(200).json({
      id: user._id,
      username: user.userName,
      email: user.email,
      accessToken: token,
    });
  });
};

exports.signin = async (req, res) => {

  const user2 = await User.findOne({
    email: req.body.email,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const find = await User.updateOne(
      { email: req.body.email },
      { $set: { token: token } },
      { new: true }
    ).lean()

    res.status(200).json({ user });

  })
};

exports.updateName = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  }).lean();

  if (!user) {
    return res.status(404).json({ message: "User Not found." });
  }

  const updatedName = await User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { userName: req.body.userName } },
    { new: true }
  ).lean();


  res.status(200).json({
    updatedName
  });
};


exports.createPost = async (req, res) => {
  // console.log(req);
  const { files } = req;

  if (!files) {
    return res.status(401).json({ error: 'Please provide an image' });
  }

  const user = User.findById({ _id: req.body.id });
  // console.log(files);

  if (user) {
    let imgData = await uploadToAws(files[0].buffer, `${Date.now()}-image.png`);
    // console.log(imgData);
    const post = new Post({
      createdBy: req.body.id,
      image: imgData.Location,
      name: req.body.name,
      description: req.body.description,
    });
    const save = await post.save((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      return res.status(200).json({
        user
      });
    });
  }
  else {
    return res.status(401).json({ error: 'User not found' });
  }
}

exports.getAllPost = async (req, res) => {

  Post.find({}).lean().exec(function (err, docs) {
    // console.log(docs);
    res.status(200).send(docs);
    if (err) {
      res.status(500).send(err);
    }
  });
}

