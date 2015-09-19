(function () {

    function is_valid_form() {
        if (review_name.value != "" && review_text.value != "") {
            label_form.style.display = "none";
            return true;
        } else {
            label_form.style.display = "inline-block";
        }
    }

    function get_checked_mark() {
        var mark_list = document.getElementsByName('review-mark');

        for (var i = 0; i < mark_list.length; i++) {
            if (mark_list[i].checked) {
                return i;
            }
        }

    }

    function set_cookies() {
        var mark = docCookies.getItem('mark');
        review_name.value = docCookies.getItem('name');

        if (mark) {
            document.getElementsByName('review-mark')[mark].checked = true;
        }
        is_valid_form();
    }

    var form = document.forms[1];

    var review_name = form['review-name'];
    var review_text = form['review-text'];

    var label_form = document.getElementsByClassName('review-form-control')[1];
    var label_name = document.getElementsByClassName('review-fields-label review-fields-name')[0];
    var label_text = document.getElementsByClassName('review-fields-label review-fields-text')[0];
    var cookies_age = new Date().getTime() + (new Date().getTime() - new Date('27 December 1990').getTime());

    set_cookies();


    review_name.onchange = function (event) {
        if (review_name.value != "") {
            label_name.style.display = "none";
        } else {
            label_name.style.display = "inline";
        }

        is_valid_form();
    };

    review_text.onchange = function (event) {
        if (review_text.value != "") {
            label_text.style.display = "none";
        } else {
            label_text.style.display = "inline";
        }
        is_valid_form();
    };

    form.onsubmit = function (event) {
        event.preventDefault();

        if (is_valid_form()) {

            docCookies.setItem('name', review_name.value, cookies_age);
            docCookies.setItem('mark', get_checked_mark(), cookies_age);

            form.submit();
        }
    }

})();
