// Downloads real MB TECHNIC media (2GIS gallery + Instagram) into public/media/
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "public", "media");

const GALLERY = [
  ["https://i1.photo.2gis.com/video-gallery/36182f5a-e43b-4faa-b981-12ccb733a96c.jpg", "owner-video-01"],
  ["https://i1.photo.2gis.com/video-gallery/fe43471b-c6b1-44e0-adcd-d043bbc5a627.jpg", "owner-video-02"],
  ["https://i1.photo.2gis.com/video-gallery/3a767f43-e1da-4cc8-8476-753e5aaad4e4.jpg", "owner-video-03"],
  ["https://i1.photo.2gis.com/video-gallery/bc48a33d-19c2-48aa-8b39-e1e0f2c45062.jpg", "owner-video-04"],
  ["https://i1.photo.2gis.com/video-gallery/376745c8-cfcc-4e17-b0d5-973aa7a75a11.jpg", "owner-video-05"],
  ["https://i2.photo.2gis.com/photo-gallery/064c168e-a082-41d3-b951-e3a06e23bf1f.jpg", "owner-01"],
  ["https://i1.photo.2gis.com/video-gallery/b67e2a2c-9a2d-4cdd-9b73-0331d9886b93.jpg", "owner-video-06"],
  ["https://i1.photo.2gis.com/video-gallery/7f0fa1bd-adb0-449f-b78e-03f725daf40c.jpg", "owner-video-07"],
  ["https://i4.photo.2gis.com/photo-gallery/2ea5f269-d100-4a9b-956a-d82050602b42.jpg", "exterior-01"],
  ["https://i1.photo.2gis.com/video-gallery/ebeb32da-dcad-4e6a-b1c1-f7ff552b63ca.jpg", "entrance-01"],
  ["https://i1.photo.2gis.com/video-gallery/9ae9b44b-8734-4097-a195-9eb79aba784f.jpg", "user-video-01"],
  ["https://i1.photo.2gis.com/video-gallery/8237417b-6aeb-458c-9f6a-3be63c47799d.jpg", "owner-video-08"],
  ["https://i1.photo.2gis.com/video-gallery/73366d5d-d1b2-468f-872e-7ca8ebe74da1.jpg", "owner-video-09"],
  ["https://i9.photo.2gis.com/photo-gallery/4ac51af4-c90b-4964-9e9c-744840914690.jpg", "user-01"],
  ["https://i1.photo.2gis.com/photo-gallery/dc4478eb-7fe4-428a-a49f-ad0c92c2e92b.jpg", "owner-02"],
  ["https://i2.photo.2gis.com/photo-gallery/907686fa-193d-4e62-b4b0-008bf4a2c7c0.jpg", "owner-03"],
  ["https://i2.photo.2gis.com/photo-gallery/37495124-f1b8-426d-9e51-721731601713.jpg", "interior-01"],
  ["https://i3.photo.2gis.com/photo-gallery/81d033b2-4b04-4d41-bde8-4f3ee125a902.jpg", "interior-02"],
  ["https://i1.photo.2gis.com/video-gallery/625a01da-da1a-456a-84ef-65a33e46b65b.jpg", "owner-video-10"],
  ["https://i1.photo.2gis.com/photo-gallery/ba342e40-371c-42ab-b567-8db336ebf658.jpg", "owner-04"],
  ["https://i0.photo.2gis.com/photo-gallery/3fec11de-5d8d-4b30-bc15-95652b711eb9.jpg", "user-02"],
  ["https://i1.photo.2gis.com/video-gallery/fbe4e3b0-fc90-4f6f-bd4b-5de08df9b9d4.jpg", "owner-video-11"],
  ["https://i5.photo.2gis.com/photo-gallery/da09aec3-2e77-4221-9b0c-3c2aec627dff.jpg", "owner-05"],
  ["https://i7.photo.2gis.com/photo-gallery/3327fbbf-229b-47d9-aea2-3a3214d0d805.jpg", "exterior-02"],
  ["https://i2.photo.2gis.com/photo-gallery/87ed9026-a0fb-46da-a5f1-264b9f090d72.jpg", "user-03"],
  ["https://i3.photo.2gis.com/photo-gallery/9a3dfcd7-cce1-4390-bbdc-11800451c7e1.jpg", "interior-03"],
  ["https://i1.photo.2gis.com/photo-gallery/cbc309a4-453b-4ca6-a6a6-6daa4f1f9102.jpg", "user-04"],
  ["https://i1.photo.2gis.com/photo-gallery/57e6713f-41c4-4785-a2bf-13b3d656dda6.jpg", "user-05"],
  ["https://i1.photo.2gis.com/photo-gallery/e5bf99db-28d1-4739-a944-4204b36a198b.jpg", "user-06"],
  ["https://i4.photo.2gis.com/photo-gallery/86ffef7e-7655-493e-a41f-2340c99afbed.jpg", "interior-04"],
  ["https://i8.photo.2gis.com/photo-gallery/5268a87b-6416-4db8-a2a5-051b4531909e.jpg", "interior-05"],
  ["https://i3.photo.2gis.com/photo-gallery/8d943553-f4a3-4137-8b8b-415a8da38fda.jpg", "interior-06"],
];

