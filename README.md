## fumadocs-notion

This is an example Fumadocs app that works with Notion.

### Setup

Create a Notion integration on https://www.notion.so/profile/integrations, select the correct workspace, and add your
secret to `.env.local` after creation.

```
NOTION_API_KEY=secret
```

You can now connect certain pages to the integration, from the page menu:

![Preview](/notion-settings.png)

Find your integration name here and connect it to your page.

After adding pages, run development server:

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

### How it works?

This app uses the Notion API to fetch pages and implement search functionality, and with `react-notion-x` to render page
content in React.

Feel free to take a look in the example for details.

### Supported Features

The example is relatively simple, it only supports simple block types, and do not support the full functionality of
database.

Dynamic rendering can also be enabled by setting `revalidate` segment config in `/app/docs/[id]/page.tsx`, like:

```tsx
export const revalidate = 4000
```