


async function test() {
  const query = `
    query {
      pages(where: {search: "Panaroma"}) {
        nodes {
          id
          title
          slug
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://silvioh22.sg-host.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  const json = await res.json();
  require('fs').writeFileSync('wp-out.json', JSON.stringify(json, null, 2));
}

test();

