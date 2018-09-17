/**
 * @name ServiceWorker
 */

/*成员*/

const Version='1.3';        //更新文件时修改版本号
const FileList=
[
    './index.html',
    './Index.js',
    './Manifest.json',
    './image/ColorMask.png',
    './image/ColorWheel.png',
    './image/Favicon.png'
];

/*构造*/

self.addEventListener('install',function(ev)     //缓存
{
    ev.waitUntil(caches.open(Version).then(function(cache)      //waitUntil用于等待脚本安装过程
    {
        return cache.addAll(FileList);
    }));

    self.skipWaiting();
});
self.addEventListener('activate',function(ev)       //更新缓存
{
    ev.waitUntil(caches.keys().then(function(cacheNames) 
    {
        return Promise.all(cacheNames.map(function(cacheName)
        {
            if(cacheName!==Version)      //如果当前版本和缓存版本不一致
                return caches.delete(cacheName);
        }));
    }));
});
self.addEventListener('fetch',function(ev)      //捕获请求并返回缓存数据
{
    ev.respondWith(caches.match(ev.request).catch(function()        //查询缓存是否存在
    {
        return fetch(ev.request);       //从网络中获取数据
    }).then(function(response)
    {
        caches.open(Version).then(function(cache)
        {
            cache.put(ev.request,response);     //更新缓存
        });

        return response.clone();
    }).catch(function(){}));
});