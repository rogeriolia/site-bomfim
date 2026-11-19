const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'../..');
const fontConfig=path.join(os.tmpdir(),'bomfim-carousel-fonts.conf');
fs.writeFileSync(fontConfig,`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>${path.join(__dirname,'fonts')}</dir><cachedir>${path.join(os.tmpdir(),'bomfim-font-cache')}</cachedir></fontconfig>`);
process.env.FONTCONFIG_FILE=fontConfig;
const sharp=require('/Users/apololira/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const output=path.join(root,'public/revisao-editorial/carrosseis');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(output,'manifest.json')));
 for(const item of manifest)for(const slide of item.slides){const svg=path.join(root,'public/revisao-editorial',slide.editable),png=path.join(root,'public/revisao-editorial',slide.src);await sharp(svg).png({compressionLevel:9}).toFile(png);}
 const covers=manifest.map((m,i)=>({input:path.join(output,m.slug,'01.png'),left:(i%5)*270,top:Math.floor(i/5)*338}));
 const thumbs=[];for(const c of covers)thumbs.push({input:await sharp(c.input).resize(270,338).toBuffer(),left:c.left,top:c.top});
 await sharp({create:{width:1350,height:676,channels:3,background:'#F5F7FA'}}).composite(thumbs).png().toFile(path.join(output,'visao-geral.png'));
 console.log('50 PNGs rendered at 1080 × 1350; overview generated.');
})().catch(e=>{console.error(e);process.exit(1)});
