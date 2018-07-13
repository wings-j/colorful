/**
 * @name ServiceWorker
 */

/*成员*/

const Version='1.0';
const FileList=
[
    './index.html',
    './Index.js',
    './image/ColorMask.png',
    './image/ColorWheel.png'
];

/*构造*/


self.addEventListener('install',function(ev)     //缓存
{
    ev.waitUntil(caches.open(Version).then(function(cache) 
    {
        return cache.addAll(FileList);
    }));
});
self.addEventListener('activate',function(ev)       //更新缓存
{
    ev.waitUntil(caches.keys().then(function(cacheNames) 
    {
        return Promise.all(cacheNames.map(function(cacheName)
        {
            if(cacheName !== Version)      //如果当前版本和缓存版本不一致
                return caches.delete(cacheName);
        }));
    }));
});
self.addEventListener('fetch',function(ev)      //捕获请求并返回缓存数据
{
    ev.respondWith(caches.match(ev.request).catch(function()
    {
        return fetch(ev.request);
    }).then(function(response)
    {
        caches.open(Version).then(function(cache)
        {
            cache.put(ev.request,response);
        });

        return response.clone();
    }).catch(function(){}));
});