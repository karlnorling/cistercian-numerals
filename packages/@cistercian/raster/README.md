# @cistercian/raster

Render any number as [Cistercian numerals](https://en.wikipedia.org/wiki/Cistercian_numerals) in PNG, JPEG or WebP. Runs in Node and uses [sharp](https://sharp.pixelplumbing.com/).

<img src="https://raw.githubusercontent.com/karlnorling/cistercian/main/examples/1993.svg" alt="1993" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/cistercian/main/examples/pi.svg" alt="3.14159" height="80">

```sh
npm install @cistercian/raster
```

```js
import { toImage } from '@cistercian/raster';
import { writeFile } from 'node:fs/promises';

await writeFile('1993.webp', await toImage(1993, { format: 'webp', size: 400 }));
```

`toImage` takes every option of `toSvg` from [`@cistercian/core`](https://www.npmjs.com/package/@cistercian/core), plus `format` (`png`, `jpeg`, `jpg` or `webp`; default `png`) and `quality` (1–100). Strokes default to black, and JPEG gets a white background unless you pass one.

See the [full documentation](https://github.com/karlnorling/cistercian#readme).

## License

MIT
