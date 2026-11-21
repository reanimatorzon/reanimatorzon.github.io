import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const FPS = 24;
export const FRAMES = 240;
export const WIDTH = 960;
export const HEIGHT = 540;

// Shared scene description for the Remotion Player. This component can also
// be registered as a Remotion Composition for MP4 rendering in the future.
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const ease=x=>{const v=clamp(x);return v*v*(3-2*v)};
const circle=(x,y,r,fill,key)=> <circle key={key} cx={x} cy={y} r={r} fill={fill}/>;
const oval=(x,y,rx,ry,fill,key)=> <ellipse key={key} cx={x} cy={y} rx={rx} ry={ry} fill={fill}/>;
const Limb=({a,b,width,color})=><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={width} strokeLinecap="round"/>;
const Arm=({shoulder,elbow,hand,front})=><g>
  <Limb a={shoulder} b={elbow} width={27} color={front?'#d59353':'#c98a54'}/>
  <Limb a={shoulder} b={elbow} width={22} color="#edac5a"/>
  <Limb a={elbow} b={hand} width={20} color="#ffd2a4"/>
  {circle(elbow[0],elbow[1],10,'#ffd2a4','elbow')}
  {circle(hand[0],hand[1],13,'#ffd2a4','hand')}
</g>;

function Background(){
  return <g>
    <rect width="960" height="540" fill="url(#sky)"/>
    {circle(814,94,52,'#ffedb0','sun')}
    {[[74,78,.86],[380,72,1],[615,88,.68]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      {oval(54,21,80,24,'#f0fbf9','cloud0')}{circle(23,7,29,'white','cloud1')}{circle(70,-6,40,'white','cloud2')}{circle(112,12,30,'white','cloud3')}
    </g>)}
    {oval(188,395,305,160,'#86ceb7','hill1')}{oval(712,400,450,165,'#78c9a9','hill2')}
    {oval(240,560,520,220,'#b0df9c','hill3')}{oval(780,553,440,220,'#99d6a4','hill4')}
    <rect x="764" y="280" width="37" height="155" rx="8" fill="#a96f52"/>
    {[[751,263,68,'#489a72'],[812,292,65,'#41906b'],[786,229,74,'#5bb084'],[736,301,55,'#58a97f']].map(([x,y,r,c],i)=>circle(x,y,r,c,i))}
    {[[745,218],[810,237],[786,285],[724,297],[823,310]].map(([x,y],i)=>circle(x,y,5,'#f5d894',i))}
    {[[65,444],[110,465],[601,452],[672,465],[870,451],[930,463]].map(([x,y],i)=><g key={i}>{oval(x,y,34,18,'#63ad7d','bush1')}{oval(x-6,y-12,24,18,'#67bd89','bush2')}</g>)}
    {[[74,439],[145,475],[584,468],[652,438],[899,455]].map(([x,y],i)=>circle(x,y,7,'#f8d29e',i))}
  </g>;
}

function Star({t}){
  const x=668+Math.sin(t*.7)*6,y=205+Math.sin(t*2.3)*7;
  const points=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2===0?44:22;return `${Math.cos(a)*r},${Math.sin(a)*r}`}).join(' ');
  return <g>
    {t>4.5&&Array.from({length:6},(_,i)=>{const a=t*1.5+i*Math.PI/3;return circle(x+69*Math.cos(a),y+61*Math.sin(a),2.8,'#fff4bd',i)})}
    <g transform={`translate(${x} ${y}) rotate(${Math.sin(t*2.4)*8}) scale(${1+.07*Math.sin(t*5.6)})`}>
      <polygon points={points} fill="#ffdf74" stroke="#edb45b" strokeWidth="4" strokeLinejoin="round"/>
      {circle(-10,-1,2.8,'#60412d','eye1')}{circle(13,-1,2.8,'#60412d','eye2')}
      <path d="M-7 9 Q2 20 11 9" fill="none" stroke="#a26943" strokeWidth="2" strokeLinecap="round"/>
    </g>
  </g>;
}

