import fs from "fs";
const p="client/index.html";
let s=fs.readFileSync(p,"utf8");
if(s.includes("snaptr")){console.log("ALREADY");process.exit(0);}
const px=`  <!-- Snap Pixel Code -->
  <script type='text/javascript'>
  (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
  {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
  a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
  r.src=n;var u=t.getElementsByTagName(s)[0];
  u.parentNode.insertBefore(r,u);})(window,document,
  'https://sc-static.net/scevent.min.js');
  snaptr('init', '5505ec74-b68f-4cde-9f7d-fd406da1f869', {});
  snaptr('track', 'PAGE_VIEW');
  </script>
  <!-- End Snap Pixel Code -->
`;
if(!s.includes("</head>")){console.log("NO HEAD");process.exit(1);}
s=s.replace("</head>", px+"</head>");
fs.writeFileSync(p,s,"utf8");
console.log("PIXEL ADDED");
