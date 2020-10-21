/**
 * Parse Fiels
 *
 * @param {Object} data
 * @param {String} fields
 *
 * @return {Object}
 */
function parseFields(data, fields) {
  const newData = {};

  const parsedFields = fields.split(',');

  Object.entries(data).forEach((e) => {
    for (let i = 0; i < parsedFields.length; i += 1) {
      const name = e[0];
      const value = e[1];

      if (name === parsedFields[i]) {
        newData[name] = value;
      }
    }
  });

  return newData;
}

/**
 * Filter Posts
 *
 * @public
 *
 * @param {Array} data
 * @param {Boolean} pagination
 * @param {String|Number} page
 *
 * @return {Object}
 */
async function filterPosts(data, pagination, page) {
  //Use Fetch
  const urlID = 1 //= await this.getUrlID();

  if (!Array.isArray(data)) { return parseEntry(data, urlID); }

  let postData = {};
  let newData = data;

  if (pagination) {
    const postPage = page * 10;

    let next = false;
    let prev = false;

    if (data[postPage + 1]) { next = true; }

    if (postPage - 10 > 9) { prev = true; }

    newData = data.slice(postPage - 10, postPage);

    postData = {
      next,
      prev,
    };
  }

  postData.posts = newData.map(e => parseEntry(e, urlID));

  if (!postData.posts) { postData.posts = []; }

  return postData;
}

/**
 * Parse Entry
 *
 * @private
 *
 * @param {Object} data 
 * @param {String|Number} urlID 
 *
 * @return {Object}
 *
 */
function parseEntry(data, urlID) {
  let { url, tags } = data;

  tags = tags ? tags.split(/,\s*/).filter((tag) => tag) : [];

  const images = data.images ? data.images.split(',') : undefined;

  if (data.postStatus !== 'published') {
    return {
      ...data,
      tags,
      images,
    };
  }

  if (urlID == '2') { url = `${e.category}/${e.url}`; }

  if (urlID == '3' || urlID == '4') {
    const date = new Date(data.published);

    if (urlID == '3') { url = `${date.getFullYear()}/${date.getMonth() + 1}/${e.url}`; }
    if (urlID == '4') { url = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${e.url}`; }
  }

  return {
    ...data,
    url,
    tags,
    images,
  };
}

module.exports = {
	parseFields,
  filterPosts
}
