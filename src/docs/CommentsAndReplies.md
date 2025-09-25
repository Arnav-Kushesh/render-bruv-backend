# How comment and reply works

    * When a comment is created a notification document is created
    * When that comment is liked or disliked then that notification document is updated

# How replies

    * Every comment document has a content field which has a replyTree field
        * Which store the location and ID of each reply
    * When a reply is liked or disliked, the likeCount and dislikeCount is updated in the reply doc.
    * the reply doc also stores a field called reply location that has the location of the reply inside the main comment.
