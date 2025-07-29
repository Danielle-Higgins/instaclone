// TODO: import cloudinary middleware
// TODO: import post model
// TODO: import comment model

module.exports = {
  getFeed: async (req, res) => {
    try {
      res.render("feed");
    } catch (err) {
      console.error(err);
    }
  },

  getProfile: async (req, res) => {
    try {
      res.render("profile");
    } catch (err) {
      console.error(err);
    }
  },

  getPost: async (req, res) => {
    try {
      res.render("post");
    } catch (err) {
      console.error(err);
    }
  },
};
