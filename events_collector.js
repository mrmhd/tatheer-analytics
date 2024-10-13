function tatheerAnalytics(w, d, tatheerClientId, eventName, eventParameters) {
  function s(){
      try{
        var x=new XMLHttpRequest();
        x.open('POST','https://tatheer.app/link/events_collector.php',true);
        x.setRequestHeader('Content-Type','application/json');
        x.timeout = 3000;
        x.ontimeout = x.onerror = function(){
          x.abort();
          console.error('Tatr Analytics Error : Request failed or timed out');
        };
        var urlParams = new URLSearchParams(w.location.search);
        var urlParamsObject = Object.fromEntries ? Object.fromEntries(urlParams) : {};
        if (!Object.fromEntries) {
          urlParams.forEach(function(value, key) {
            urlParamsObject[key] = value;
          });
        }

        var tatheerClickId = urlParams.get('tatheer_cid');
        if (tatheerClickId) {
            d.cookie = "tatheer_cid=" + tatheerClickId + "; path=/; max-age=2592000"; // 30 days expiry
        } else {
            var cookies = d.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              if (cookie.indexOf('tatheer_cid=') === 0) {
                tatheerClickId = cookie.substring('tatheer_cid='.length, cookie.length);
                break;
              }
            }
        }
        var userAgent = w.navigator.userAgent;
        x.send(JSON.stringify({
          client_id: tatheerClientId,
          click_id: tatheerClickId,
          page_url: w.location.href,
          page_referrer: d.referrer,
          page_title: d.title,
          event_name: eventName,
          event_parameters: {
            "urlParams": urlParamsObject,
            "userAgent": userAgent, // Add user agent to event parameters
            ...eventParameters
          }
        }));
      }catch(e){
        console.error('Tatr Analytics Error : ', e);
      }
  }
    if(w.requestIdleCallback){
      w.requestIdleCallback(s);
    }else{
      setTimeout(s,1);
    }
}(window,document);