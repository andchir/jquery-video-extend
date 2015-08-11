# jQuery Video Extend
HTML5 Video Extend

 * Adding a logo.
 * Adding markers with labels.
 * Playing YouTube video.
 * Playing FLV video (basic support).
 * Simply make responsive.

[Demo](http://andchir.github.io/jquery-video-extend/)

``` html
<script src="js/jquery-2.1.4.min.js"></script>
<script src="js/jquery.video-extend.js"></script>
```

``` html
<script>
$(document).bind('ready',function(){
    
    $('#video1').videoExtend({
        logo: 'img/example_logo.png',
        logoLink: 'http://wdevblog.net.ru/',
        logoSize: [ 60, 40 ],
        markers: [
            {
                time: 39.32,// seconds
                text: 'Chapter 1'
            },
            {
                time: 350.23,
                text: 'Chapter 2'
            },
            {
                time: 470.88,
                text: 'Chapter 3'
            },
            {
                time: 677.82,
                text: 'Chapter 4'
            }
        ]
    });
    
});
</script>
```






