(function($) {
    $.fn.jlac = function(opt,callback) {
        if ($(this).length > 0) {
            $(this).each(function() {
                var t = $(this);
                t.attr('data-acinitialized', true);
                var stn = $.fn.jlac.defaults;
                stn.callback = callback;
                stn = $.extend(stn, opt);
                var expression = $(this).attr('data-ac');
                var expressionelements = expression.replace(/[\(\)\+\-\*\/\%]/g, ',');
                expressionelements = stn.trim(',', expressionelements).replace(/,,/g, '');
                var elementsarray = expressionelements.split(',');
                $(expressionelements).keyup(function(i, v) {
                    var total = expression;
                    t.trigger('beforeautocalculate', total);
                    $(expressionelements).each(function(i, v) {
                        var value = 0;
                        try {
                            value = ($(this).val()) ? parseFloat($(this).val()) : 0;
                        } catch (e) {
                        }
                        if ((value) || value == 0) {
                            total = total.replace(elementsarray[i], value);
                        }
                        
                    });
                    total = eval(total);
                    t.trigger('keyup', total);
                    t.val(total);
                    t.trigger('afterautocalculate', total);
                    if (callback) {
                        callback(total);
                    }
                });
            });
        }
        return this;
    };
    $.fn.jlac.defaults = {
        trim: function(char, str) {
            if (str.slice(0, char.length) === char) {
                str = str.substr(1);
            }
            if (str.slice(str.length - char.length) === char) {
                str = str.slice(0, -1);;
            }
            return str;
        }
    }
    $(document).ready(function() {
        $('[data-ac]').jlac();
        $(document).on('DOMNodeInserted',
            function(event) {
                $('[data-ac]:not("[data-acinitialized]")').jlac();
            });
    });
})(jQuery);
