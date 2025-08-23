function likePost(postId) {
  fetch(`/post/likePost/${postId}?_method=PUT`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(`like-count-${postId}`).textContent = data.likes;

      const heartIcon = document.getElementById(`heart-${postId}`);
      if (data.liked) {
        heartIcon.classList.replace("bi-heart", "bi-heart-fill");
      } else {
        heartIcon.classList.replace("bi-heart-fill", "bi-heart");
      }
    })
    .catch((err) => console.error(err));
}
