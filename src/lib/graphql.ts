export async function fetchGraphQL(query: string, variables = {}) {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || "https://silvioh22.sg-host.com/graphql";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Disable caching to see live WordPress updates immediately
      cache: "no-store",
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error(json.errors);
      throw new Error("Failed to fetch API");
    }

    return json.data;
  } catch (error) {
    console.error(error);
    throw new Error("Network error fetching GraphQL");
  }
}

export async function getLawFirmPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: {search: "law firm"}) {
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}

export async function getTeamPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: {search: "Team"}) {
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}

export async function getContactPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: {search: "Contact"}) {
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}

export async function getRealEstateLawPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: {search: "Real estate law"}) {
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}

export async function getAnniversaryPage() {
  const data = await fetchGraphQL(`
    query {
      pages(where: {search: "Anniversary"}) {
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}

export async function getPanoramaPage() {
  const data = await fetchGraphQL(`
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
          seo {
            title
            description
            focusKeywords
            canonicalUrl
            robots
            openGraph {
              title
              description
              image {
                secureUrl
              }
            }
          }
        }
      }
    }
  `);

  return data?.pages?.nodes[0] || null;
}
