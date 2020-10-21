const PostModel = require('../database');
const {parseFields} = require('../utils');

class Posts {
  static handleGet(req, res) {
    try {
      const db = new PostModel();

      const {
        page,
        limit,
        fields,
        subdomain
      } = req.query;

      let data = db.getAllPosts(subdomain);

      if (fields) {
        data = {
          ...data,
          posts: data.posts.map(e => parseFields(e, fields)),
        };
      }

      res.json(data);
    } catch (err) {
      console.error(err);
    }
  }
  static handlePost(req, res) {
    try {
      const { action, subdomain } = req.body;

      const db = new PostModel();

      let id;
      
      switch (action) {
        case 'publish':
          id = await db.publishPost(req.body, subdomain);
          break;
        case 'save':
          id = await db.savePost(req.body, subdomain);
          break;
        default:
          return res.sendStatus(400);
      }

      res.send(id.toString());
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Posts;
