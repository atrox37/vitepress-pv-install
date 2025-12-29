---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

![](https://voltagenc.sharepoint.com/sites/PV_Energy_Storage_VTG-Group/Shared%20Documents/General/%E6%B4%BB%E5%8A%A8%E7%85%A7%E7%89%87/11.29%20Q4%20team%20building/48762e01-8b36-4c69-8155-2d5ab8dc7af1.jpg)

[48762e01-8b36-4c69-8155-2d5ab8dc7af1.jpg](https://voltagenc.sharepoint.com/:i:/s/PV_Energy_Storage_VTG-Group/IQAxl2UGeESxSqV6pyIL5egNAVE7kiUgPoYuz97C2vVVcjg?e=uTYwmD)

<iframe
  src="https://voltagenc.sharepoint.com/sites/PV_Energy_Storage_VTG-Group/_layouts/15/embed.aspx?UniqueId=06659731-4478-4ab1-a57a-a7220be5e80d"
  width="640"
  height="360"
  frameborder="0"
  scrolling="no"
  allowfullscreen
  title="48762e01-8b36-4c69-8155-2d5ab8dc7af1">
</iframe>

<iframe src="https://voltagenc.sharepoint.com/sites/PV_Energy_Storage_VTG-Group/_layouts/15/embed.aspx?UniqueId=3f0ada5d-4bba-4110-b07f-2878d10bda06&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen title="sample_640x360.mp4"></iframe>

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'
const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
