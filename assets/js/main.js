$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$('#locales a').on('click', function () {
    Cookies.set('lang', $(this).html());
    location.reload();
});

$('#dismiss').on('click', function () {
    $(this).tooltip('dispose');
    $(this).parent().parent().slideUp(function () {
        $(this).remove();
    });

    Cookies.set('hide_jumbo', 1);
});

$('#getImage').on('click', function () {
    var url = $('#url').val();

    $(this).prop('disabled', true);
    $('#url').prop('disabled', true);
    $('#loading').slideDown();

    if(url.includes('deviantart.com') || url.includes('fav.me') || url.includes('sta.sh')) {
        getDeviantart(url, addImage);
    } else if(url.includes('derpibooru.org')) {
        getDerpibooru(url, addImage);
    }

});

function getDeviantart(url, callback) {
    var result = null;

    $.getJSON('http://backend.deviantart.com/oembed?url=' + url + '&format=jsonp&callback=?')
        .done(function (data) {
            if(!('url' in data)) {
                data.url = data.thumbnail_url;
            }

            result = data;
        })
        .fail(function (data) {
            console.log(data);
        })
        .always(function () {
            callback(result);
        });
}

function getDerpibooru(url, callback) {
    var result = null;
    var added = false;

    $.getJSON('https://derpibooru.org/oembed.json?url=' + url)
        .done(function (data) {
            data.url = data.thumbnail_url;
            result = data;

            if(data.author_url.includes('deviantart.com')) {
                getDeviantart(data.author_url, addImage);
                added = true;
            }
        })
        .fail(function (data) {
            console.log(data);
        })
        .always(function () {
            if(!added) callback(result);
        });

}

function addImage(data){
    if(data == null || 'error' in data) {
        $('#failed').slideDown();
        setTimeout(function () {
            $('#failed').slideUp();
        }, 3000);
    } else {
        $.get('views/elements/image.html', function (template) {
            var rendered = Mustache.render(template, data);
            $(rendered).appendTo($('#wrapper')).hide().slideDown();

        });
    }

    $('#getImage').prop('disabled', false);
    $('#url').prop('disabled', false);
    $('#loading').slideUp();
}

$('#wrapper').on('click', '.remove',function () {
    $(this).parent().parent().parent().slideUp(function () {
        $(this).remove();
    });
});

