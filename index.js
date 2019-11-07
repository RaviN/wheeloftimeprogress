var book_data = [];
var overall_progress = 0;
var overall_length = 0;

$(function() {
    fetchBookData(function() {
        setupProgressBar(overall_progress, overall_length, $("#overall-progress"), $("#mainProgressText"));
        renderBooks();
    });

    function fetchBookData(callback) {
        $.get("https://spreadsheets.google.com/feeds/list/1xRtjJQzpgF6dO1H6M9al9ZJ8OTehB8hnxB_xc4pcUHA/od6/public/values?alt=json", function(data){
            $.each(data.feed.entry, function(i, item){
               var book = extractBook(item);
               book_data.push(book);
               overall_progress += parseInt(book.progress);
               overall_length += parseInt(book.chapters);
            });
            callback();
        })
    }

    function extractBook(item) {
        var book = {};
        book.id = item.gsx$booknumber.$t; 
        book.title = item.gsx$title.$t; 
        book.progress = item.gsx$progress.$t; 
        book.chapters = item.gsx$chapters.$t;
        return book;
    }

    function setupProgressBar(actual, total, elem, textElem) {
        var overall_percent = (actual / total) * 100;
        var className = 'progress-bar-danger';
        if (overall_percent > 10) {
            className = 'progres-bar-warn';
        }
        if (overall_percent > 75) {
            className = 'progress-bar-success'
        }
        var pertcentText = overall_percent.toFixed(2)+'%';
        $(elem).width(pertcentText).addClass(className);
        if (textElem){
            $(textElem).text(pertcentText);
        }
    }

    function renderBooks(){
        $.each(book_data, function(i, book) {
            var rowId = "#row1";
            var read = "unread";

            var bookInfo = $('<div class="col-md-2 book book'+i+'"></div>')


            if (i > 4){
                rowId = "#row2";
            } else
            if (i > 9) {
                rowId = "#row3";
            }


            if (book.progress > 0 ) {
                read = "reading"
            }
            if (book.progress == book.chapters) {
                read = "read"
            }

            var status = $('<div class="status '+read+'"></div>');
            var progressWrapper = $('<div class="bookProgressWrapper"></div>').hide();
            var progress = $('<div class="bookProgress"></div>')
            var bar = $('<div class="progress"></div>')
              .append('<div class="progressText">'+book.progress + '/' + book.chapters +'</div>');
            var bookProgress = $('<div class="progress-bar progress-bar-striped active" role="progressbar"></div>');
            setupProgressBar(book.progress, book.chapters, bookProgress, false);
            bar.append(bookProgress);
            progress.append(bar);
            progressWrapper.append(progress);
            status.append(progressWrapper);
            status.hover(function () {
                progressWrapper.show();
            }, function () {
                progressWrapper.hide();
            });
            bookInfo.append(status);
            $(rowId).append(bookInfo);
        })
    }

});