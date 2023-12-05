import React from "react"
import Recipelist from "./Recipelist"
import TagsList from "./TagsList"
import { graphql, useStaticQuery } from "gatsby"

const query = graphql`
 {
  allContentfulRecipe(sort: { fields: title, order: ASC }) {
    nodes {
      id
      title
      cookTime
      prepTime
      content {
        tags
      }
      image {
        gatsbyImageData(layout:  CONSTRAINED, placeholder: TRACED_SVG)
      }
    }
  }
}
`

const AllRecipe = () => {
  const data = useStaticQuery(query)
  const recipes = data.allContentfulRecipe.nodes
  
  return (
    <section className="recipes-container">
      <TagsList recipes={recipes} />
      <Recipelist recipes={recipes} />
    </section>
  )
}

export default AllRecipe