const INSTAGRAM = [
  ["https://scontent.cdninstagram.com/v/t51.82787-15/753418729_18620984815029706_3083305934235744750_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=d4Gth5Kg9ekQ7kNvwElE7Rm&_nc_oc=AdpaZsj5XRGjhZhogB1bANmg9jF2o9-Nap5g4rtoLN7fTWQj_XpSMdQOx-UDYG432QM&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQKj9fMCVhgeGUdcUmLYbTbaJYHexj_RA0pKJWos39Qitg&oe=6AB9DE0D", "ig-01", "https://www.instagram.com/mb_technic.kz/reel/DbIWyAJIKE3/", "#Мерссервис #бмвсервис #амг"],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/710446378_2724969717879581_5994966841588604678_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=iTRKGNc3iEYQ7kNvwE2l1CB&_nc_oc=AdriHFErn4CIQ-iSjiAG417fOIeL_GRqrzR5_BNHvjUduKptRKbJzQWsSwBo0mxAllU&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQIDJirNtWfAB-hgDYNGUXf9ERtPNeawK9wqNKPtcfAn3g&oe=6ABA070E", "ig-02", "https://www.instagram.com/mb_technic.kz/reel/DY23FraoHpr/", "#20жылдықкездесу"],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/707359453_1306279208330629_5003130807989125527_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=J49Io9IL1pgQ7kNvwHwFKUw&_nc_oc=AdovmohVnCojg9JGVIAO0gOJbuKtpbvbG6Eumvj-7SEB8-tHHz2BWfvl-lgfxl5Yqm4&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQKzWPUCyoACbIyVJT_LV4eBtkxDcIYK6accalpmDhZdpw&oe=6AB9EA82", "ig-03", "https://www.instagram.com/mb_technic.kz/reel/DY2x6dOox5R/", "#20жылдықкездесу"],
  ["https://scontent.cdninstagram.com/v/t51.82787-15/547550380_18537267238029706_2065560711338647806_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=q8XobhOTitsQ7kNvwGw4r8I&_nc_oc=Adr5Bta1egi6RmerWbQPY16NDJAE1Tw35MTq63R5kxAjS_99drIAoUqxy4tqjdRUeIU&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQIIUD5654krxZfagHJFSl5To99RDENnuFvSKjiNmCjDVw&oe=6AB9F853", "ig-04", "https://www.instagram.com/mb_technic.kz/p/DOeav1UCP_c/", ""],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/539089006_621120874401650_6590063511225425924_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=LPMzoGckfEcQ7kNvwGJQF_Z&_nc_oc=AdpMiarLCiIRFEMJe1QfeeUR-kB04hKJyNZNcPX4y-dg-iQhZOfxlmZzTncdt34UFgg&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQLVtqV08nVM22tcoEQdFB8YnJt5mIE53M8YEBUtYICKXA&oe=6AB9D913", "ig-05", "https://www.instagram.com/mb_technic.kz/reel/DNvynsU0CRB/", ""],
  ["https://scontent.cdninstagram.com/v/t51.82787-15/535874671_18533359495029706_3077791293570276407_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=PhQpA4sskAgQ7kNvwFTrIY1&_nc_oc=AdqIRMXdq57ATPM30YXOLkQVm3rsW15t9kzP3xr0K-dp-FjkJgBsrfEyW3DydIYXvgM&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQInITjEK689jtuYghdzlPTWC_waKsv6wVjWt4TF752B7A&oe=6AB9E7FC", "ig-06", "https://www.instagram.com/mb_technic.kz/p/DNnUmksoAJX/", "Шторки оригинальные"],
  ["https://scontent.cdninstagram.com/v/t51.82787-15/537695642_18533358961029706_6658910677539924789_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=DqGICL0Dot8Q7kNvwHm1oBD&_nc_oc=AdqWsH5zXPOseU73ZA4Yh5FBasiD9YTyz9Ow6n7ze9gAY7O-MsGpR7RqZOjiHmb8VhM&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQIUUDsJnrmhTz0scCkjJZBD1H4ikY-0M67bkE_lh5u2cQ&oe=6AB9FB58", "ig-07", "https://www.instagram.com/mb_technic.kz/p/DNnUMVooScS/", "Дистроник в комплекте на W211 рестайлинг, и много ништяков"],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/530617729_725257320354088_3443295194711594014_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=fcBCx2_vHKEQ7kNvwFZq3Oy&_nc_oc=AdrBcIsHON1SXddSOsbGb7d9p4pZBKeZ0WmMqathGLnZrnUymoCBdarMOAit78Jyy_Q&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQLFsd2fRUWhx_15CLhtndVkd3Y-plKZBjiJIvYPmR2GXA&oe=6AB9FAB9", "ig-08", "https://www.instagram.com/mb_technic.kz/reel/DNRSObWIG4Y/", "Эндоскопия #amg #мерседесбенц"],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/529686858_776540285330861_3338748942389528190_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=G_G9XSuimi8Q7kNvwG1Qnm_&_nc_oc=Adq0VfHfr2-bm1xllh7n8zN6yThJ0mIJ1OscajUY4JI4KnyZNGsvQ4aQ99DQnUSH45s&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQKTQy86mb0x3XglO-JkRc9qzoZbv4LYSXRyg_ZuJ5VqRA&oe=6AB9E9A4", "ig-09", "https://www.instagram.com/mb_technic.kz/reel/DNOou0ho4xU/", "Эндоскоп приветствуется друзья"],
  ["https://scontent.cdninstagram.com/v/t51.82787-15/526965590_18529735084029706_8383491451182302368_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=DtHYUmm9apYQ7kNvwHmBVXw&_nc_oc=Adrsal3WND2EIavGkv0y59CLbjL5t4CGeZxZJuqql26mju6BmlrBPVIhgpBzoFj93U4&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQLAfGv4p2JNYLCNZYlWsfGr2XTCySBcmlIsz76D_IuL6Q&oe=6AB9F01B", "ig-10", "https://www.instagram.com/mb_technic.kz/p/DMyZyQ7IT-p/", ""],
  ["https://scontent.cdninstagram.com/v/t51.71878-15/525257641_1774033836525339_1245538554086661680_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=ESsnobuznt0Q7kNvwHDcole&_nc_oc=AdrLjcsMk28cPPMfClLcg65wjEJzC54PCmSrNp3XcoU3sSfKbYUMHo0FAG8kb0ugaG4&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQKNASqO4SBTIIow6pWuj_Bxvo2iMHk7avYWKH2-R9dObQ&oe=6AB9D45B", "ig-11", "https://www.instagram.com/mb_technic.kz/reel/DMvxKTfofcF/", "#amg #w211kazakhstan #мбсервис #сто #мерседес"],
  ["https://scontent.cdninstagram.com/v/t51.82787-15/525017228_18529550449029706_1108833674193828951_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=DdVrQuRdRUkQ7kNvwE9wjr-&_nc_oc=AdrBmGvLQDtxbIcoF3Ysr62bYjhD6vz3dTn1TABFELYsezHbmC0qvL-xN2I7nbeQV-k&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=bQsthgwQ89ycHN4-no0qcA&_nc_ss=7aa8c&oh=00_AQL31Wh0YfnJpnF48UkYqvOukIRxqbzuw0b0sQPkKgNqbA&oe=6AB9EE12", "ig-12", "https://www.instagram.com/mb_technic.kz/p/DMvvzRhIvHO/", ""],
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function grab(url, outFile) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*,*/*" } });
    if (!res.ok) return `FAIL ${res.status}`;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1200) return `FAIL tiny(${buf.length})`;
    await writeFile(outFile, buf);
    return `OK ${Math.round(buf.length / 1024)}kb`;
  } catch (e) {
    return `ERR ${e.message}`;
  }
}

await mkdir(path.join(ROOT, "gallery"), { recursive: true });
await mkdir(path.join(ROOT, "instagram"), { recursive: true });

const results = [];
for (const [url, name] of GALLERY) {
  const r = await grab(url, path.join(ROOT, "gallery", `${name}.jpg`));
  results.push(`gallery/${name}.jpg ${r}`);
}
for (const [url, name] of INSTAGRAM) {
  const r = await grab(url, path.join(ROOT, "instagram", `${name}.jpg`));
  results.push(`instagram/${name}.jpg ${r}`);
}
await mkdir(path.join(ROOT, "instagram"), { recursive: true });
console.log(results.join("\n"));
console.log("\nSUMMARY", results.filter((r) => r.includes(" OK ")).length, "/", results.length, "downloaded");
