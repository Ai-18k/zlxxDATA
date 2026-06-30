const {
    getPrivateProp,
    setPrivateProp,
    originParseInt
} = require("../../utility.js");
const URLSearchParams = require("../api/URLSearchParams.js");

function updateUrl(obj, name, value){
    const urlInfo = {
        protocol: getPrivateProp(obj, 'protocol'),
        origin: getPrivateProp(obj, 'origin'),
        hostname: getPrivateProp(obj, 'hostname'),
        host: getPrivateProp(obj, 'host'),
        port: getPrivateProp(obj, 'port'),
        pathname: getPrivateProp(obj, 'pathname'),
        search: getPrivateProp(obj, 'search'),
        hash: getPrivateProp(obj, 'hash'),
        username: getPrivateProp(obj, 'username'),
        password: getPrivateProp(obj, 'password'),
        href: getPrivateProp(obj, 'href')
    }

    //href不存在无论设置什么属性都是空字符（除了protocol）
    if(!urlInfo.href){
        setPrivateProp(obj, name, name === 'protocol'? ':':'');
        return true;
    }

    //如果属性值不一样，则修改href
    value = value.toString() || '';
    if(urlInfo[name] !== value){

        if(name === 'protocol'){
            //如果属性是protocol，且值符合protocol属性值，则修改protocol
            if(/^(http|https):?/.test(value)){
                urlInfo.protocol = value.includes(':')? value:`${value}:`;
                //协议改变需要修改origin
                urlInfo.origin = `${urlInfo.protocol}//${urlInfo.host}`;
                setPrivateProp(obj, 'origin', urlInfo.origin);
            }
        }else if(name === 'port'){
            if(/^\d{1,4}\D+$/.test(value)){
                urlInfo.port = originParseInt(value).toString();
            }else if(value && !(/^\d{1,4}$/.test(value))){
                urlInfo.port = urlInfo.port || '';
            }else{
                urlInfo.port = value;
            }
            if(urlInfo.port === '443' && urlInfo.protocol === 'https:'){
                urlInfo.port = '';
            }
            //协议改变需要修改origin
            urlInfo.host = urlInfo.port === ''? urlInfo.hostname:`${urlInfo.hostname}:${urlInfo.port}`;
            urlInfo.origin = `${urlInfo.protocol}//${urlInfo.host}`;
            setPrivateProp(obj, 'host', urlInfo.host);
            setPrivateProp(obj, 'origin', urlInfo.origin);
        }else{
            urlInfo[name] =  value;
        }

        //如果urlInfo.pathname值中‘/’不在第一个，则拼接‘/’，如果值不存在则默认‘/’
        if(name === 'pathname' && urlInfo.pathname.indexOf('/') !== 0){
            urlInfo.pathname = `/${value}`;
            setPrivateProp(obj, 'pathname', urlInfo.pathname);
        }

        //如果urlInfo.hash存在，且‘#’不在第一个，则拼接‘#’，与pathname不同的是，如果值不存在则没有默认值
        if(name === 'hash' && urlInfo.hash && urlInfo.hash.indexOf('#') !== 0){
            urlInfo[name] = `#${urlInfo.hash}`;
            setPrivateProp(obj, 'hash', urlInfo.hash);
        }

        if(name === 'search'){
            urlInfo.origin = '';
            setPrivateProp(obj, 'origin ',  urlInfo.origin);
            if(!urlInfo.search || urlInfo.search === '?'){
                urlInfo.search = '';
            }
            //如果urlInfo.search中值存在，且‘?’不在第一个，则则拼接‘#’
            urlInfo.search = !urlInfo.search || urlInfo.search.indexOf('?') === 0? urlInfo.search:`?${urlInfo.search}`;
            //如果searchParams存在则更新searchParams（URL对象）
            if('searchParams' in obj){
                setPrivateProp(obj, 'searchParams', new URLSearchParams(urlInfo.search?.split('?')[1]));
            }
        }

        let href = `${urlInfo.protocol}//${urlInfo.host}${urlInfo.pathname}${urlInfo.search}${urlInfo.hash}`;
        if(name === 'username' || name === 'password' || urlInfo.username || urlInfo.password){
            href = `${urlInfo.protocol}//${urlInfo.username}${urlInfo.password? `:${urlInfo.password}`:urlInfo.password}@${urlInfo.host}${urlInfo.pathname}${urlInfo.search}${urlInfo.hash}`;
        }
        setPrivateProp(obj, 'href', href);
        setPrivateProp(obj, name, urlInfo[name]);
    }

    return true;
}

module.exports = updateUrl;