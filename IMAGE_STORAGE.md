Images bundled with the site live in `public/images`. Uploaded profile, room,
and food images are validated and optimized to WebP. Upload up to 8 JPEG, PNG,
WebP, or AVIF files at once, up to 5 MB per file.

On Vercel, connect a Blob store to the project so `BLOB_READ_WRITE_TOKEN` is
available. Uploaded images are stored durably in Blob and MongoDB stores their
public URLs. Local development without a Blob token saves files to
`public/uploads`, served by `/uploads/[filename]`.

Cloudinary credentials are not required.

To migrate previously saved remote images, configure `MONGO_DB_URL` and, when
migrating on Vercel, `BLOB_READ_WRITE_TOKEN`:

```
npm run images:migrate
npm run images:migrate -- --write
```

The first command previews the number of records. The second downloads images
and updates their paths. Failed downloads leave existing database links intact.

Existing `/uploads/...` paths refer to files on the local filesystem; those
files must be migrated or uploaded again when deploying to ephemeral hosting.
