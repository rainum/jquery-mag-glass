# jQuery Mag Glass

Magnifying glass plugin for images.

## Setup

Plugin is need to be applied to image tag. It takes image's `src` attribute value and displays part of this image in lens. So if you have image 800x600 you need to render it like this:

```html
<img class="mag-glass" src="path/to/image.png" width="400" height="300">
```

```javascript
$('.mag-glass').magGlass();
```

If you have twice difference in sizes, you will have twice scale in lens etc.

## Options

Option | Type | Default    | Description
-------|------|------------|------------
lensPosition | Object | `{ top: 50, left: 20 }` | Initial lens position
lensSize | Object | `{ width: 50, height: 20 }` | Lens sizes
lensClass | String | `'mag-glass'` | Lens element class
lensResetTimeout | Number | `700` | Specify, when lens will be back to its initial position
lensResetSpeed | Number | `500` | Lens return to initial position animation speed

## License

Copyright (c) 2014 Vazha Omanashvili

Licensed under the MIT license.
