import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { injectResources } from "../hooks/hooks"

export default ({ data }) => {
	injectResources (data);
	let page_id = "post-"+data.wordpressPage.wordpress_id;
	let page_class = "post-"+data.wordpressPage.wordpress_id+" page type-page status-publish hentry";	
  return (
  <Layout>
    <SEO
      title={data.wordpressPage.title}
      description={data.wordpressPage.title}
    />
	<div id="page-container">
			<div id="et-main-area">
				<div id="main-content">
					<article id={page_id} className={page_class}>			
						<div className="entry-content" dangerouslySetInnerHTML={{ __html: data.wordpressPage.content }} />
					</article>
				</div>
			</div>	
	</div>
  </Layout>
)
}

export const query = graphql`
  query($id: Int!) {
    wordpressPage(wordpress_id: { eq: $id }) {
      content
	  slug
      title
	  wordpress_id
      jsLocal {
        publicURL
      }
      cssLocal {
        publicURL
      }
	  resource_urls {
	  	script {
	  		inline {
				node
				value
			}
			wordpress_3rdparty {
				node
				url				
			}
	  	}
	  	style {
	  		inline {
				node
				value
			}
			wordpress_3rdparty {
				node
				url				
			}
	  	}
	  }	
    }
  }`