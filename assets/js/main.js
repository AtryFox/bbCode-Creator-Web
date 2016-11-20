$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$.fn.extend({
    showTooltip: function (text, placement, callback) {
        placement = placement || 'top';

        this.attr('data-original-title', text);
        this.tooltip({title: text, placement: placement, trigger: 'manuel'});
        this.tooltip('show');

        var element = this;

        setTimeout(function () {
            element.tooltip('hide');
            if (typeof callback === 'function') callback();
        }, 2000);
    }
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

    if (url.includes('deviantart.com') || url.includes('fav.me') || url.includes('sta.sh')) {
        getDeviantart(url, addImage);
    } else if (url.includes('derpibooru.org')) {
        getDerpibooru(url, addImage);
    } else {
        addImage(null);
    }
});

function getDeviantart(url, callback) {
    var result = null;

    $.getJSON('http://backend.deviantart.com/oembed?url=' + url + '&format=jsonp&callback=?')
        .done(function (data) {
            if (!('url' in data)) {
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

            if (data.author_url.includes('deviantart.com')) {
                getDeviantart(data.author_url, addImage);
                added = true;
            }
        })
        .fail(function (data) {
            console.log(data);
        })
        .always(function () {
            if (!added) callback(result);
        });

}

function addImage(data) {
    if (data == null || 'error' in data) {
        $('#failed').slideDown();
        setTimeout(function () {
            $('#failed').slideUp();
        }, 3000);
    } else {
        data.data = JSON.stringify(data);

        $.get('views/elements/image.html', function (template) {
            var rendered = Mustache.render(template, data);
            $(rendered).appendTo($('#wrapper')).hide().slideDown();

        });

        $('#url').val('');
    }

    $('#getImage').prop('disabled', false);
    $('#url').prop('disabled', false);
    $('#loading').slideUp();
}

$('#wrapper').on('click', '.remove', function () {
    $(this).parent().parent().parent().slideUp(function () {
        $(this).remove();
    });
});

// SETTINGS
$('#settings_import:file').on('change', function () {
    var file = this.files[0]

    var reader = new FileReader();
    reader.onload = function (event) {
        var data = "";

        try {
            data = JSON.parse(event.target.result)
        } catch (e) {
        }


        if (data == "") {
            $('#settings_import').parent().showTooltip($('#settings_import').data('error'), 'bottom');
            return;
        }

        if (data.hasOwnProperty('bbcode')) Cookies.set('bbcode', data.bbcode);
        if (data.hasOwnProperty('hide_jumbo')) Cookies.set('hide_jumbo', data.hide_jumbo);
        if (data.hasOwnProperty('lang')) Cookies.set('lang', data.lang);


        $('#settings_import').parent().showTooltip($('#settings_import').data('success'), 'bottom');
    };

    reader.readAsText(file);
});

$('#settings_export').on('click', function () {
    var data = {};

    data.bbcode = Cookies.get('bbcode');
    data.lang = Cookies.get('lang');
    data.hide_jumbo = Cookies.get('hide_jumbo');

    var jsonStr = JSON.stringify(data);

    download(jsonStr, 'creator-settings.json', 'text/plain');
});

var bbCodeSaved = false;
var bbCodeSaveTimeout;
var initBbCode = false;

$('#settings_bbcode').on('blur', function () {
    if (!bbCodeSaved) {
        clearTimeout(bbCodeSaveTimeout);
        saveBbCode()
    }
});

$('#settings_bbcode').on('keyup', function () {
    clearTimeout(bbCodeSaveTimeout);
    bbCodeSaved = false;
    bbCodeSaveTimeout = setTimeout(function () {
        bbCodeSaved = true;
        saveBbCode()
    }, 1500);
});

$('#settings_bbcode').on('keydown', function () {
    bbCodeSaved = false;
    clearTimeout(bbCodeSaveTimeout);
});

$('#restore').on('click', resetBbCode);

function saveBbCode(bbCode) {
    if (!initBbCode) return;

    if(typeof bbCode == 'undefined') {
        bbCode = $("#settings_bbcode").val()
    }

    Cookies.set('bbcode', bbCode);
    $('#settings_bbcode_saved').fadeIn().delay(500).fadeOut();
}

function resetBbCode() {
    var bbCode = "[spoiler=[url=%pageurl]%title[/url] by %author]\n[img]%url[/img]\n[/spoiler]";

    $('#settings_bbcode').val(bbCode);
    saveBbCode(bbCode);
}

var showJumbotronTriggerd = false;
$('#settings_showJumbotron').on('click', function () {
    if (showJumbotronTriggerd) return;

    showJumbotronTriggerd = true;
    Cookies.set('hide_jumbo', 0);
    var self = $(this);
    self.showTooltip(self.data('success'), 'bottom', function () {
        self.parent().parent().slideUp(function () {
            $(this).remove();
        });
    });

});

$(".btn").on('mouseup', function () {
    $(this).blur();
});

$(document).ready(function () {
    initBbCode = true;

    var cookie = Cookies.get('bbcode');

    if (typeof cookie == 'undefined') {
        console.log('und');
        resetBbCode();
    } else {
        console.log('test');
        $('#settings_bbcode').val(Cookies.get('bbcode'));
    }
});