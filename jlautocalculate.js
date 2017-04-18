/*
MIT License
Copyright (c) 2017 JavscriptLab https://github.com/JavscriptLab
*/
(function($) {
    $.fn.jlac = function(opt, callback) {
        if ($(this).length > 0) {
            $(this).each(function() {
                var t = $(this);
                t.attr('data-acinitialized', true);
                var stn = $.fn.jlac.defaults;
                stn.callback = callback;
                stn = $.extend(stn, opt);
                var expression = $(this).attr('data-ac');
                var statementsarray = $(this).attr('data-ac').split(/{|}/);
                var expressionelements = expression.replace(/[\(\)\+\-\*\/\%\|]/g, ',');
                expressionelements = expressionelements.replace(/\{.*?\}/g, '');
                expressionelements = expressionelements.replace(/,,+/g, ',')
                expressionelements = stn.trim(',', expressionelements);
                $('body').on(stn.event,expressionelements,function(e) {
                    var output = "";

                    t.trigger('beforeautocalculate', output);
                    $.each(statementsarray,function (si, s) {
                        var total = s;

                        var subexpression = s;
                        var subexpressionelements = subexpression.replace(/[\(\)\+\-\*\/\%]/g, ',');
                       // subexpressionelements = subexpressionelements.replace(/\{.*?\}/g, '');



                        subexpressionelements = subexpressionelements.replace(/,,/g, '');
                        subexpressionelements = stn.trim(',', subexpressionelements)

                        var elementsarray = subexpressionelements.split(',');
                        try {
                            /*each*/
                            if ($(subexpressionelements).length > 0) {
                                $(subexpressionelements).each(function(ei, v) {
                                    var value = 0;
                                    try {
                                        value = ($(this).val())
                                            ? parseFloat($(this).val()).toString() != 'NaN'
                                            ? parseFloat($(this).val())
                                            : 0
                                            : 0;
                                        if (value == 0) {
                                            value = ($(this).text())
                                            ? parseFloat($(this).text()).toString() != 'NaN'
                                            ? parseFloat($(this).text())
                                            : 0
                                            : 0;
                                        }

                                    } catch (e) {
                                    }
                                    if (((value)) || value == 0) {
                                        total = total.replace(elementsarray[ei], value);
                                    }
                                });
                                total = eval(total).toFixed(stn.fixedto);
                            }
                        } catch (e) {

                        }
                        /*each ends*/


                        output += total;
                    });
                    t.trigger('keyup', output);
                    t.trigger('afterautocalculate', output);
                    t.val(output);
                    t.text(output);
                    if (callback) {
                        callback(output);
                    }
                });

                $(expressionelements).trigger('keyup');
            });
        }
        return this;
    };
    $.fn.jlac.defaults = {
        event: "keyup blur change",
        fixedto:2,
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
