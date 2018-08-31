# smart-node-import

Require modules from defined project's root path.

## Installation

```bash
npm install smart-node-import
```

## Usage

Just once, in your bootstrap file. First parameter is a **root path**, and the second one is a **cache path**, which is optional.

```javascript
require('smart-node-import')(__dirname + '/app', __dirname + '/temp');
```


Then to load modules from project's root path use `@/` at the beginning:

```javascript
const module = require('@/models/User');
```