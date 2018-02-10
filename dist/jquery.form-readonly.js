/*!
 * jquery-form-readonly v0.1.0
 * https://mozq.github.io/jquery-form-readonly/
 * 
 * Copyright (c) 2018 Mozq
 * 
 * Released under the MIT License:
 * https://raw.githubusercontent.com/mozq/jquery-form-readonly/master/LICENSE
 */
'use strict';
(function ($) {
  $.fn.formReadonly = function(options) {
    var readonly = !(typeof options === 'boolean' && !options);
    
    if (readonly) {
      var settings = $.extend({}, $.fn.formReadonly.defaults, options);
      
      inputToReadonly(settings, this.filter('input'));
      textareaToReadonly(settings, this.filter('textarea'));
      selectToReadonly(settings, this.filter('select'));
      
      inputToReadonly(settings, this.find('input'));
      textareaToReadonly(settings, this.find('textarea'));
      selectToReadonly(settings, this.find('select'));
    } else {
      show(this.filter('.formreadonly-origin')).removeClass('formreadonly-origin');
      this.filter('.formreadonly-ro-value').remove();
      show(this.filter('.formreadonly-ro-label')).removeClass('formreadonly-ro-label');
      
      show(this.find('.formreadonly-origin')).removeClass('formreadonly-origin');
      this.find('.formreadonly-ro-value').remove();
      show(this.find('.formreadonly-ro-label')).removeClass('formreadonly-ro-label');
    }
    
    return this;
  };
  
  $.fn.formReadonly.defaults = {
    multipleSeparator: ', ', // for multiple
    passwordMaskChar: '*', // for password
    passwordMaskLength: -1, // for password
    useLabel: false, // for checkbox, radio
    includesReadonly: false,
    includesDisabled: false,
    excludes: null, // function ($elm) { return false; },
  };
  
  
  function excludesElement(settings, $elm) {
    if ($elm.hasClass('formreadonly-origin')) {
      return true;
    }
    
    if ($elm.hasClass('formreadonly-ro-value')) {
      return true;
    }
    
    if ($elm.is(':hidden')) {
      return true;
    }
    
    if (!settings.includesReadonly) {
      if ($elm.prop('readonly')) {
        return true;
      }
    }
    
    if (!settings.includesDisabled) {
      if ($elm.prop('disabled')) {
        return true;
      }
      
      if (0 < $elm.closest('.disabled').length) {
        // for Bootstrap
        return true;
      }
    }
    
    if (settings.excludes && settings.excludes($elm)) {
      return true;
    }
    
    return false;
  }
  
  
  function inputToReadonly(settings, $elms) {
    $elms.each(function () {
      var $elm = $(this);
      
      if (excludesElement(settings, $elm)) {
        return;
      }
      
      var type = $elm.prop('type').toLowerCase();
      if (type === 'password') {
        var len = (0 <= settings.passwordMaskLength) ? settings.passwordMaskLength : $elm.val().length;
        var masked = repeat(settings.passwordMaskChar, len);
        
        toReadonlyElement($elm, masked);
      } else if (type === 'radio' || type === 'checkbox') {
        var $label = findLabel($elm);
        if (settings.useLabel && $label !== null) {
          toReadonlyLabel($elm, $label, $elm.prop('checked'));
        } else {
          var $dispElm = $('<input>')
              .attr('type', type)
              .prop('checked', $elm.prop('checked'))
              .prop('disabled', true);
          toReadonlyElement($elm, $dispElm);
        }
      } else if (type === 'file') {
        var files = $elm.prop('files');
        
        var $names = $('<span>');
        for (var i = 0; i < files.length; i++) {
          var name = files[i].name;
          if (name.normalize) {
            name = name.normalize('NFC');
          }
          
          if (0 < i) {
            var sep = settings.multipleSeparator;
            if (sep instanceof $) {
              sep = sep.clone();
            }
            append($names, sep);
          }
          
          append($names, name);
        }
        
        toReadonlyElement($elm, $names);
      } else if (type === 'hidden') {
        // NOP
      } else if (type === 'button' || type === 'submit' || type === 'image' || type === 'reset') {
        // NOP
      } else {
        toReadonlyElement($elm, $elm.val());
      }
    });
  }
  
  function textareaToReadonly(settings, $elms) {
    $elms.each(function () {
      var $elm = $(this);
      
      if (excludesElement(settings, $elm)) {
        return;
      }
      
      toReadonlyElement($elm, $elm.val());
    });
  }
  
  function selectToReadonly(settings, $elms) {
    $elms.each(function () {
      var $elm = $(this);
      
      if (excludesElement(settings, $elm)) {
        return;
      }
      
      var $labels = $('<span>');
      $elm.find('option:selected').each(function (i) {
        var $opt = $(this);
        
        var label = $opt.attr('label');
        if (!label) {
          label = $opt.text();
        }
        
        if (0 < i) {
          var sep = settings.multipleSeparator;
          if (sep instanceof $) {
            sep = sep.clone();
          }
          append($labels, sep);
        }
        append($labels, label);
      });
      
      toReadonlyElement($elm, $labels);
    });
  }
  
  function toReadonlyElement($elm, newElm) {
    $elm.addClass('formreadonly-origin');
    hide($elm);

    if (typeof newElm === 'string') {
      newElm = $('<span>')
          .css('white-space', 'pre')
          .text(newElm);
    }
    
    newElm = $('<span>').addClass('formreadonly-ro-value').append(newElm);
    $elm.after(newElm);
  }
  
  function toReadonlyLabel($elm, $label, showLabel) {
    var $target = $elm.closest('.form-check'); // for Bootstrap
    if ($target.length === 0) {
      $target = $label;
    }
    
    $elm.addClass('formreadonly-origin');
    hide($elm);
    
    $target.addClass('formreadonly-ro-label');
    if (showLabel) {
      show($target);
    } else {
      hide($target);
    }
  }
  
  function findLabel($elm) {
    var id = $elm.attr('id');
    if (id) {
      var $label = $('label[for="' + id + '"]');
      if ($label.length) {
        return $label;
      }
    }
    
    var $parentLabel = $elm.closest('label');
    if ($parentLabel.length) {
      return $parentLabel;
    }
    
    return null;
  }
  
  function hide($elms) {
    $elms.each(function () {
      var $elm = $(this);
      
      var display = $elm.css('display');
      if (!display) {
        display = '';
      }
      $elm.data('formreadonly-prev-display', display);
      $elm.css('display', 'none');
    });
    
    return $elms;
  }
  
  function show($elms) {
    $elms.each(function () {
      var $elm = $(this);
      
      var display = $elm.data('formreadonly-prev-display');
      if (!display) {
        display = '';
      }
      $elm.css('display', display);
      $elm.removeData('formreadonly-prev-display');
    });
    
    return $elms;
  }
  
  function append($elm, content) {
    if (!content) {
      // NOP
    } else if (typeof content === 'string') {
      $elm.append($("<span>").text(content));
    } else {
      $elm.append(content);
    }
    
    return $elm;
  }
  
  function repeat(str, count) {
    var s = '';
    for (var i = 0; i < count; i++) {
      s += str;
    }
    return s;
  }
})(jQuery);
