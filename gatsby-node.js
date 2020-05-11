/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { createRemoteFileNode } = require("gatsby-source-filesystem")
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const BlogPostTemplate = path.resolve("./src/templates/BlogPost.js")
  const result = await graphql(`
{
  allWordpressPage {
    edges {
      node {
        id
        content
		__typename
		wordpress_id
		slug
		resource_urls {
			script {
				external {
					node
					url					
				}
			}
			style {
				external {
					node
					url					
				}
			}
		}
      }
    }
  }
}
  `)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const BlogPosts = result.data.allWordpressPage.edges
  BlogPosts.forEach(post => {
    createPage({
      path: `/${post.node.slug}`,
      component: BlogPostTemplate,
      context: {
        id: post.node.wordpress_id,
      },
    })
	
  })
}

exports.onCreateNode = async ({
    node,
    actions,
    store,
    createNodeId,
    cache
}) => {
    const nodeTypes = [`wordpress__PAGE`];
    if (!nodeTypes.includes(node.internal.type)) {
        return;
    }
	
	console.log ("external script length length : "+node.resource_urls.script.external.length+" page id : "+node.wordpress_id);

    const { createNode } = actions;
	
	const  jsLocal = [];
	
	const  jsLocalFooter = [];
	
	const  cssLocal = [];
	
	const  cssLocalFooter = [];
	
	if (node.resource_urls.script.external!==null) {

	for (const js_script_obj of node.resource_urls.script.external)	{
		
		let js_script_url = js_script_obj.url;
		
		let js_script_node = js_script_obj.node;
		
		if (js_script_url) {
		
			if (js_script_url.indexOf("Divi-child")!==-1 && js_script_url.indexOf("custom")!==-1) {
				continue;
			}
		
			let fileNode =  await createRemoteFileNode({
				url: js_script_url,
				store,
				cache,
				createNode,
				parentNodeId: node.id,
				createNodeId
			})
			.catch(err => {
				console.log("caught error:", err);
			});
		
			if (fileNode) {						
			
				if (js_script_node == "head") {
					jsLocal.push(fileNode.id);
				} else {
					jsLocalFooter.push(fileNode.id);
				}
			}
			
		}
	
	}
	
		if (jsLocal.length > 0) {
			node.jsLocal___NODE = jsLocal;
		}
		
		if (jsLocalFooter.length > 0) {
			node.jsLocalFooter___NODE = jsLocalFooter;
		}
	
	}
	
	if (node.resource_urls.style.external!==null) {
	
	for (const css_obj of node.resource_urls.style.external) {
		
		let css_url = css_obj.url;
		
		let css_node = css_obj.node;
		
		if (css_url) {
			let fileNodeCSS = await createRemoteFileNode({
				url: css_url,
				store,
				cache,
				createNode,
				parentNodeId: node.id,
				createNodeId
			})
			.catch(err => {
				console.log("caught error:", err)
			})
		
			if (fileNodeCSS) {						
				cssLocal.push(fileNodeCSS.id);
			}
			
		}
	
	}
	
	if (cssLocal.length > 0) {
		node.cssLocal___NODE = cssLocal;
	}
	
	}
	
};

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SitePage implements Node @dontInfer {
      path: String!
    }
  `)
}
