const mongoose = require('mongoose');
const Schema = require('./schema');
const {filterPosts} = require('../../utils');

/*
const Notification = require('../SendNotification');
const mailer = new Mail();
*/

/**
 * Get Post By Title
 *
 * @public
 *
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise<Object|String>}
 *
 */
Schema.methods.getPostByTitle = async (url, subdomain) => {
    try {
    const post = await this.findOne({ url, subdomain });

    if (!post)
      return Promise.resolve('dont-exists');

    return Promise.resolve(filterPosts(post));
    } catch (err) {
    return Promise.reject(err);
    }
}

/**
 * Get Post By Category
 *
 * @public
 *
 * @param {String} category
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise<Object|String>}
 *
 */
Schema.methods.getPostByCategory = async (category, url, subdomain) => {
  try {
    const post = await this.findOne({ subdomain, category, url });

    if (!post)
          return Promise.resolve('dont-exists');

    return Promise.resolve(filterPosts(post));
    } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Get Post By Year Month
 *
 * @public
 *
 * @param {String|Number} year
 * @param {String|Number} month
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise<Object|String>}
 *
 */
Schema.methods.getPostByYearMonth = async (year, month, url, subdomain) => {
  try {
    const post = await this.findOne({ url, subdomain });
      
    if (!post)
      return Promise.resolve('dont-exists');

    const date = post.published;

    if (
      year === date.getFullYear().toString()
      && month === (date.getMonth() + 1).toString()
    )
      return Promise.resolve(filterPosts(post));

    return Promise.resolve('dont-exists');
  } catch (err) {
    return Promise.reject(err);
  }
}

  /**
   * Get Post By Year Month Day
   *
   * @public
   *
   * @param {String|Number} year
   * @param {String|Number} month
   * @param {String|Number} day
   * @param {String} url
   * @param {String} subdomain
   *
   * @return {Promise<Object|String>}
   *
   */
