var Hexa={encode:function(e){let r,t,n="";for(t=0;t<e.length;t++)n+=("\\u00"+(r=e.charCodeAt(t).toString(16))).slice(-6);return n},decode:function(e){let r,t=e.match(/.{1,4}/g)||[],n="";for(r=1;r<t.length;r++)n+=String.fromCharCode(parseInt(t[r],16));return n},stringEncode:function(e){let r=[];for(let t=0,n=e.length;t<n;t++){let o=Number(e.charCodeAt(t)).toString(16);r.push(o)}return r.join("")},stringDecode:function(e){str1.toString();for(var r="",t=0;t<e.length;t+=2)r+=String.fromCharCode(parseInt(e.substr(t,2),16));return r}},random={string:function(e){let r="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=t.length,o=0;for(;o<e;)r+=t.charAt(Math.floor(Math.random()*n)),o+=1;return r}};JSON.encode=function(e){return JSON.stringify(function e(r){if(!r&&0!==r&&!1!==r)return`:|:|:${random.string(35)}:|:|:null:|:|:`;if("object"!==typeof r)return r;let t=Array.isArray(r),n=t?[]:{},o;for(o in r)switch(typeof r[o]){case"object":n[t?o:Hexa.encode(o)]=e(r[o]);break;case"string":n[t?o:Hexa.encode(o)]=`:|+|:${random.string(35)}:|+|:${Hexa.encode(r[o])}|:|+|:`;break;default:n[t?o:Hexa.encode(o)]=Number.isNaN(r[o])||0!==r[o]&&!r[o]?`:|:|:${random.string(35)}:|:|:null:|:|:`:`:|:|:${random.string(35)}:|:|:${r[o]}:|:|:`}return n}(e)).replace(/\\\\/g,"\\").replace(/\"\:\|\:\|\:([a-zA-z0-9]{35})\:\|\:\|\:((?:\-|)\d+(?:([eE](?:\-|)\d+)|(\.\d+)|)|true|false|null)\:\|\:\|\:\"/g,"/*$1*/$2").replace(/\":\|\+\|:([\w\d]{1,50}):\|\+\|:((\\u[\w\d]{4})+?)\|:\|\+\|:\"/gm,'/*$1*/"$2"')+"{}"},JSON.decode=function(e){return(e=>{let r=e.match(/\\u[0-9A-F]{4}/g)||[];for(let t of r)e=e.replace(t,Hexa.decode(t));let n=e.match(/\/\*[A-Za-z0-9\+\/\=]+?\*\//g)||[];for(let o of n)e=e.replace(o,`"${Hexa.decode(o.slice(2).slice(0,-2))}"`);return e})(e)},JSON.decode=function(e){return JSON.parse((e=>{e=e.replace(/\/\*[a-zA-z0-9]+\*\//g,"");let r=e.match(/\\u[a-fA-f0-9]{4}/g);for(let t of r)e=e.replace(t,Hexa.decode(t));return e.slice(0,-2)})(e))};

let global_scope, devc = 0;

async function file_upload(ele) {
    const reader = new FileReader();
    reader.addEventListener('load', ({target: {result}}) => {
        editor.setValue(result)
    });
    reader.readAsText(ele.files[0]);
}

const onSubmit = () => {
    const data = editor.getValue().replace(/(\/\*[\w\W]+?\*\/)|(\/\/[\w\W]+?\n)|(\n\/\/[\w\W]+?\n)/gm, "").replace(/\n/g, "").trim();
    try {
       JSON.parse(data);
    } catch (e) {
        _("out-label").innerHTML = `<label sytle="color:red">Invalid input json</label>`;
        console.log(e);
        return;
    }
    global_scope = JSON.encode(JSON.parse(data));
    editor.setValue(global_scope);
    _("out-label").innerHTML = `
    <label>You can <u onclick="coppyToClipboard()">coppy it to clipboard</u> or <u onclick="saveJsonFile(&#34;obfucate.json&#34;, global_scope)"> download file</u></label>`;
},
devMode = () => {
    if (devc > -1 && (devc++) > 10) {
        devc = -2;
        alert("Now you in developer mode!");
        eruda.init({
            tool: ['console', 'elements', 'network', 'resources', 'info']});
        eruda.get().config.set('displaySize', 60);
        eruda.scale(0.6);
        eruda.position({
            x: 10, y: 10
        });
        eruda.remove('settings');
    }
},
saveJsonFile = (name, data) => {
    const blob = new Blob(
        [global_scope],
        {type: "text/json;charset=UTF-8"}
    ),
    link = document.createElement("a");
    link.download = name;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json",link.download,link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
    });
    link.dispatchEvent(evt);
    link.remove();
},
coppyToClipboard = (text = global_scope) => navigator.clipboard.writeText(text);