# @cistercian/cli

Draw any number as [Cistercian numerals](https://en.wikipedia.org/wiki/Cistercian_numerals) from the command line: SVG, PNG, JPEG or WebP.

<img src="https://raw.githubusercontent.com/karlnorling/cistercian/main/examples/1993.svg" alt="1993" height="80"> <img src="https://raw.githubusercontent.com/karlnorling/cistercian/main/examples/negative.svg" alt="-42" height="80">

```sh
npx @cistercian/cli 1993 > 1993.svg
npx @cistercian/cli 3.14159 -o pi.webp --size 200
npx @cistercian/cli -42 -o minus.png
```

Installed globally with `npm install -g @cistercian/cli`, the command is `cistercian`.

```
Usage: cistercian <number> [options]

Draws a number as Cistercian numerals. Prints SVG to stdout unless --output is given.

Options:
  -o, --output <file>      Write to a .svg, .png, .jpg, .jpeg or .webp file
  -s, --size <px>          Image height in pixels (default 100)
  -c, --color <color>      Stroke colour (default currentColor for SVG, black for images)
  -b, --background <color> Background colour (default transparent, white for JPEG)
      --stroke-width <n>   Stroke width, where the stem is 80 long (default 4)
  -q, --quality <1-100>    JPEG and WebP quality
  -h, --help               Show this help
  -v, --version            Show the version

Examples:
  cistercian 1993 > 1993.svg
  cistercian 3.14159 -o pi.webp --size 200
  cistercian -42 -o minus.png
```

See the [full documentation](https://github.com/karlnorling/cistercian#readme).

## License

MIT
