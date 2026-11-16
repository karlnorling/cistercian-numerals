import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./svg-DAJDcuDv.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r={title:`Cistercian Numerals/Gallery`,render:({from:e,count:n,step:r,size:i})=>{let a=document.createElement(`div`);a.style.cssText=`display:grid;grid-template-columns:repeat(auto-fill,minmax(${i*.6+24}px,1fr));gap:12px;width:min(90vw,960px);color:#24292f;font:12px ui-monospace,monospace`;for(let o=0;o<Math.min(n,500);o++){let n=e+o*r,s=document.createElement(`figure`);s.style.cssText=`margin:0;display:grid;justify-items:center;gap:4px`,s.innerHTML=t(n,{size:i})+`<figcaption>${n}</figcaption>`,a.append(s)}return a},args:{from:1,count:40,step:1,size:64},argTypes:{from:{control:`number`},count:{control:{type:`range`,min:1,max:500,step:1}},step:{control:`number`},size:{control:{type:`range`,min:32,max:160,step:4}}},parameters:{layout:`padded`,docs:{description:{component:`A run of numbers. Set **from**, **count** and **step**.`}}}},i={},a={args:{from:1,count:9,step:1,size:96}},o={args:{from:10,count:9,step:10,size:96}},s={args:{from:100,count:9,step:100,size:96}},c={args:{from:1e3,count:9,step:1e3,size:96}},l=[`Counting`,`Digits`,`Tens`,`Hundreds`,`Thousands`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    from: 1,
    count: 9,
    step: 1,
    size: 96
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    from: 10,
    count: 9,
    step: 10,
    size: 96
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    from: 100,
    count: 9,
    step: 100,
    size: 96
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    from: 1000,
    count: 9,
    step: 1000,
    size: 96
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{i as Counting,a as Digits,s as Hundreds,o as Tens,c as Thousands,l as __namedExportsOrder,r as default};