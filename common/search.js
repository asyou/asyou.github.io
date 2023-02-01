$(function(){
    function getItems(json, keywords) {
        var arr = []
        for (var i=0;i<json.length;i++) {
            if ((json[i].title).toLowerCase().indexOf((keywords).toLowerCase()) != -1) {
                arr.push(json[i]);
            }
        }
        return arr;
    }
    function onSearch() {
        var keywords = $('input[type="search"]').val();
        if (keywords) {
            var obj = $('.list-group').length
            $.getJSON("/common/article.json", function (json) {
                var items = getItems(json, keywords);
                var html = '';
                if (items.length > 0) {
                    if (obj > 0) {
                        html += '<div class="my-3"><div class="list-group">'
                    } else {
                        html += '<div class="mt-3"><div class="list-group">'
                    }
                    $.each(items, function(i, o) {
                        var tags = '';
                        $.each(o.tags, function(index,item) {
                            tags += '<span class="badge me-1 text-bg-'+item.color+'">'+item.name+'</span>';
                        })
                        html += '<a href="'+o.url+'" class="list-group-item list-group-item-action">\
                            <div class="d-flex w-100 justify-content-between">\
                                <h5 class="mb-1">'+o.title+'</h5>\
                                <small class="text-muted">'+o.createtime+'</small>\
                            </div>\
                            <p class="mb-1">'+o.description+'</p>\
                            <small class="text-muted">'+tags+'</small>\
                        </a>'
                    });
                    html += '</div></div>';
                    $('.content').html('');
                    $('.content').append(html);
                } else {
                    alert('未搜索到相关结果')
                }
            });
        } else {
            window.location.reload()
        }
    }
    $(document).on('click', '#search', function() {
        onSearch();
    });
    $(document).on('keydown', '#input', function(event) {
        if (event.keyCode == 13) onSearch();
    });
})