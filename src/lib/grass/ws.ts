import { GrassBlade, type GrassSeed } from "./grass";

export async function bufferToLawn(src: Blob): Promise<Array<GrassBlade>> {
  const buffer = await src.arrayBuffer();

  let index = 0;

  const res = [];

  const view = new DataView(buffer)
  while (index < buffer.byteLength) {
    // age is uint8
    const age = view.getUint8(index) / 100

    // Seed is float64 but we use it as several unsigned int.
    let seed = new Array<number>(8).fill(0) as GrassSeed;

    for (let i = 1; i < 9; i++)
      seed[i - 1] = view.getUint8(index + i) / 255

    let id = view.getUint32(index + 9, true);

    res.push(new GrassBlade(age, seed, id))

    index += 13;
  }

  return res;

}

export function bladeToBuffer(src: GrassBlade): ArrayBufferLike {


  let buffer = new ArrayBuffer(5 + 4);

  const view = new DataView(buffer);

  const header = "grass";



  for (let i = 0; i < header.length; ++i) {
    view.setUint8(i, header.charCodeAt(i))
  }

  view.setUint32(header.length, src.id, true);


  return buffer;
}
