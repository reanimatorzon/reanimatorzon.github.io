import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {SevaStory, FPS, FRAMES, WIDTH, HEIGHT} from './story.jsx';
import './style.css';

function App(){
  return <main>
    <header><span className="eyebrow">REMOTION · ДЕТЕРМИНИРОВАННАЯ АНИМАЦИЯ</span><h1>⭐ Сева и звёздочка</h1>
      <p>Первый интерактивный предпросмотр. Сгибание локтей и движение рук рассчитываются по кадрам, без генеративного видео.</p></header>
    <section className="player"><Player component={SevaStory} compositionWidth={WIDTH} compositionHeight={HEIGHT} durationInFrames={FRAMES} fps={FPS} controls autoPlay={false} loop={false} style={{width:'100%',aspectRatio:'16 / 9'}}/></section>
    <footer>Условный мультяшный персонаж · без фотографий ребёнка · <a href="https://github.com/reanimatorzon/reanimatorzon.github.io/tree/main/cartoons-app">Исходники</a></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
