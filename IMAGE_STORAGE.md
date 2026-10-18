Images bundled with the site live in `public/images`. Uploaded profile, room,
and food images are validated, optimized to WebP, and saved in `public/uploads`.
Upload up to 8 JPEG, PNG, WebP, or AVIF files at once, up to 5 MB per file.

Cloudinary credentials are no longer required. MongoDB stores local image paths.
The `/uploads/[filename]` route serves new uploads without rebuilding the app.

To migrate previously saved remote images, configure `MONGO_DB_URL` in `.env`:

```
npm run images:migrate
npm run images:migrate -- --write
```

The first command previews the number of records. The second downloads images
and updates their paths. Failed downloads leave existing database links intact.

Deploy with a persistent, writable `public/uploads` directory and include it in
backups. Ephemeral or read-only hosting will not retain local uploads.
