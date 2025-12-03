const user="SEU_USER";
const repo="SEU_REPO";

function formatSize(bytes){
 if(!bytes)return "-";
 const units=["B","KB","MB","GB"];
 let i=0;
 while(bytes>=1024&&i<units.length-1){bytes/=1024;i++;}
 return bytes.toFixed(1)+" "+units[i];
}

function load(path=""){
 fetch(`https://api.github.com/repos/${user}/${repo}/contents/${path}`)
 .then(r=>r.json())
 .then(data=>render(path,data));
}

function render(path,items){
 document.getElementById("breadcrumb").innerHTML = path.split("/")
 .map((p,i,arr)=>`<a href="?p=${arr.slice(0,i+1).join("/")}">${p||"root"}</a>`)
 .join(" / ");

 const body=document.getElementById("file-body");
 body.innerHTML="";

 items.forEach(i=>{
  const tr=document.createElement("tr");
  const icon= i.type==="dir" ? "📁" : "📄";
  tr.innerHTML = `
   <td>${icon} <a href="${ i.type==="dir" ? '?p='+i.path : i.download_url }">${i.name}</a></td>
   <td>${formatSize(i.size)}</td>
   <td>${i.type}</td>
   <td>${i.sha.substring(0,6)}</td>
   <td><a href="${i.download_url}">⬇️</a></td>`;
  body.appendChild(tr);
 });
}

const url=new URL(window.location.href);
load(url.searchParams.get("p")||"");