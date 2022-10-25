import React from "react"
import AllRecipe from "../components/AllRecipe"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Recipe = () => {
  return (
    <Layout>
      <SEO title="Recipes" />
      <main className="page">
        <AllRecipe />
      </main>
    </Layout>
  )
}

export default Recipe
