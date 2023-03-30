/*!
 * resizable 1.0.0 MODIFIED!
 * https://github.com/tannernetwork/resizable
 *
 * Copyright 2015 Tanner (http://tanner.zone)
 * Released under the MIT license
 */


        (function ($) {
            $.fn.resizable = function(options) {

                var settings = $.extend({
                    container: null,
                    direction: ['top', 'right', 'bottom', 'left'],
                    minWidth: 20,
                    minHeight: 20
                }, options);

                return this.each(function() {

                    var _this = this;
                    var element = $(this);

                    var isDragging = false;
                    var initial = {};
                    var prepareHandles = {
                        top: false,
                        right: false,
                        bottom: false,
                        left: false
                    };
                    var handles = {};

                    element.addClass('scxResizable');

                    if(settings.direction instanceof Array)
                    {
                        for (var i = settings.direction.length - 1; i >= 0; i--) {
                            switch(settings.direction[i])
                            {
                                case 'top':
                                case 't':
                                    prepareHandles.top = true;
                                    break;
                                case 'right':
                                case 'r':
                                    prepareHandles.right = true;
                                    break;
                                case 'bottom':
                                case 'b':
                                    prepareHandles.bottom = true;
                                    break;
                                case 'left':
                                case 'l':
                                    prepareHandles.left = true;
                                    break;
                            }
                        }
                    }
                    else if(typeof settings.direction == 'string')
                    {
                        switch(settings.direction)
                        {
                            case 'vertical':
                            case 'v':
                                prepareHandles.top = true;
                                prepareHandles.bottom = true;
                                break;
                            case 'horizontal':
                            case 'h':
                                prepareHandles.right = true;
                                prepareHandles.left = true;
                                break;
                            case 'top':
                            case 't':
                                prepareHandles.top = true;
                                break;
                            case 'right':
                            case 'r':
                                prepareHandles.right = true;
                                break;
                            case 'bottom':
                            case 'b':
                                prepareHandles.bottom = true;
                                break;
                            case 'left':
                            case 'l':
                                prepareHandles.left = true;
                                break;
                        }
                    }

                    if(prepareHandles.top)
                    {
                        handles.top = $('<div />').addClass('scxResizable-handle scxResizable-t').appendTo(element);
                    }
                    if(prepareHandles.right)
                    {
                        handles.right = $('<div />').addClass('scxResizable-handle scxResizable-r').appendTo(element);
                    }
                    if(prepareHandles.bottom)
                    {
                        handles.bottom = $('<div />').addClass('scxResizable-handle scxResizable-b').appendTo(element);
                    }
                    if(prepareHandles.left)
                    {
                        handles.left = $('<div />').addClass('scxResizable-handle scxResizable-l').appendTo(element);
                    }

                    $(this).children('.scxResizable-l, .scxResizable-r, .scxResizable-t, .scxResizable-b').mousedown(function(e) {
                        var dir;

                        switch(true)
                        {
                            case $(this).hasClass('scxResizable-l'):
                                dir = 'l';
                                break;
                            case $(this).hasClass('scxResizable-r'):
                                dir = 'r';
                                break;
                            case $(this).hasClass('scxResizable-t'):
                                dir = 't';
                                break;
                            case $(this).hasClass('scxResizable-b'):
                                dir = 'b';
                                break;
                        }
                        isDragging = true;
                        initial = {
                            x: e.clientX,
                            y: e.clientY,
                            height: element.height(),
                            width: element.width(),
                            direction: dir,
                            left: element.position().left
                        };

                        $('html').addClass('scxResizable-resizing scxResizable-resizing-'+initial.direction);

                        if (typeof options.start === 'function') {
                            options.start.apply(_this);
                        }
                    });

                    if (settings.container == null) {
                        settings.container = $(window);
                    }

                    element.css({
                        minWidth: settings.minWidth,
                        minHeight: settings.minHeight,
                        maxHeight: settings.container.height(),
                        maxWidth: settings.container.width()
                    });

                    settings.container
                        .mousemove(function(e) {
                            resize(e);
                        })
                        .mouseup(function(e) {
                            stop();
                        })
                        .mouseleave(function(e) {
                            resize(e);
                            stop();
                        });

                    function resize(e) {
                        if(isDragging)
                        {
                            var moveX = e.clientX-initial.x;
                            var moveY = e.clientY-initial.y;
                            var container = {
                                width: settings.container.width(),
                                left: settings.container.position().left
                            };

                            switch(initial.direction)
                            {
                                case 'r':
                                    // Prevent of go out of container
                                    if (initial.left + initial.width + moveX > settings.container.width()) {
                                        moveX = settings.container.width() - (initial.left + initial.width)
                                    }

                                    element.width(initial.width + moveX);
                                    break;
                                case 'l':
                                    // Prevent of go out of container
                                    if (initial.left + moveX < 0) {
                                        moveX = -initial.left;
                                    } else if (initial.width - moveX >= settings.minWidth) {
                                        element.width(initial.width - moveX);
                                        element.css('left', initial.left + moveX);
                                    }
                                    break;
                                case 'b':
                                    element.height(initial.height + moveY);
                                    break;
                                case 't':
                                    element.height(initial.height - moveY);
                                    break;
                            }

                            if (typeof options.resize === 'function') {
                                options.resize.apply(_this);
                            }
                        }
                    }

                    function stop() {
                        if(isDragging)
                        {
                            isDragging = false;
                            $('html').removeClass('scxResizable-resizing scxResizable-resizing-'+initial.direction);

                            if (typeof options.stop === 'function') {
                                options.stop.apply(_this);
                            }
                        }
                    }
                });
            }
        }(window.jQuery));




