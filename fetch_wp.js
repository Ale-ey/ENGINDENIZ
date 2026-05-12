const fs = require('fs');
fetch('https://silvioh22.sg-host.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { pages(where: {search: "law firm"}) { nodes { content } } }' })
})
.then(r => r.json())
.then(d => {
  fs.writeFileSync('wp_content.html', d.data.pages.nodes[0].content);
  console.log("Done");
});
