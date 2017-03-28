// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.mainNav a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('#menu-toggle').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('open');
        $('#search').removeClass('open');
        
        $('#menu').toggleClass('open');

        if ($('#menu').hasClass('active')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'visible');
        }
    });

    $('#seacrh-toggle a').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('open');

        $('#menu').removeClass('open');
        $('#menu-toggle').removeClass('open');
        $('#search').toggleClass('open');

        $('#serch-input').focus();
        var val = $('#serch-input').val();
        $('#serch-input').val('');
        $('#serch-input').val(val);

        if ($('#menu').hasClass('active')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'visible');
        }
    });


    $('.tabs-nav a').click(function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        $('.tabs-nav a').removeClass('active');
        $(this).addClass('active');
        $('.tab').hide();
        $(target).fadeIn('slow');
    });

    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });


    /*---------------------------
                                  Scroll
    ---------------------------*/
    if ( exist('.scroll') ) {
        $('.scroll').mCustomScrollbar({
            axis:"y",
            theme: 'dark-thick'
        });
    } 



    /*---------------------------
                                  Sliders
    ---------------------------*/
    $('.products-logos').slick({
        arrows: false,
        dots: false,
        autoplay: true,
        slidesToShow: 7,
        slidesToScroll: 1
    });

    $('.offer__slider').slick({
        arrows: false,
        dots: false,
        autoplay: true,
        fade: true,
        asNavFor: '.slider-nav'
    });

    $('.slider-nav').slick({
        slidesToShow: 6,
          slidesToScroll: 1,
          asNavFor: '.offer__slider',
          dots: false,
          arrows: true,
          focusOnSelect: true,
          responsive: [
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 400,
              settings: {
                slidesToShow: 2,
              }
            }
          ]
    });


    $('.product-main-slider').slick({
        arrows: false,
        dots: false,
        fade: true,
        asNavFor: '.product-thumbnails-slider'
    });

    $('.product-preview').on('click', function(event) {
        event.preventDefault();
        var product_popup = $(this).attr('href');
        if ( exist( product_popup ) ) {
            $(product_popup).addClass('active');
        } 
    });

    $('.close-popup').on('click', function(event) {
        event.preventDefault();
        $('.product-popup').removeClass('active');
    });

    function re_height() {
        var height = $('.product-thumbnails-slider').height();
        $('.product-thumbnails-slider').find('.slide').height(height/4);
        $('.product-thumbnails-slider').find('.slick-list').height(height);
    }
    $('.product-thumbnails-slider').on('init', function(event, slick) {
        event.preventDefault();
        re_height();
    });
    
    $('.product-thumbnails-slider').slick({
        arrows: true,
        dots: false,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: '.product-main-slider'
    });

    $('.product-popup').each(function(index, el) {
        var main_slider = $(this).find('.product-main-slider');
        var thumbnail_slider = $(this).find('.product-thumbnails-slider');
        main_slider.slick('slickSetOption', 'asNavFor', thumbnail_slider, true);
        thumbnail_slider.slick('slickSetOption', 'asNavFor', main_slider, true);
    });

    $(window).on('resize', function(event) {
        event.preventDefault();
        re_height();
        $('.product-thumbnails-slider').slick('setPosition');
    });
    


    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }

    $('.form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*Google map init*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 17,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Чисто Строй"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file