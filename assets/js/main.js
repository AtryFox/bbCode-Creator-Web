$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$('#locales a').on('click', function () {
    Cookies.set('lang', $(this).html());
    location.reload();
})

$('#dismiss').on('click', function () {
    $(this).parent().parent().slideUp(function () {
        $(this).remove();
    });

    Cookies.set('hide_jumbo', 1);
});
