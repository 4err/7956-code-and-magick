"use strict";

(function () {

  var ready_state = {
    "UNSENT": 0,
    "OPENED": 1,
    "HEADERS_RECEIVED": 2,
    "LOADING": 3,
    "DONE": 4
  };

  var rating_classname = {
    1: "review-rating-one",
    2: "review-rating-two",
    3: "review-rating-three",
    4: "review-rating-four",
    5: "review-rating-five"
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviews_filter = document.querySelector(".reviews-filter");
  var reviews_container = document.querySelector(".reviews-list");
  var reviews;

  function render_revies(reviews) {
    reviews_container.classList.remove("reviews-load-failure");
    reviews_container.innerHTML = "";

    var review_template = document.getElementById("review-template");
    var review_fragment = document.createDocumentFragment();

    reviews_filter.classList.add("invisible");

    reviews.forEach(function (review, i) {
      var new_review = review_template.content.children[0].cloneNode(true);

      var original_image = new_review.querySelector(".review-author");

      original_image.title = review["author"]["name"];
      new_review.querySelector(".review-rating").classList.add(rating_classname[review["rating"]]);
      new_review.querySelector(".review-text").textContent = review["description"];

      if (review["author"]["picture"]) {
        var author_image = new Image();

        author_image.src = review["author"]["picture"];

        var image_load_timeout = setTimeout(function () {
          new_review.classList.add("review-load-failure");
        }, REQUEST_FAILURE_TIMEOUT);

        author_image.onload = function () {
          author_image.classList.add("review-author");
          author_image.title = review["author"]["name"];
          author_image.style.width = "124px";
          author_image.style.height = "124px";
          new_review.replaceChild(author_image, original_image);
          clearTimeout(image_load_timeout);
        };

        author_image.onerror = function () {
          new_review.classList.add("review-load-failure");
        };
      }

      review_fragment.appendChild(new_review);
    });

    reviews_container.appendChild(review_fragment);
    reviews_filter.classList.remove("invisible");
  }

  function show_load_failure() {
    reviews_container.classList.add("reviews-load-failure");
  }

  function load_reviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open("get", "data/reviews.json");
    xhr.send();

    xhr.onreadystatechange = function (event) {
      var load = event.target;

      switch (load.readyState) {
        case ready_state.OPENED:
        case ready_state.HEADERS_RECEIVED:
        case ready_state.LOADING:
          reviews_container.classList.add("reviews-list-loading");
          break;

        case ready_state.DONE:
        default:
          reviews_container.classList.remove("reviews-list-loading");

          if (load.status === 200) {
            var data = load.response;
            callback(JSON.parse(data));
          }

          if (load.status > 400) {
            show_load_failure();
          }
      }
    };

    xhr.ontimeout = function () {
      reviews_container.classList.remove("reviews-list-loading");
      show_load_failure();
    };
  }

  function filter_reviews(reviews, filter_name) {
    var filtered_reviews = reviews.slice(0);

    switch (filter_name) {
      case "reviews-recent":
        return filtered_reviews.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        });
        break;

      case "reviews-good":
        return filtered_reviews
          .filter(function (item) {
            return item.rating > 2;
          })
          .sort(function (a, b) {
            if (a.rating > b.rating) {
              return -1;
            }

            if (a.rating < b.rating) {
              return 1;
            }

            if (a.rating === b.rating) {
              return 0;
            }
          });
        break;

      case "reviews-bad":
        return filtered_reviews
          .filter(function (item) {
            return item.rating < 3;
          })
          .sort(function (a, b) {
            if (a.rating < b.rating) {
              return -1;
            }

            if (a.rating > b.rating) {
              return 1;
            }

            if (a.rating === b.rating) {
              return 0;
            }
          });
        break;

      case "reviews-popular":
        return filtered_reviews.sort(function (a, b) {
          if (a["review-rating"] > b["review-rating"]) {
            return -1;
          }

          if (a["review-rating"] < b["review-rating"]) {
            return 1;
          }

          if (a["review-rating"] === b["review-rating"]) {
            return 0;
          }
        });
        break;

      default:
        return reviews.slice(0);
    }
  }

  function init_filters() {
    var filter_elements = document.querySelectorAll(".reviews-filter-item");
    for (var i = 0, l = filter_elements.length; i < l; i++) {
      filter_elements[i].onclick = function (event) {
        var clicked_filter = event.currentTarget;
        set_active_filter(clicked_filter.htmlFor);
      }
    }
  }

  function set_active_filter(filterID) {
    var filtered_reviews = filter_reviews(reviews, filterID);
    render_revies(filtered_reviews);
  }

  init_filters();
  load_reviews(function (loaded_reviews) {
    reviews = loaded_reviews;
    set_active_filter("reviews-all");
  });

})();