function Hero({t}){
  const moving=t>.6&&t<3.8;
  const walk=ease((t-.6)/3.2);
  const bx=169+312*walk,phase=(t-.6)*Math.PI*2*1.7;
  const step=moving?Math.sin(phase):0;
  const sway=moving?Math.sin(phase)*13:0;
  const bounce=moving?Math.abs(Math.sin(phase))*4:Math.sin(t*2.3)*1.8;
  const gy=472-bounce,hy=gy-211;
  const blink=(t>5.6&&t<5.75)||(t>8.75&&t<8.9);
  const lift=ease((t-4.4)/.7)*(1-ease((t-8.05)/.95));
  const wave=t>5&&t<8?Math.sin((t-5)*Math.PI*4.4):0;
  const shoulder=[bx+43,gy-126];
  const elbow=[bx+43+24*(1-lift)+lift*(37+wave*5),gy-91-lift*54];
  const hand=[bx+43+30*(1-lift)+lift*(26+wave*17),gy-58-lift*123];
  return <g>
    {oval(bx-2,481,55,8,'#6da78f','shadow')}
    {[-1,1].map((side,i)=>{
      const sx=bx+side*22,knee=[sx+step*side*8,gy-42],foot=[sx+step*side*12,gy-15];
      return <g key={i}>
        <Limb a={[sx,gy-94]} b={knee} width={24} color="#4b83a9"/>
        <Limb a={knee} b={foot} width={25} color="#4b83a9"/>
        <rect x={foot[0]-12} y={foot[1]-8} width="40" height="22" rx="10" fill="#ef6e62"/>
        <rect x={foot[0]-10} y={foot[1]+8} width="38" height="4" rx="2" fill="#fff4dc"/>
      </g>})}
    <Arm shoulder={[bx-43,gy-126]} elbow={[bx-51-sway*.6,gy-93]} hand={[bx-54-sway,gy-58]} front={false}/>
    <rect x={bx-41} y={gy-159} width="82" height="110" rx="28" fill="#edac5a"/>
    <rect x={bx-35} y={gy-123} width="70" height="76" rx="18" fill="#578fba"/>
    <Limb a={[bx-24,gy-136]} b={[bx-24,gy-93]} width={8} color="#4b7ba2"/>
    <Limb a={[bx+24,gy-136]} b={[bx+24,gy-93]} width={8} color="#4b7ba2"/>
    {circle(bx-24,gy-136,5,'#f9e7aa','button1')}{circle(bx+24,gy-136,5,'#f9e7aa','button2')}
    {oval(bx-54,hy+48,12,20,'#f5bb8d','ear1')}{oval(bx+54,hy+48,12,20,'#f5bb8d','ear2')}
    {oval(bx,hy+36,52,62,'#ffd2a4','head')}
    {[[bx-30,hy-13,33,27,'#65412f'],[bx,hy-25,34,26,'#815039'],[bx+28,hy-10,37,28,'#65412f']].map(([x,y,rx,ry,c],i)=>oval(x,y,rx,ry,c,i))}
    {[-19,19].map((dx,i)=><g key={i}>
      {blink?<path d={`M${bx+dx-6} ${hy+42} h12`} stroke="#463834" strokeWidth="3" strokeLinecap="round"/>:<g>{oval(bx+dx,hy+47,6,8,'#362e32','eye')}{circle(bx+dx-2,hy+44,2,'white','spark')}</g>}
    </g>)}
    {oval(bx-29,hy+64,10,5,'#f7a68b','cheek1')}{oval(bx+29,hy+64,10,5,'#f7a68b','cheek2')}
    {circle(bx,hy+60,4,'#e4a278','nose')}
    <path d={`M${bx-11} ${hy+67} Q${bx} ${hy+(t>4?82:73)} ${bx+11} ${hy+67}`} fill="none" stroke="#995547" strokeWidth="2.7" strokeLinecap="round"/>
    <Arm shoulder={shoulder} elbow={elbow} hand={hand} front/>
  </g>;
}

function Title({text,opacity,y=30,size=39}){
  return <g opacity={opacity}>
    <rect x="218" y={y-11} width="524" height={size+27} rx="17" fill="#fffef0" fillOpacity=".84"/>
    <text x="480" y={y+size-4} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize={size} fontWeight="800" fill="#375b53">{text}</text>
  </g>;
}

export function SevaStory(){
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  return <AbsoluteFill style={{backgroundColor:'#a5e9e4'}}>
    <svg viewBox="0 0 960 540" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9ee6e8"/><stop offset="1" stopColor="#e0f6df"/></linearGradient></defs>
      <Background/><Star t={t}/><Hero t={t}/>
      {t<3&&<Title text="Сева и звёздочка" opacity={ease(Math.min(t/.65,(3-t)/.65))}/>}
      {t>6.1&&t<9.8&&<Title text="Привет, звёздочка!" y={39} size={31} opacity={ease(Math.min((t-6.1)/.65,(9.8-t)/.55))}/>}
    </svg>
  </AbsoluteFill>;
}
