(()=>{
      'use strict';
      const $=id=>document.getElementById(id);
      const root=$('scroll-root');
      const mask=$('ellipse-reveal');
      const orbitStage=$('orbit-stage');
      const orbitCanvas=$('orbit-canvas');
      const orbitMotion=$('orbit-motion');
      const copyNodes=['center-animated','top-animated','bottom-left-animated','bottom-right-animated','chrome-animated'].map($);
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mobile = matchMedia('(max-width: 768px)');
      const orbitTemple = $('orbit-temple');
      const mobileCaption = $('mobile-orbit-caption');
      const wildlife = $('wildlife-motion');
      let wildlifeAnimation;
      let featuredIndex = -1;
      const imageNodes=[];
      const N=6;
      const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
      const mod=(a,b)=>((a%b)+b)%b;
      const lerp=(a,b,t)=>a+(b-a)*t;
      function interp(x,ins,outs){
        if(x<=ins[0])return outs[0];
        for(let i=1;i<ins.length;i++)if(x<=ins[i])return lerp(outs[i-1],outs[i],(x-ins[i-1])/(ins[i]-ins[i-1]));
        return outs[outs.length-1];
      }
      const keys=[.15,.25,.85,.95,1];
      const textKeys=[.03,.08,.15,.22,.90,.98,1];
      const ellipseKeys=[0,.08,1];
      const content = window.tikalContent;
      const video = $('hero-video');
      if (reduced) {
        video.autoplay = false;
        video.pause();
        video.removeAttribute('src');
        video.load();
      } else {
        const showVideo = () => video.parentElement.classList.add('video-ready');
        video.addEventListener('playing', showVideo);
        video.addEventListener('error', () => video.parentElement.classList.remove('video-ready'));
        if (!video.paused && video.readyState >= 2) showVideo();
      }
      if (content.ctaHref) {
        for (const link of [$('cta-pill'), $('cta-arrow')]) {
          link.href = content.ctaHref;
          link.removeAttribute('aria-disabled');
        }
      }
      function fitWordmark() {
        const word = $('brand-wordmark-text');
        const box = word.getBBox();
        word.closest('svg').setAttribute('viewBox', `${box.x - 3} ${box.y - 3} ${box.width + 6} ${box.height + 6}`);
      }
      document.fonts.ready.then(fitWordmark);
      for (let i = 0; i < N; i++) {
        const {title, label, src, position, detail} = content.orbit[i];
        const holder = document.createElement('figure');
        holder.className = 'orbit-image';
        const photoFrame = document.createElement('div');
        photoFrame.className = 'orbit-photo-frame';
        const caption = document.createElement('figcaption');
        caption.className = 'orbit-caption';
        const heading = document.createElement('strong');
        heading.textContent = title;
        const description = document.createElement('span');
        description.textContent = detail;
        caption.append(heading, description);
        const fallback = document.createElement('span');
        fallback.className = 'fallback';
        fallback.textContent = String(i + 1).padStart(2, '0');
        fallback.setAttribute('aria-label', `${label}: fotografía pendiente`);
        const img = document.createElement('img');
        img.className = 'photo';
        img.alt = label;
        img.width = 1200;
        img.height = 1200;
        img.style.objectPosition = position;
        img.hidden = true;
        if (src) {
          img.addEventListener('load', () => { holder.classList.add('has-media'); img.hidden = false; });
          img.addEventListener('error', () => { holder.classList.remove('has-media'); img.hidden = true; });
          img.src = src;
        }
        photoFrame.append(fallback, img);
        holder.append(photoFrame, caption);
        orbitMotion.appendChild(holder);
        imageNodes.push({holder, img, fallback, caption});
      }
      let stageScale=1;
      const resize=()=>{stageScale=orbitStage.getBoundingClientRect().width/800;orbitCanvas.style.transform=`translate(-50%,-50%) scale(${stageScale})`};
      new ResizeObserver(resize).observe(orbitStage);
      resize();
      const getProgress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight-innerHeight));
      let prevP=getProgress(),orbitProgress=0,prevTime=performance.now();
      function scaleFor(pos,strength){
        let d=Math.abs(pos-50);if(d>50)d=100-d;
        const target=d<20? .4+(Math.cos(d/20*Math.PI)+1)*.3 : .4;
        return 1-strength*(1-target);
      }
      function updateMobileCaption(progress) {
        mobileCaption.hidden = !mobile.matches || progress < .23 || progress > .89;
        if (mobileCaption.hidden) {
          featuredIndex = -1;
          wildlifeAnimation?.cancel();
          wildlifeAnimation = undefined;
          return;
        }
        const focusX = innerWidth / 2;
        const focusY = innerHeight * .43;
        const distances = imageNodes.map(({holder}) => {
          const rect = holder.getBoundingClientRect();
          return Math.hypot((rect.left + rect.right) / 2 - focusX, (rect.top + rect.bottom) / 2 - focusY);
        });
        const closest = distances.indexOf(Math.min(...distances));
        if (featuredIndex >= 0 && distances[featuredIndex] <= distances[closest] + 24) return;
        featuredIndex = closest;
        const {title, detail, motion} = content.orbit[closest];
        $('mobile-orbit-title').textContent = title;
        $('mobile-orbit-detail').textContent = detail;
        if (motion && !reduced) {
          wildlifeAnimation?.cancel();
          wildlife.src = motion.src;
          wildlife.classList.toggle('blend-background', Boolean(motion.blend));
          wildlife.dataset.kind = motion.kind;
          const walking = motion.kind === 'walk';
          const upperFlight = motion.kind === 'upper-flight';
          const walkPath = motion.direction === 'left' ? ['100vw', '-100%'] : ['-100%', '100vw'];
          const keyframes = motion.kind === 'flora' ? [
            {transform: 'translate(-50%, 28px) scale(.94)', opacity: 0},
            {transform: 'translate(-50%, 0) scale(1)', opacity: .62, offset: .25},
            {transform: 'translate(-50%, -5px) scale(1.02)', opacity: .62, offset: .78},
            {transform: 'translate(-50%, -10px) scale(1.04)', opacity: 0}
          ] : [
            {transform: upperFlight ? 'translate(12px, 10px)' : walking ? `translateX(${walkPath[0]})` : 'translate(-100%, 12vh) rotate(-6deg)', opacity: 0},
            {opacity: .62, offset: .21},
            {opacity: .62, offset: .78},
            {transform: upperFlight ? 'translateX(calc(100vw - 100% - 12px))' : walking ? `translateX(${walkPath[1]})` : 'translate(100vw, -12vh) rotate(-10deg)', opacity: 0}
          ];
          wildlifeAnimation = wildlife.animate(keyframes, {
            duration: walking || motion.kind === 'flora' ? 2800 : 2200,
            easing: 'linear'
          });
        }
      }
      function placeCaptions(copyOpacity) {
        const bounds = imageNodes.map(({holder}) => holder.getBoundingClientRect());
        const obstacles = [...bounds];
        const badge = copyOpacity > .02 ? $('top-animated').getBoundingClientRect() : null;
        if (copyOpacity > .25) obstacles.push(document.querySelector('.center-copy').getBoundingClientRect());
        for (const [index, {left, right, top, bottom}] of bounds.entries()) {
          const {holder} = imageNodes[index];
          const center = (top + bottom) / 2;
          const preferLeft = left + right < innerWidth;
          const diameter = Math.min(right - left, bottom - top);
          const growth = clamp((diameter - 100 * stageScale) / 460);
          const gap = lerp(8, 30, growth);
          let best = {cost: Infinity};
          for (const side of ['left', 'right']) {
            const anchorX = side === 'left' ? left : right;
            const room = side === 'left' ? anchorX : innerWidth - anchorX;
            const width = clamp(room - 8, 62, lerp(145, 330, growth));
            const typeGrowth = growth * clamp((width - 62) / 145);
            const height = lerp(40, 132, typeGrowth);
            const x = side === 'left' ? anchorX - width : anchorX;
            for (const shift of [0, -26, 26, -48, 48, -68, 68]) {
              const y = center + shift - height / 2;
              const overlap = obstacles.reduce((sum, rect) => sum +
                Math.max(0, Math.min(x + width, rect.right) - Math.max(x, rect.left)) *
                Math.max(0, Math.min(y + height, rect.bottom) - Math.max(y, rect.top)), 0);
              const touchesBadge = badge && x < badge.right + 12 && x + width > badge.left - 12 &&
                y < badge.bottom + 12 && y + height > badge.top - 12;
              const edgeOverflow = Math.max(0, width - room + 4) * height;
              const cost = (touchesBadge ? innerWidth * innerHeight : 0) + overlap +
                edgeOverflow +
                (Math.max(0, -y) + Math.max(0, y + height - innerHeight)) * width +
                Math.abs(shift) + (preferLeft === (side === 'left') ? 0 : 8);
              if (cost < best.cost) best = {cost, side, width, shift, x, y, height, typeGrowth};
            }
          }
          holder.dataset.captionSide = best.side;
          holder.style.setProperty('--caption-width', `${best.width}px`);
          holder.style.setProperty('--caption-y', `${best.shift}px`);
          holder.style.setProperty('--caption-gap', `${gap}px`);
          holder.style.setProperty('--caption-growth', String(best.typeGrowth));
          obstacles.push({left: best.x, right: best.x + best.width, top: best.y, bottom: best.y + best.height});
        }
        if (badge) {
          const captionBounds = imageNodes.map(({caption}) => caption.getBoundingClientRect());
          for (const [index, rect] of captionBounds.entries()) {
            if (rect.left < badge.right + 8 && rect.right > badge.left - 8 &&
                rect.top < badge.bottom + 8 && rect.bottom > badge.top - 8) {
              const {holder} = imageNodes[index];
              const shift = parseFloat(holder.style.getPropertyValue('--caption-y'));
              holder.style.setProperty('--caption-y', `${shift + badge.bottom + 8 - rect.top}px`);
            }
          }
        }
      }
      function frame(now){
        const dt=Math.min(.05,Math.max(0,(now-prevTime)/1000));prevTime=now;
        const p=reduced?.12:getProgress();
        const delta = clamp(p, .15, .85) - clamp(prevP, .15, .85);
        prevP = p;
        if (!reduced) {
          orbitProgress += delta * 200;
          if (p <= .15 || p >= .85) orbitProgress += dt * 2.5;
        }
        const ellipse=interp(p,ellipseKeys,[0,55,55]);
        mask.style.clipPath=`ellipse(${ellipse}% ${ellipse}% at 50% 50%)`;
        const opacity=interp(p,textKeys,[0,1,1,0,0,1,1]);
        const blur=interp(p,textKeys,[15,0,0,15,15,0,0]);
        const y=interp(p,textKeys,[20,0,0,20,20,0,0]);
        const copyLayer = $('copy-layer');
        copyLayer.inert = !reduced && opacity < .05;
        copyNodes.forEach(el=>{
          el.style.opacity=reduced?1:opacity;
          el.style.filter=reduced?'none':`blur(${blur}px)`;
          el.style.transform=`translateY(${reduced?0:y}px)`;
        });
        const size=interp(p,keys,[80,520,520,80,80]);
        const rx=interp(p,keys,[330,650,650,330,330]);
        const restingRadiusY = mobile.matches ? 205 : 140;
        const ry=interp(p,keys,[restingRadiusY,650,650,restingRadiusY,restingRadiusY]);
        if (mobile.matches) orbitTemple.style.opacity = opacity;
        const rot=interp(p,keys,[-15,0,0,-15,-15]);
        const tx=interp(p,keys,[0,-650,-650,0,0]);
        const strength=interp(p,keys,[0,1,1,0,0]);
        orbitMotion.style.transform=`rotate(${rot}deg) translateX(${tx}px)`;
        const path=`path('M ${400-rx} 400 A ${rx} ${ry} 0 1 0 ${400+rx} 400 A ${rx} ${ry} 0 1 0 ${400-rx} 400')`;
        imageNodes.forEach(({holder,img,fallback},i)=>{
          const pos=mod(orbitProgress+i/N*100,100);
          const scale=scaleFor(pos,strength);
          holder.style.offsetPath=path;
          holder.style.webkitOffsetPath=path;
          holder.style.offsetDistance=`${pos}%`;
          holder.style.webkitOffsetDistance=`${pos}%`;
          holder.style.offsetRotate='0deg';
          holder.style.webkitOffsetRotate='0deg';
          holder.style.width=`${size}px`;
          holder.style.height=`${size}px`;
          holder.style.transform=`scale(${scale})`;
          holder.style.zIndex=String(Math.round(scale*100));
          holder.style.setProperty('--caption-scale', String(1 / (scale * stageScale)));
          holder.style.setProperty('--caption-rotation', `${-rot}deg`);
          // Los contenidos permanecen en posición vertical durante rotación de wrapper.
          img.style.transform=`rotate(${-rot}deg)`;
          fallback.style.transform=img.style.transform;
        });
        if (ellipse > 0 && !mobile.matches) placeCaptions(opacity);
        updateMobileCaption(p);
        if(!reduced)requestAnimationFrame(frame);
      }
      if(reduced){frame(performance.now());}else{requestAnimationFrame(frame);}
    })();