Schema.methods.getPostByYearMonthDay = async (year, month, day, url, subdomain) => {
  try {
    const post = await this.findOne({ url, subdomain });

    if (!post)
      return Promise.resolve('dont-exists');

    const date = new Date(post.published);

    if (
      year === date.getFullYear().toString()
      && month === (date.getMonth() + 1).toString()
      && day === date.getDate().toString()
    )
      return Promise.resolve(filterPosts(post));

    return Promise.resolve('dont-exists');
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Get Post ID
 *
 * @public
 *
 * @param {Object} conditions
 * @param {Date} datetime
 * @param {String} subdomain
 *
 * @returns Post ID
 * @return {Promise<String|Object>}
 *
 */
Schema.methods.getPostID = async (conditions, datetime, subdomain) => {
    try {

      const post = await this.findOne({...conditions, subdomain});

      if (!post)
        return Promise.resolve('dont-exists');

      if (!datetime)
        return Promise.resolve(post._id);

      const date = post.published;
      const {day, month, year} = datetime;


      if ( year === date.getFullYear().toString()
        && month === (date.getMonth() + 1).toString())
      {
        if (day && day === date.getDate().toString())
          return Promise.resolve(post);
        
        return Promise.resolve(post);
      }

      return Promise.resolve(post._id);
    } catch(err) {
      return Promise.reject(err);
    }
  }
/**
 * Get Post By ID
 *  
 * @public
 *
 * @param {String} ID
 * @param {String} subdomain
 *
 * @return {Promise<Object|String>}
 *
 */
Schema.methods.getPostByID = async (ID, subdomain) => {
  try {
    const post = await this.findOne({_id: ID, subdomain});

    if (!post)
      return Promise.resolve('dont-exists');

    return Promise.resolve(filterPosts(post));
  } catch (err) {
    return Promise.reject(err);
  }
}

 
 /**
  * Get All Posts
  *
  * @description Returns an Object with all posts in DB
  * @public
  *
  * @param {Boolean} pagination
  * @param {String|Number} page
  * @param {String} subdomain
  *
  * @return {Promise<Object>}
  */
Schema.methods.getAllPosts = async (pagination, page, subdomain) => {
    try {
      const posts = await this.find({subdomain}); // TODO Create Order ('created', 'desc');

      return Promise.resolve(filterPosts(posts, pagination, page));
    } catch (err) {
      return Promise.reject(err);
    }
  }

/**
 * Get Publish Posts
 *
 * @description Returns an Object with all published posts in DB
 * @public
 *
 * @param {Boolean} pagination
 * @param {String|Number} page
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 */
Schema.methods.getPublishPosts = async (pagination, page, subdomain) => {
  try {
    const posts = await this.find({subdomain, postStatus: 'published'});

    return Promise.resolve(filterPosts(posts, pagination, page));
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Get Draft Posts
 *
 * @description Returns an Object with all draft posts in DB
 * @public
 *
 * @param {Boolean} pagination
 * @param {String|Number} page
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 */
Schema.methods.getDraftPosts = async (pagination, page, subdomain) => {
  try {
    const posts = await this.find({subdomain, postStatus: 'draft'});
    
    return Promise.resolve(filterPosts(posts, pagination, page));
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Search Post
 *
 * @description Returns an Object with all matched posts in DB
 * @public
 *
 * @param {String} query
 * @param {Boolean} pagination
 * @param {String|Number} page
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 */
Schema.methods.searchPost = async (query, pagination, page, subdomain) => {
  try {
    const postsRes = await this.find({
      content: new RegExp(query, 'i'),
      subdomain
    });

    const posts = postsRes.filter((e) => {
      let foundInTitle = false;
      let foundInTags = false;
      let foundInContent = false;
      let foundInCategory = false;

      if (e.category) {
        foundInCategory = e.category.match(new RegExp(query, 'i')) !== null;
      }
      if (e.tags) {
        foundInTags = e.tags.match(new RegExp(query, 'i')) !== null;
      }
      if (e.title) {
        foundInTitle = e.title.match(new RegExp(query, 'i')) !== null;
      }
      let data;
      if (e.content) {
        data = e.content.split('<').map((ev) => ev.replace(/.*>/, '')).join(' ');

        foundInContent = data.match(new RegExp(query, 'i')) !== null;
      }

      if (foundInContent || foundInTitle || foundInTags || foundInCategory)
        return true;

      return false;
    });

    return posts.length === 0
      ? Promise.resolve('dont-exists')
      : Promise.resolve(filterPosts(posts, pagination, page));

  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Set View
 *
 * @description Set a view on a single post
 * @public
 *
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise}
 */
Schema.methods.setView = async (url, subdomain) => {
  try {
    await this.updateOne({ url, subdomain }, {views: {$increment: 1}});

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Set Comment
 *
 * @description Set a comment on a single post
 * @public
 *
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise}
 */
Schema.methods.setComment = async (url, subdomain) => {
  try {
    await this.updateOne({ url } {comments: {$increment: 1}});

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}


/**
 * Publish Post
 *
 * @description Publish a Posts into DB
 * @public
 *
 * @param {Object} data
 * @param {String} subdomain
 *
 * @return {Promise<Number>}
 *
 */
Schema.methods.publishPost = async (data, subdomain) => {
  const now = Date.now();

  let postData = {};

  const {url} = data;

  if (url) {
    //TODO: Check URL by Fetch 
    const existsURL = false//= await this.existsURL(url);

    if (existsURL) {
      return Promise.resolve('exists-url');
    }
  }

  try {
    let id;
    if (data._id === '' || data._id === 'undefined' || data._id === undefined) {
      postData = {
        ...data,
        updated: now,
        created: now,
        published: now,
        postStatus: 'published',
      };

      delete postData._id;
      const res = await this.create({...postData, subdomain});

      id = res._id;
    } else {
      if (data.postStatus === 'draft') {
        postData = {
          ...data,
          updated: now,
          published: now,
          postStatus: 'published',
        };
      } else {
        postData = {
          ...data,
          updated: now,
          postStatus: 'published',
        };
      }

      await this.updateOne({ _id: data._id }, postData);

      id = data._id;
    }
    return Promise.resolve(id);
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Save Post
 *
 * @description Save a Posts into DB
 * @public
 *
 * @param {Object} data
 * @param {String} subdomain
 *
 * @return {Promise<Number>}
 *
 */
Schema.methods.savePost = async (data, subdomain) => {
  try {
    let id;
    let postData = {};

    const {url} = data;

    if (url) {
      //TODO: Check Url with fetch
      const existsURL = false; //await this.existsURL(url);

      if (existsURL) {
        return Promise.resolve('exists-url');
      }
    }

    if (data._id === '' || data._id === 'undefined') {
      postData = {
        ...data,
        comments: 0,
        created: Date.now(),
        views: 0,
        postStatus: 'draft',
      };

      delete postData._id;
      const res = await this.create({...postData, subdomain});

      id = res._id;
    } else {
      postData = {
        ...data,
        postStatus: 'draft',
      };

      await this.updateOne({_id, data._id}, postData);

      id = data._id;
    }
    return Promise.resolve(id);
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Delete Post
 *
 * @description Delete a post from DB
 * @public
 *
 * @param {String} ID
 * @param {String} url
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 */
Schema.methods.deletePost = async (ID, url, subdomain) => {
    try {

      await this.deleteOne({ _id: ID, subdomain });

      //TODO: make Fetch
      //await this.db('views').where({ url }).delete();

      return Promise.resolve({
        status: 'OK',
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

/**
 * Get Most Viewed
 *
 * @description Get posts with more views
 * @public
 *
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 *
 */
Schema.methods.getMostViewed = async subdomain => {
  try {
    const post = await this.findOne({ postStatus: 'published', subdomain }).sort({views: 'desc'});

    if (!post) {
      return Promise.resolve({});
    }

    return Promise.resolve(filterPosts(post));
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Get Most Commented
 *
 * @description Get posts with more comments
 * @public
 *
 * @param {String} subdomain
 *
 * @return {Promise<Object>}
 *
 */
Schema.methods.getMostCommented = async subdomain => {
  try {
    const post = await this.findOne({ postStatus: 'published', subdomain }).sort({comments: 'desc'});

    if (!post) {
      return Promise.resolve({});
    }

    return Promise.resolve(filterPosts(post));
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = PostsDatabase;
