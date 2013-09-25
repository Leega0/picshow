$(document).ready(function(){        

    //Canvas support check for Ken Burns effect
    var isSupportingCanvas = !!document.createElement('canvas').getContext;  
    //remove zoom on ipad even if canvas is handled
    var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
    if (isiPad)
        isSupportingCanvas=false;

    /*
     * Pictures slider
     */
    var teaserSlider2;
    var imageStateArray=new Array();
    var $imagesArray=$('#picture-slider .slideshow div img');
    var $slideshow = $('#picture-slider .slideshow');
    var started = false;
    var duration=9000, align='center', zoom=1.2;
    var defaultSettings = {
        'width':  962,
        'height': 640,
        'duration': duration,
        'align': align,
        'zoom': zoom        
    };
    var nextSlideTimer = false;
    
    //starts effect
    function startEffect(slideIndex){

        if(isSupportingCanvas){
            
                var customAlign;
                var customZoom;
            
                switch(slideIndex+1){
                    case 1:
                        customAlign='right'; 
                        break;
                    case 2:
                        customAlign='center';
                        zoom='1.1';
                        break;
                    case 3:
                        customAlign='left';
                        break;
                    case 4:
                        customAlign='top';
                        break;
                    case 5:
                        customAlign='center';
                        break;
                    case 6:
                        customAlign='right';
                        break;                  
                }

                var settings = {
                  'duration': duration,
                  'width':  962,
                  'height': 640,
                  'align': (customAlign != undefined ) ? customAlign : align,
                  'zoom': (customZoom != undefined ) ? customZoom : zoom
                };    
                if(imageStateArray[slideIndex-1] != undefined){
                    imageStateArray[slideIndex-1]="setted";
                    $('#picture-slider .slideshow div img').eq(slideIndex-1).kenburns("set", settings);
                }
        }
        
        nextSlideTimer = setTimeout(function(){
            if(teaserSlider2.getSlideCount() == slideIndex){
                teaserSlider2.goToSlide(0);
//                console.log("> goto back to first slide");
            }else{
//                console.log("> goto next slide");
                teaserSlider2.goToNextSlide();
            }
                
        }, duration);

        return;
    }
    
    function startSlideshow() {
        if($('#picture-slider').size() > 0){        
            //init default ken burns on all imgs
            if(isSupportingCanvas){
                $imagesArray.kenburns(defaultSettings);    
            }
            teaserSlider2 = $('#picture-slider .slideshow').bxSlider({
                infiniteLoop: true,
                controls: false,
                displaySlideQty: 1,
                moveSlideQty: 1,
                pager: true,
                autoPlay: !isiPad, //no autoplay on ipad
                pagerSelector: '#picture-slider .pp-paging ul',
                onAfterSlide: function(index){
                    if(nextSlideTimer)
                        clearTimeout(nextSlideTimer);
                    
                    startEffect(index+1);
                },
                onBeforeSlide: function(index){
                    $('#picture-slider .slideshow div img').eq(index+1).kenburns("reset");
                }
            });
            
            if(teaserSlider2.getSlideCount() == 1){
                $('#picture-slider .bubble-paging').hide();
            }
    
            if(!$.browser.msieLTE7){
    
                $('#picture-slider .slideshow').swipe( {
                    swipeLeft:function(event, direction, distance, duration, fingerCount) {
                        teaserSlider2.goToNextSlide();
                    },
                    swipeRight:function(event, direction, distance, duration, fingerCount) {
                        teaserSlider2.goToPreviousSlide();
                    },
                    excludedElements:[],
                    threshold:0
                });
            }
        }
    }
    
    $(window).scroll( function() {
        if (started) { return };
    	var offset = $slideshow.offset();
    	var scrollTop = $(window).scrollTop();
    	var window_height = $(window).height();
    	if (scrollTop + window_height > offset.top + 100
            && offset.top + 640 > scrollTop + 100 ) {
            started = true;
            startSlideshow();                 
        }
    });
    
});