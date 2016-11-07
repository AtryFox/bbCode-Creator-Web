$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$('#locales a').on('click', function () {
    Cookies.set('lang', $(this).html());
    location.reload();
});

$('#dismiss').on('click', function () {
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

    $.getJSON('https://derpibooru.org/oembed.json?url=' + url)
        .done(function (data) {
            data.url = data.thumbnail_url;
            addImage(data);
        })
        .fail(function (data) {
            console.log(data);
            $('#failed').slideDown();
            setTimeout(function () {
                $('#failed').slideUp();
            }, 3000);
        })
        .always(function () {
            $('#getImage').prop('disabled', false);
            $('#url').prop('disabled', false);
            $('#loading').slideUp();
        });

    /*$.getJSON('http://backend.deviantart.com/oembed?url=' + url + '&format=jsonp&callback=?')
        .done(function (data) {
            addImage(data);
        })
        .fail(function (data) {
            console.log(data);
            $('#failed').slideDown();
            setTimeout(function () {
                $('#failed').slideUp();
            }, 3000);
        })
        .always(function () {
            $('#getImage').prop('disabled', false);
            $('#url').prop('disabled', false);
            $('#loading').slideUp();
        });*/
});

$('#wrapper').on('click', '.remove',function () {
    $(this).parent().parent().parent().slideUp(function () {
        $(this).remove();
    });
});

function addImage(data){
    $.get('views/elements/image.html', function (template) {
        var rendered = Mustache.render(template, data);
        $(rendered).appendTo($('#wrapper')).hide().slideDown();

    });
}
