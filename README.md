# jQuery Video Extend
HTML5 Video Extend

 * Adding a logo.
 * Adding markers with labels.
 * Playing YouTube video.
 * Playing FLV video (basic support).
 * Simply make responsive.

![](http://andchir.github.io/jquery-video-extend/img/screenshot.png)

[Wiki](https://github.com/andchir/jquery-video-extend/wiki)

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
        logoLink: 'http://example.com/',
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

``` html
<video id="video1" width="640" height="360" poster="video/Sintel_poster.png" controls>
    <source src="video/Sintel.mp4" type="video/mp4">
</video>
```

###Another way:

``` html
<video width="640" height="360" data-logo="img/example_logo.png" data-markers='[{"time":39,"text":"Chapter 1"},{"time":350,"text":"Chapter 2"}]'>
    <source src="video/Sintel.mp4" type="video/mp4">
</video>
```
Any parameters can be specified by a prefix "data-". The array must be JSON string.
