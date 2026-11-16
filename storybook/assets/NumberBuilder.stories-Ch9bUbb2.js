import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./svg-DAJDcuDv.js";function r({value:e,title:n,...r}){let i=document.createElement(`div`);i.style.color=`#24292f`;try{let{color:a,background:o,...s}=r;i.innerHTML=t(e,{...s,...a?{color:a}:{},...o?{background:o}:{},...n?{title:n}:{}})}catch(e){i.setAttribute(`role`,`alert`),i.style.color=`#c92a2a`,i.style.fontFamily=`system-ui, sans-serif`,i.textContent=e.message}return i}var i,a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i={title:`Cistercian Numerals/Number Builder`,render:r,args:{value:`1993`,size:200,strokeWidth:4,gap:20,padding:10,linecap:`round`,color:`currentColor`,background:void 0,title:``},argTypes:{value:{control:`text`,description:`Any decimal number: whole, fractional, negative or very large. Passed as a string so every digit is kept.`},size:{control:{type:`range`,min:24,max:480,step:4}},strokeWidth:{control:{type:`range`,min:.5,max:16,step:.5}},gap:{control:{type:`range`,min:0,max:80,step:2}},padding:{control:{type:`range`,min:0,max:40,step:1}},linecap:{control:`inline-radio`,options:[`round`,`square`,`butt`]},color:{control:`text`,description:"A CSS colour, or a gradient: `linear-gradient(to right, red, blue)`, `radial-gradient(…)` or their `repeating-` forms."},background:{control:`text`,description:`A colour or a gradient, as for **color**. Empty for transparent.`},title:{control:`text`,description:`Accessible name. Leave empty to use the number.`}},parameters:{docs:{description:{component:"Type any number in the **value** control and adjust the style. Every control maps to a `toSvg` option."}}}},a={},o={args:{value:`1234567890`},parameters:{docs:{description:{story:`One glyph per four digits.`}}}},s={args:{value:`3.14159`},parameters:{docs:{description:{story:`A dot, then the fraction in groups of four from the point.`}}}},c={args:{value:`-42`},parameters:{docs:{description:{story:`A bar across the middle of the first stem.`}}}},l={args:{value:`0`}},u={args:{value:`2026`,color:`#7a2e0e`,background:`#f6efe3`,strokeWidth:6,linecap:`square`,padding:20}},d={args:{value:`123456789`,strokeWidth:6,color:`linear-gradient(to right, #e03131, #f76707, #fab005, #40c057, #228be6, #7048e8, #be4bdb)`},parameters:{docs:{description:{story:`A linear gradient spans the whole image, so a long number runs through every colour.`}}}},f={args:{value:`2026.1225`,strokeWidth:7,padding:16,color:`repeating-linear-gradient(135deg, #e03131 0 3%, #ffffff 3% 6%)`,background:`radial-gradient(#2b8a3e, #0b3d20)`},parameters:{docs:{description:{story:`Candy-cane strokes from a repeating gradient with hard stops, on a pine-green radial background. The number is Christmas Day 2026.`}}}},p={args:{value:`twelve`},parameters:{docs:{description:{story:`Input that isn't a decimal number shows the error.`}}}},m=[`Playground`,`LargeNumber`,`Decimal`,`Negative`,`Zero`,`Styled`,`Rainbow`,`Christmas`,`InvalidInput`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: '1234567890'
  },
  parameters: {
    docs: {
      description: {
        story: 'One glyph per four digits.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: '3.14159'
  },
  parameters: {
    docs: {
      description: {
        story: 'A dot, then the fraction in groups of four from the point.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: '-42'
  },
  parameters: {
    docs: {
      description: {
        story: 'A bar across the middle of the first stem.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: '0'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: '2026',
    color: '#7a2e0e',
    background: '#f6efe3',
    strokeWidth: 6,
    linecap: 'square',
    padding: 20
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: '123456789',
    strokeWidth: 6,
    color: 'linear-gradient(to right, #e03131, #f76707, #fab005, #40c057, #228be6, #7048e8, #be4bdb)'
  },
  parameters: {
    docs: {
      description: {
        story: 'A linear gradient spans the whole image, so a long number runs through every colour.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: '2026.1225',
    strokeWidth: 7,
    padding: 16,
    color: 'repeating-linear-gradient(135deg, #e03131 0 3%, #ffffff 3% 6%)',
    background: 'radial-gradient(#2b8a3e, #0b3d20)'
  },
  parameters: {
    docs: {
      description: {
        story: 'Candy-cane strokes from a repeating gradient with hard stops, on a pine-green radial background. The number is Christmas Day 2026.'
      }
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'twelve'
  },
  parameters: {
    docs: {
      description: {
        story: "Input that isn't a decimal number shows the error."
      }
    }
  }
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as Christmas,s as Decimal,p as InvalidInput,o as LargeNumber,c as Negative,a as Playground,d as Rainbow,u as Styled,l as Zero,m as __namedExportsOrder,i as default};