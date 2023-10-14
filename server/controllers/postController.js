import PostModel from '../model/Post.model.js'
import UserModel from '../model/User.model.js';
import multer from 'multer';
import express from 'express'; // Import Express framework or use your preferred framework
import path from 'path';



// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

export async function allPost(req, res) {
  try {
    const posts = await PostModel.find()
      .populate('postedBy', '_id username profile') // Populate 'postedBy' field with 'username' only
      .populate('comments.postedBy', 'userid username profile') // Populate 'postedBy' field with 'username' only
      .exec();

    res.json(posts); // Status code 200 for success
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
  

  export async function getSubPost(req, res) {
    try {
      const posts = await PostModel.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt');
      res.status(200).send({ posts }); // Send JSON response
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "An error occurred while fetching posts." }); // Send JSON error response
    }
  }

export async function myPosts(req, res) {
        try {
          const mypost = await Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name");
          res.status(200).json({ mypost }); // Status code 200 for success
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: "An error occurred while fetching your posts." }); // Status code 500 for internal server error
        }
}

export async function createPost(req, res) {
  try {
    const { userId, username } = req.user;

    const location = req.body.location;
    const description = req.body.description;
    const altitude1 = req.body.altitude1;
    const altitude2 = req.body.altitude2;
    const altitude3 = req.body.altitude3;
    const altitudes = [altitude1, altitude2, altitude3];
    const rating = req.body.rating;
    const imageUrl = req.file.path;

    if (!location || !description || !imageUrl || !altitudes || !rating) {
      return res.status(400).json({ code: 400, message: 'Bad Request' });
    }
    console.log(username)
    const newPost = new PostModel({
      location: location,
      description: description,
      imageUrl: imageUrl,
      altitudes: altitudes,
      rating: rating,
      postedBy: userId // Set the 'postedBy' field to the user's ID
    });

    await newPost.save();
    res.status(201).json({ msg: 'Post created Successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: 'Internal Server Err.' });
  }
}

export async function likePost(req, res) {
  const { userId } = req.user;
  console.log(req.body.postId)

  PostModel.findByIdAndUpdate(req.body.postId, {
    $push: { likes: userId}
}, {
    new: true
}).populate("postedBy", "_id username profile")

    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })

}

export async function unlikePost(req, res) {
  const { userId } = req.user;
  PostModel.findByIdAndUpdate(req.body.postId, {
    $pull : { likes: userId }
}, {
    new: true
}).populate("postedBy", "_id username profile")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })

}
 
  export async function commentPost(req, res) {

    const comment = {
      comment: req.body.text,
      postedBy: req.user.userId
  }

  PostModel.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment}
  }, {
      new: true
  })
      .populate("comments.postedBy", "userId username")
      .exec((err, result) => {
          if (err) {
              return res.status(422).json({ error: err })
          } else {
              res.json(result)
          }
      })
  }
  
  export async function deletePost(req, res) {
    PostModel.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json({ error: err });
        }
        console.log(post.postedBy._id.toString(), req.user.userId)
        if (post.postedBy._id.toString() !== req.user.userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
  
        // Remove the post document
        post
          .remove()
          .then(result => {
            res.json({ message: "Successfully deleted" });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      });
  }

  export async function follow(req, res) {
    console.log(req.params, req.body, req.user.userId)
    UserModel.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user.userId },
      },
      {
        new: true,
      },
      (err, user) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        UserModel.findByIdAndUpdate(
          req.user.userId,
          {
            $push: { followers: req.body.followId },
          },
          {
            new: true,
          }
        )
          .then((result) => res.json(result))
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  }
  

export async function unfollow(req, res){
  UserModel.findByIdAndUpdate(req.body.followId, {
    $pull:{followers: req.user._id}
  },{
    new:true  
  },(err, result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    UserModel.findByIdAndUpdate(req.user._id, {
      $pull:{followers: req.body.followId}
    },{
      new: true
    }).then(result => res.json({message:"Sucessful"}))
    .catch(err => {return res.status(422).json({error:err})})
  })
}
  
    
