import React from "react"
import Layout from "../components/Layout"
import { StaticImage } from "gatsby-plugin-image"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
import Recipelist from "../components/Recipelist"

export default function Home({
  data: {
    allContentfulRecipe: { nodes: recipes }
  }
}) {
  return (
    <Layout>
      <SEO title="Home " />
      <main className="page">
        <header className="hero">
          <StaticImage
            src="../assest/images/main.jpg"
            alt=".."
            className="hero-img"
            placeholder="tracedSVG"
            layout="fullWidth"
          />
          <div className="hero-container">
            <div className="hero-text">
              <h1>Veggie foodie</h1>
              <h4>best of traditions</h4>
            </div>
          </div>
        </header>
        <section className="featured-recipes">
          <h4>Eat healthy stay healthy</h4>
         
        </section>
        <Recipelist recipes={recipes} />
      </main>
    </Layout>
  )
}
export const query = graphql`
  query {
    allContentfulRecipe(
      sort: { fields: title, order: ASC }
      filter: { featured: { eq: true } }
    ) {
      nodes {
        id
        title
        cookTime
        prepTime
        content {
          tags
        }
        image {
          gatsbyImageData(layout: CONSTRAINED, placeholder: TRACED_SVG)
        }
      }
    }
  }
`
