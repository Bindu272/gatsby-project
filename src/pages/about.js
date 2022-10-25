import React from "react"
import Layout from "../components/Layout"
import { StaticImage } from "gatsby-plugin-image"
import { Link} from "gatsby"

import SEO from "../components/SEO"

const About = () => {
  return (
    <Layout>
    <SEO title="About"/>
      <main className="page">
        <section className="about-page">
          <article>
            <h2>contactEx aliqua nostrud.</h2>
            <p>
            
              Eiusmod eu excepteur exercitation aliquip non. Aute sunt sit non
              aute. Esse excepteur nisi culpa pariatur. Adipisicing incididunt
              aliquip ea nulla aute aliqua ea sunt nostrud. Anim non in laborum
              minim est ipsum Lorem.
            </p>
            <p>
              Incididunt ea do occaecat fugiat aliquip tempor mollit ullamco
              officia ullamco adipisicing ea exercitation.
            </p>
            <Link to="/contact" className="btn">
              contact
            </Link>
          </article>
          <StaticImage
            src="../assest/images/about.jpg"
            alt="..."
            className="about-img"
            placeholder="blurred"
          />
        </section>
      
      </main>
    </Layout>
  )
}

export default About
