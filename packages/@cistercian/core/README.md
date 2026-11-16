# @cistercian/core

Render any number as [Cistercian numerals](https://en.wikipedia.org/wiki/Cistercian_numerals) in SVG. No dependencies; works in Node and the browser.

<img src="https://raw.githubusercontent.com/karlnorling/cistercian-numerals/main/examples/1993.svg" alt="1993" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/cistercian-numerals/main/examples/pi.svg" alt="3.14159" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/cistercian-numerals/main/examples/rainbow.svg" alt="123456789 in rainbow colours" height="80">

```sh
npm install @cistercian/core
```

```js
import { toSvg } from '@cistercian/core';

document.body.innerHTML = toSvg(1993, { size: 200 });

// Colours and backgrounds take CSS gradients too.
toSvg(123456789, { color: 'linear-gradient(to right, #e03131, #fab005, #228be6)' });
```

Numbers above 9999 use one glyph per four digits, a dot separates the fraction, and negatives get a bar across the first stem. For PNG, JPEG or WebP, use [`@cistercian/raster`](https://www.npmjs.com/package/@cistercian/raster).

See the [full documentation](https://github.com/karlnorling/cistercian-numerals#readme) for every option and how numbers are drawn.

## License

MIT
