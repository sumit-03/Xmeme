const BASE_URI = 'http://localhost:8081';


$(document).on('click','.edit-icon',function(e){
    let ele = e.currentTarget, meme_id = $(ele).parent().parent().children('p').attr('id');
    $('#current-meme-focused').html(meme_id);
});

$(document).ready(() => {

        (function () {
            console.log("Fetching latest 1000 memes")
            $.ajax({
                url: `${BASE_URI}/memes`,
                type: 'GET',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                datatype: 'json',
                success: function (data,textStatus,xhr) { 
                    if(!data.status && ((textStatus === 'success') || (xhr.status === 200))) {
                        data.forEach((item, index, data) => {
                            insertMeme(item.id, item.name, item.url, item.caption, item.time_stamp);
                        });
                    } else {
                    }
                    delay(1500, 'msg-element');
                },
                error: (jqXhr, textStatus, errorMessage) => {
                    console.log(textStatus);
                }

            })
        }());


        $('#edit-update').click((e) => {
            let url = $('#url').val(), caption = $('#caption').val();
            if(!url.length && !caption.length) {
                $('#edit-message').html('Please provide either Meme url or caption or close');
                $('#edit-message').css('color', 'red');
                $('#edit-message').show();
                delay(2000, 'edit-message');
            } else {
                let ele = e.currentTarget;
                let meme_id = $(ele).parent().parent().children('p#current-meme-focused').html();

                $.ajax({
                    url: `${BASE_URI}/memes/${meme_id}`,
                    type: 'PATCH',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    datatype: 'json',
                    data : {
                        'url' : url,
                        'caption': caption
                    },
                    success: function (data,textStatus,xhr) { 
                        if(xhr.status === 200) {
                            let ele = $(`#${meme_id}`);
                            if(caption.length)
                                $(ele).parent().children('h6').html(caption);
                            if(url.length)
                                $(ele).parent().children('img').attr('src', url);
                            
                            $('#edit-message').html('Updated Successfully');
                            $('#edit-message').css('color', 'green');
                            $('#edit-message').show();

                            $('#caption').val('');
                            $('#url').val('');

                            setTimeout(() => {
                                $(`#edit-message`).hide();
                                $('#edit-close').click();
                            }, 500);
                            


                        }
                    },
                    error: (jqXhr, textStatus, errorMessage) => {
                        console.log(textStatus);
                        if(jqXhr.status === 404) {
                            $('#edit-message').html('Please Try Again!');
                            $('#edit-message').css('color', 'red');
                            $('#edit-message').show();
                            delay(2000, 'edit-message');
                        }
                    }
    
                })
            }
        })
        
        

})



function delay(time, id) {
    setTimeout(()=> {
        $(`#${id}`).hide();
    }, time);
}

function insertMeme(id, name, url, caption, time_stamp) {
    let d = new Date(time_stamp),  str = d.toString();
    let pos = str.indexOf("G"), s = str.substring(0, pos);
    $('#meme-container').append(`
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <p id=${id} style="display: none;"></p>
                <h5 class="card-title owner">${name} <span style='font-size:small'>${s}</span><img src="../img/edit.png" style="width:8%; cursor:pointer;" class="edit-icon" data-toggle="modal" data-target="#editModal"></h5>
                <h6 class="card-subtitle mb-2 text-muted" id="caption-${id}">${caption}</h6>
                
                <img src="${url}" alt="Unable to load your meme" id="meme-img-${id}" style="width:80%">
            </div>
        </div> 
    `);
}