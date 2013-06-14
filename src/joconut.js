(function($){
  var isLocal = new RegExp('^(' + location.protocol + '\/\/' + location.host + '|\\.|\\/|[A-Z0-9_#])', 'i');
  
  $.expr[':'].local = function(el) {
    if(! el.attributes.href) return false;
    
    return isLocal.test(el.attributes.href.value);
  };
  
  var linkHandler = function(e) {
    e.preventDefault();
    
    get({
      url: $(this).attr('href'),
      history: true
    });
  };
  
  $.joconut = function() {
    var links = $('a:local');
    links.off('click', linkHandler);
    links.on('click', linkHandler);
  };
  
  $.joconut.listeners = {};
  
  $.joconut.emit = function(event, args) {
    if(! this.listeners[event]) return;
    
    this.listeners[event].forEach(function(listener){
      listener.apply(null, args);
    });
  };
  
  $.joconut.on = function(event, listener) {
    if(! this.listeners[event]) this.listeners[event] = [];
    
    this.listeners[event].push(listener);
  };
  
  $.joconut.loaded = { scripts: [], stylesheets: [] };
  
  $('script').each(function(){
    $.joconut.loaded.scripts.push($(this).attr('src'));
  });
  
  $('link[rel="stylesheet"]').each(function(){
    $.joconut.loaded.stylesheets.push($(this).attr('href'));
  });
  
  $.joconut.replace = function(response, callback) {
    var $container = $($.joconut.container),
        body;
    
    if($.joconut.container != 'body') {
      try {
        body = $(response).filter($.joconut.container).html();
        $container.html(body);
      } catch(err) {
        return $.joconut.emit('error', [err]);
      }
    } else {
      body = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(response);
      $container.html(body ? body[1] : response);
    }
    
    if(body) {
      var $head, tag, src, href;
      
      for(;;) {
        tag = /<script\b[^>]*><\/script>/gm.exec(response);
        
        if(! tag) break;
        
				src = /src\=.?([A-Za-z0-9-_.\/]+).?/.exec(tag[0]);
				
				if(! src) break;
				
				src = src[1]
				
				if(-1 == $.joconut.loaded.scripts.indexOf(src)) {
				  $.joconut.loaded.scripts.push(src);
				  if(! $head) $head = $('head');
				  $head.append(tag[0]);
				}
				
				response = response.replace(tag[0], '');
      }
      
      for(;;) {
        tag = /<link\b[^>]*\/?>/gm.exec(response);
        
        if(! tag) break;
        
        if(/rel\=.?stylesheet.?/.test(tag[0])) {
          href = /href\=.?([A-Za-z0-9\-_.\/:]+).?/.exec(tag[0]);
          
          if(! href) break;
          
          if(-1 == $.joconut.loaded.stylesheets.indexOf(href)) {
            $.joconut.loaded.stylesheets.push(href);
            
            if(! $head) $head = $('head');
            $head.append(tag[0]);
          }
        }
        
        response = response.replace(tag[0], '');
      }
      
      $('html, body').animate({ scrollTop: 0}, 'fast');
    }
    
    setTimeout(function(){
      if(callback) callback();
      $.joconut();
    }, 100);
  };
  
  var get = function(options, callback) {
    $.joconut.emit('before:new');
    $.ajax({
      url: options.url,
      type: 'GET',
      data: options.data,
      timeout: 5000,
      error: function(xhr, status) {
        if(callback) callback(xhr, status);
        $.joconut.emit('error', [xhr, status]);
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-PJAX', 'true');
      },
      success: function(response) {
        $.joconut.replace(response, function(){
          if(options.history) {
            History.pushState({
              url: options.url
            }, /<title>((.|\n\r])*)<\/title>/im.exec(response)[1], options.url);
          }
          
          if(callback) callback(null, response);
          $.joconut.emit('new');
          $.joconut.emit('after:new');
        });
      }
    })
  };
  
  History.Adapter.bind(window, 'statechange', function(){
    var state = History.getState();
    
    get({
      url: state.url,
      history: false
    });
  });
  
  $.joconut.container = 'body';
  
  $(function(){
    $.joconut();
  });
})(jQuery);