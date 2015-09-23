"use strict";
(function () {

    var rating_classname = {
        1: "review-rating-one",
        2: "review-rating-two",
        3: "review-rating-three",
        4: "review-rating-four",
        5: "review-rating-five"
    }

    var reviews_filter = document.querySelector(".reviews-filter");
    var review_template = document.getElementById("review-template");
    var reviews_container = document.querySelector(".reviews-list");

    var review_fragment = document.createDocumentFragment();


    reviews_filter.classList.add("invisible");

    reviews.forEach(function (review, i) {
        var new_review = review_template.content.children[0].cloneNode(true);

        var original_image = new_review.querySelector(".review-author");

        //  author_image.title = review["author"]["name"];
        new_review.querySelector(".review-rating").classList.add(rating_classname[review["rating"]]);
        new_review.querySelector(".review-text").textContent = review["description"];

        if (review["author"]["picture"]) {
            var author_image = new Image();

            author_image.src = review["author"]["picture"];

            author_image.onload = function () {
                //new_review.replaceChild(original_image, author_image); Здесь должна быть замена
            }
            author_image.onerror = function (evt) {
                new_review.classList.add("review-load-failure");
            };
        }

        review_fragment.appendChild(new_review);
    });

    reviews_container.appendChild(review_fragment);
    reviews_filter.classList.remove("invisible");


})();
