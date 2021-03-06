const BASE_URI = 'http://localhost:8081';

var nameValidation = () => {
    let name = $('#name').val();
    if(name.length === 0) {
        f = 1;
        $('#name').css('border-color', 'red');
    } else {
        $('#name').css('border-color', 'black');
    }
}

var captionValidation = () => {
    let caption = $('#caption').val();
    if(caption.length === 0) {
        f = 1;
        $('#caption').css('border-color', 'red');
    } else {
        $('#caption').css('border-color', 'black');
    }
}

var urlValidation = () => {
    let url = $('#url').val();
    if(url.length === 0) {
        f = 1;
        $('#url').css('border-color', 'red');
    } else {
        $('#url').css('border-color', 'black');
    }
}

$(document).ready(() => {

    $('#name').on('focusin focusout', () => {
        nameValidation();
    })
    $('#caption').on('focusin focusout', () => {
        captionValidation();
    })
    $('#url').on('focusin focusout', () => {
        urlValidation();
    })

    $('#meme-post').click((e) => {

        
        let name, caption, url;
        name =  $('#name').val();
        caption = $('#caption').val();
        url = $('#url').val();
        
        console.log(name + caption + url);

        nameValidation();
        captionValidation();
        urlValidation();
        if(name.length === 0 || caption.length === 0 || url.length === 0) {
            $('#msg-element').html('Please Specify all required fields');
            $('#msg-element').css('color', 'red');
            $('#msg-element').show();
            delay(2000, 'msg-element');
            return;
        }

        $.ajax({
            url: `${BASE_URI}/memes`,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            datatype: 'json',
            data: {
                'name': name,
                'caption': caption,
                'url': url
            },
            
            success: function (data,textStatus,xhr) { 
                if(((textStatus === 'success') || (xhr.status === 200))) {
                    $('#msg-element').html('Your Meme is saved Successfully');
                    $('#msg-element').css('color', 'green');
                    $('#msg-element').show();
                    $('#caption').val('');
                    $('#url').val('');
                    $('#name').val('');

                } else {
                    $('#msg-element').html('Not able to Save! Try Again');
                    $('#msg-element').css('color', 'red');
                    $('#msg-element').show();
                }
                delay(2000, 'msg-element');
            },
            error: (jqXhr, textStatus, errorMessage) => {
                console.log(textStatus);
                let f = 0;
                if(jqXhr.status === 409) {
                    $('#msg-element').html('Duplicate Entry! Try Again');
                    f = 1;
                } else {
                    $('#msg-element').html('Not able to Save! Try Again');
                }
                $('#msg-element').css('color', 'red');
                $('#msg-element').show();
                if(f) {
                    $('#caption').val('');
                    $('#url').val('');
                    $('#name').val('');
                }
                delay(2000, 'msg-element');
            }

        });
                

    })



})


function delay(time, id) {
    setTimeout(()=> {
        $(`#${id}`).hide();
    }, time);
}

// "timeout"
// "error"
// "notmodified"
// "success"
// "parsererror"