#### SERVER

#### MONGO DB

#### Models

...

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "sourceMap": true,
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "outDir": "dist",
    // "rootDir": "./src",
    "strict": true
    // "types": ["node"]
  },
  // "include": ["./src"]
  "include": ["src", "./node_modules/@types/**/*.d.ts"]
}
```

#### Security packages

- [helmet] https://www.npmjs.com/package/helmet
  elmet helps secure Express apps by setting HTTP response headers.
- [express-rate-limit] https://www.npmjs.com/package/express-rate-limit
  Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
